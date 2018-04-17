//   Copyright (c) 2012 Sven "FuzzYspo0N" Bergström,
//                 2013 Robert XD Hawkins
//   Written by : http://underscorediscovery.com
//   Written for : http://buildnewgames.com/real-time-multiplayer/
//   Modified for collective behavior experiments on Amazon Mechanical Turk
//   MIT Licensed.

// ----------------
// GLOBAL VARIABLES
// ----------------
var globalGame = {};
var enterScoreReport = 0;
var totalScore = 0;
var timeOut = 1000 * 60 * 15; // 15 Minutes
var timeoutIndex;
var original = document.title;

// ----------------
// ACTION HANDLERS
// ---------------
function buttonClickListener(evt) {
  globalGame.socket.send("clickedObj.");
};

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

  // Update w/ role (can only move stuff if agent)
  $('#roleLabel').append(role + '.');

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
   }, timeOut);
  }
};

// Procedure for handling updates from server.
// Note: data holds the server's copy of variables.
var client_onserverupdate_received = function(data){
  // Copy players to local globalGame
  if(data.players) {
    _.map(_.zip(data.players, globalGame.players),function(z){
      z[1].id = z[0].id;
    });
  }

  // Copy game parameters to local globalGame
  globalGame.game_started = data.gs;
  globalGame.players_threshold = data.pt;
  globalGame.player_count = data.pc;
  globalGame.roundNum = data.roundNum;
  globalGame.testScores = data.testScores;

  // update data object on first round, don't overwrite (FIXME)
  if(!_.has(globalGame, 'data')) {
    globalGame.data = data.dataObj;
  }

  // Add the training critters and test critters to the exp slides
  exp.slides.learning_critters.present = data.training_critters;
  exp.slides.testing_critters.present = data.testing_critters;
  if (Array.isArray(data.training_critters)) {
    exp.num_learning_trials = data.training_critters.length;
    exp.num_learning_trials = 3;
  }
  if (Array.isArray(data.testing_critters)) {
    exp.num_testing_trials = data.testing_critters.length;
    exp.num_testing_trials = 5;
  }
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

// Set up new round on client's browsers after submit round button is pressed.
// This means clear the chatboxes, update round number
var customSetup = function(globalGame) {
  globalGame.socket.on('newRoundUpdate', function(data){
    $('#chatbox').removeAttr("disabled");
    $('#chatbox').focus();
    $('#messages').empty();
    $('#roundnumber').empty();
  });

  // update critters from server for the upcoming test critters and next learning critters
  globalGame.socket.on('exitChatRoom', function(data){
    console.log("exitChatRoom")
    exp.goToSlide("testing_instructions");
  });

  globalGame.socket.on('enterWaitRoom', function(data){
    $('#chatbox').val('');
    exp.goToSlide("score_report");
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
      var nSecondsTimeOut = 30;
      setTimeout(function() { $("#chatCont").show() }, nSecondsTimeOut*1000);
      continueButton.addEventListener("click", buttonClickListener, false);
    }
  });

  // Creates the score reports for the players
  globalGame.socket.on('sendingTestScores', function(data){
    console.log("sendingTestScores");
    console.log("scores: " + JSON.stringify(data));
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
        var player_score = Number(data[role_index][0].hits) - Number(data[role_index][0].false_alarms);
        var positive_score = player_score > 0 ? player_score : 0
        $('#'+score_role+'_score').html(positive_score);
        totalScore += positive_score;
        $('#'+score_role+'_hits').html("Correctly selected: " + data[role_index][0].hits + " out of " + (Number(data[role_index][0].hits) + Number(data[role_index][0].misses)));
        $('#'+score_role+'_falseAlarms').html("Selected incorrectly: " + data[role_index][0].false_alarms + " out of "+ (Number(data[role_index][0].false_alarms) + Number(data[role_index][0].correct_rejections)));
        $('#'+score_role+'_score').html("Round score: " + positive_score);
      }
    }
  });

  globalGame.socket.on('calculatingReward', function(data){
    console.log("calculatingReward");
    var reward = totalScore * globalGame.bonusAmt * 0.01;
    console.log("reward: $" + reward);
  });

  // initialize experiment_template
  init();
};
