//   Copyright (c) 2012 Sven "FuzzYspo0N" Bergström,
//                 2013 Robert XD Hawkins
//   Written by : http://underscorediscovery.com
//   Written for : http://buildnewgames.com/real-time-multiplayer/
//   Modified for collective behavior experiments on Amazon Mechanical Turk
//   MIT Licensed.

// ----------------
// GLOBAL VARIABLES
// ----------------
var globalGame = {},
    enterScoreReport = 0,
    timeout = 1000 * 60 * 15 // 15 minutes,
    timeoutIndex = 0,
    originalTitle = document.title;

// ----------------
// EVENT HANDLERS
// ---------------
// Procedure for creating a new player, upon joining a globalGame
var client_onjoingame = function(num_players, role) {
  console.log("Inside client_onjoingame");

  // Set player role
  globalGame.my_role = role;
  globalGame.get_player(globalGame.my_id).role = globalGame.my_role;

  // Create player
  _.map(_.range(num_players - 1), function(i){
    globalGame.players.unshift({id: null, player: new game_player(globalGame)});
  });

  // Set 15 minute timeout only for first player...
  if(num_players == 1) {
    this.timeoutID = setTimeout(function() {
      if(_.size(this.urlParams) == 4) {
       this.submitted = true;
       window.opener.turk.submit(this.data, true);
       window.close();
     } else {
       console.log("would have submitted the following :");
       console.log(this.data);
     }
   }, timeout);
  }
};

// Procedure for handling updates from server.
// Note: data holds the server's copy of variables.
var client_onserverupdate_received = function(data){
    if(data.players) {
        _.map(_.zip(data.players, globalGame.players),function(z){
            z[1].id = z[0].id;
        });
    }

    // Copy game parameters to local globalGame
    globalGame.start_time = data.st;
    globalGame.players_threshold = data.pt;
    globalGame.player_count = data.pc;
    globalGame.roundNum = data.roundNum;
    globalGame.numRounds = data.numRounds;

    // update data object on first round, don't overwrite (FIXME)
    if(!_.has(globalGame, 'data')) {
        globalGame.data = data.dataObj;
    }

  // Add the training critters and test critters to the exp slides
//   exp.training_critters = data.training_critters;
//   exp.testing_critters = data.testing_critters;
};

// Procedure for parsing messages from server.
var client_onMessage = function(data) {
  var commands = data.split('.');
  var command = commands[0];
  var subcommand = commands[1] || null;
  var commanddata = commands[2] || null;

  switch(command) {
    case 's': //server message
    switch(subcommand) {
      
      case 'end' : // Redirect to exit survey only if it is not the last round
        if(globalGame.roundNum < globalGame.numRounds || globalGame.numRounds == null) {
          $('#thanks').hide();
          ondisconnect();
          console.log("received end message...");
        }
        break;

      case 'alert' : // Not in database, so you can't play...
        alert('You did not enter an ID');
        window.location.replace('http://nodejs.org'); break;
      
      case 'join' : // Game join request
        var num_players = commanddata;
        client_onjoingame(num_players, commands[3]); break;
      
      case 'add_player' : // New player joined... Need to add them to our list.
        console.log("adding player" + commanddata);
        console.log("cancelling timeout");
        clearTimeout(globalGame.timeoutID);
        globalGame.players.push({id: commanddata, player: new game_player(globalGame)}); break;
    }
  }
};


var customSetup = function(globalGame) {
    // customSetup is automatically triggered by window.on_load()
    // in the shared clientBase.js code

    // First, draw the waiting room properly
    drawWaitingRoom("Waiting for another player to join the game ...");

    globalGame.socket.on('newRoundUpdate', function(data){
        clearWaitingRoom();
        drawRoundNumber(data, globalGame);
    });

    globalGame.socket.on('exitChatRoom', function(data) {
        // exp.goToSlide('testing_instructions');
    });

    globalGame.socket.on('enterWaitRoom', function(data){
        $('#chatbox').val('');
        // exp.go();
    });

  // One player has not yet made it to the chatroom, so sending messages is impossible
  globalGame.socket.on('chatWait', function(data){
    $('#chatbox').attr("disabled", "disabled");
    console.log("in chatWait");
    // Pretty Animation (Fade In / Out)
    globalGame.blinking_wait = setInterval(function() {
      $("#status").fadeOut(1000);
      $("#status").fadeIn(1000);
    });
    $("#status").show();
  });

  // Both players are now in the chatroom, so they may send messages
  // the waiting message is therefore now hidden
  globalGame.socket.on('enterChatRoom', function(data){
    console.log("enterChatRoom")
    $('#chatbox').removeAttr("disabled");
    $('#status').show();
    $('#status').html('<div id = "status"><p style="color:green;">Chatroom has connected with your partner!  <br>You may begin messaging!</p></div>');
    var visible = 'hidden';
    if(hidden === 'hidden') {
      newMsg = "Connected!"
      function step() {
        document.title = (document.title == original) ? newMsg : original;
        if (visible === "hidden") {
          timeoutIndex = setTimeout(step, 500);
        } else {
          document.title = original;
        }
      };
      step();
    }

    // set mouse-tracking event handler
    if (globalGame.my_role === globalGame.playerRoleNames.role2) {
      // only role2 gets to see Continue button and press Continue
      var continueButton = document.getElementById("chatCont");
      var nSecondsTimeOut = 1;
      setTimeout(function() { $("#chatCont").show() }, nSecondsTimeOut*1000);
      continueButton.addEventListener("click", buttonClickListener, false);
    }
  });

  // Creates the score reports for the players
  globalGame.socket.on('sendingTestScores', function(data){
    enterScoreReport++;
    // only works when both players have reached this, then it generates scores for both players
    if(enterScoreReport % 2 == 0){ //hacky way to handle error thrown when only one player finishes the test
      var ind = (enterScoreReport / 2) - 1;
      var my_role = globalGame.my_role;
      var partner_role = my_role === "explorer" ? "student" : "explorer"
      for(var i=0; i<2; i++){
        var score_role, role_index;
        if(i==0){
          score_role="your";
          role_index=my_role;
        }
        else if(i==1){
          score_role="other";
          role_index=partner_role;
        }

        var hits = Number(data[role_index][globalGame.roundNum].hits);
        var misses = Number(data[role_index][globalGame.roundNum].misses);
        var correctRejections = Number(data[role_index][globalGame.roundNum].correct_rejections);
        var falseAlarms = Number(data[role_index][globalGame.roundNum].false_alarms);
        var playerScore =  hits - falseAlarms;
        var positiveScore = playerScore > 0 ? playerScore : 0;
        $('#'+score_role+'_score').html(positiveScore);
        $('#'+score_role+'_hits').html("Correctly selected: " + hits+ " out of " + (hits + misses));
        $('#'+score_role+'_falseAlarms').html("Selected incorrectly: " + falseAlarms + " out of "+ (falseAlarms + correctRejections));
        $('#'+score_role+'_score').html("Round score: " + positiveScore);
      }

    //   exp.test_summary_stats_combined.push({"explorer": data["explorer"][globalGame.roundNum], "student": data["student"][globalGame.roundNum]});
    }
  });

};
