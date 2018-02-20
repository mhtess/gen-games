//   Copyright (c) 2012 Sven "FuzzYspo0N" Bergström,
//                   2013 Robert XD Hawkins

//     written by : http://underscorediscovery.com
//     written for : http://buildnewgames.com/real-time-multiplayer/

//     modified for collective behavior experiments on Amazon Mechanical Turk

//     MIT Licensed.


// /*
//    THE FOLLOWING FUNCTIONS MAY NEED TO BE CHANGED
// */

// A window global for our game root variable.
var globalGame = {};
var enterScoreReport = 0;
var totalScore = 0;
//var totalRounds = null;

// Update client versions of variables with data received from
// server_send_update function in game.core.js
// data refers to server information
var client_onserverupdate_received = function(data){

  if(data.players) {
    _.map(_.zip(data.players, globalGame.players),function(z){
      z[1].id = z[0].id;
    });
  }

  globalGame.game_started = data.gs;
  globalGame.players_threshold = data.pt;
  globalGame.player_count = data.pc;
  globalGame.roundNum = data.roundNum;
  globalGame.testScores = data.testScores;
  //globalGame.bonusAmt = data.bonusAmt;

  // update data object on first round, don't overwrite (FIXME)
  if(!_.has(globalGame, 'data')) {
    globalGame.data = data.dataObj;
  }

  var myCritters = data.initialLearningCritters;
  exp.slides.learning_critters.crittersFromServer = myCritters;
};

// gets messages from the server/game file, parses them
var client_onMessage = function(data) {

  var commands = data.split('.');
  var command = commands[0];
  var subcommand = commands[1] || null;
  var commanddata = commands[2] || null;

  switch(command) {
    case 's': //server message
    switch(subcommand) {
      case 'end' :
        // Redirect to exit survey only if it is not the last round
        if(globalGame.roundNum < globalGame.numRounds || globalGame.numRounds == null) {
          $('#thanks').hide();
          ondisconnect();
          console.log("received end message...");
        }
        break;

        case 'feedback' :
          // Prevent them from sending messages b/w trials
          $('#chatbox').attr("disabled", "disabled");
          var objToHighlight;
          var upperLeftX;
          var upperLeftY;
          var strokeColor;
          var clickedObjStatus = commanddata;

          // update local score
          globalGame.data.subject_information.score += clickedObjStatus === "target";

          // draw feedback
          if (globalGame.my_role === globalGame.playerRoleNames.role1) {
           objToHighlight = _.filter(globalGame.currStim, function(x){
             return x.targetStatus == clickedObjStatus;
           })[0];
           upperLeftX = objToHighlight.speakerCoords.gridPixelX;
           upperLeftY = objToHighlight.speakerCoords.gridPixelY;
          } else {
           objToHighlight = _.filter(globalGame.currStim, function(x){
             return x.targetStatus == "target";
           })[0];
           upperLeftX = objToHighlight.listenerCoords.gridPixelX;
           upperLeftY = objToHighlight.listenerCoords.gridPixelY;
          }
          if (upperLeftX != null && upperLeftY != null) {
            globalGame.ctx.beginPath();
            globalGame.ctx.lineWidth="10";
            globalGame.ctx.strokeStyle="green";
            globalGame.ctx.rect(upperLeftX+5, upperLeftY+5,290,290);
            globalGame.ctx.stroke();
          }
          break;

      // Not in database, so you can't play...
      case 'alert' :
        alert('You did not enter an ID');
        window.location.replace('http://nodejs.org'); break;

      //join a game requested
      case 'join' :
        var num_players = commanddata;
        client_onjoingame(num_players, commands[3]); break;

      // New player joined... Need to add them to our list.
      case 'add_player' :
        console.log("adding player" + commanddata);
        console.log("cancelling timeout");
        clearTimeout(globalGame.timeoutID);
        // if(hidden === 'hidden') {
        //   flashTitle("Connected!");
        // }
        globalGame.players.push({id: commanddata, player: new game_player(globalGame)}); break;
    }
  }
};

// var client_addnewround = function(game) {
//   $('#roundnumber').append(game.roundNum);
// };

// Set up new round on client's browsers after submit round button is pressed.
// This means clear the chatboxes, update round number
var customSetup = function(game) {
  game.socket.on('newRoundUpdate', function(data){
    $('#chatbox').removeAttr("disabled");
    $('#chatbox').focus();
    $('#messages').empty();
    $('#roundnumber').empty();
  });

  // update critters from server for the upcoming test critters and next learning critters
  game.socket.on('exitChatRoom', function(data){
    console.log("exitChatRoom")
    exp.slides.test_critters.crittersFromServer = data.thisRoundTest;
    exp.slides.test_critters.selfOrPartner = data.thisRoundTestType;
    exp.slides.learning_critters.crittersFromServer = data.nextRoundLearning;

    globalGame.roundNum = data['currentRoundNum'];
    exp.go();
  });

  // Means both players are in the wait room, results in moving to next slide
  // Most code is so the the first player who gets there will see "Connected!" on
  // the tab when the second player enters. This will allow users to konw when they can move forward
  game.socket.on('enterWaitRoom', function(data){
    $('#chatbox').val('');
    var original = document.title;
    var timeout;
    var cancelFlashTitle = function (timeout) {
      clearTimeout(timeout);
      document.title = original;
    };
    console.log("enterWaitRoom")
    if(hidden === 'hidden') {
      newMsg = "Connected!"
      function step() {
        document.title = (document.title == original) ? newMsg : original;
        if (visible === "hidden") {
          timeout = setTimeout(step, 500);
        } else {
          document.title = original;
        }
      };
      cancelFlashTitle(timeout);
      step();
    }

    exp.go()
  });

  // One player has not yet made it to the chatroom, so sending messages is impossible
  game.socket.on('chatWait', function(data){
    $('#chatbox').attr("disabled", "disabled");
    console.log("in chatWait");
    $("#waiting").show();

  });

  // Both players are now in the chatroom, so they may send messages
  // the waiting message is therefore now hidden
  game.socket.on('enterChatRoom', function(data){
    console.log("enterChatRoom")
    $('#chatbox').removeAttr("disabled");
    $('#waiting').hide();

    // set mouse-tracking event handler
    if (globalGame.my_role === globalGame.playerRoleNames.role2) {
      // only role2 gets to see Continue button and press Continue
      var continueButton = document.getElementById("chatCont")
      var nSecondsTimeOut = 30;
      setTimeout(function() { $("#chatCont").show() }, nSecondsTimeOut*1000)
      continueButton.addEventListener("click", buttonClickListener, false);
    }
  });

  // Creates the score reports for the players
  game.socket.on('sendingTestScores', function(data){
    console.log("sendingTestScores");
    console.log("scores: " + JSON.stringify(data));
    enterScoreReport++;
    // only works when both players have reached this, then it generates scores for both players
    if(enterScoreReport % 2 == 0){ //hacky way to handle error thrown when only one player finishes the test
      var ind = (enterScoreReport / 2) - 1;
      var my_role = globalGame.my_role;
      var partner_role = my_role === "a" ? "b" : "a"
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
        var player_score = Number(data[role_index][ind].hit) - Number(data[role_index][ind].falseAlarm);

        console.log(player_score)

        var positive_score = player_score > 0 ? player_score : 0
        $('#'+score_role+'_score').html(positive_score);
        totalScore += positive_score;
        // console.log("Total Score: " + totalScore);

        $('#'+score_role+'_hits').html("Correctly selected: " + data[role_index][ind].hit + " out of " + (Number(data[role_index][ind].hit) + Number(data[role_index][ind].miss)));
        $('#'+score_role+'_falseAlarms').html("Selected incorrectly: " + data[role_index][ind].falseAlarm + " out of "+ (Number(data[role_index][ind].falseAlarm) + Number(data[role_index][ind].correctRejection)));

        $('#'+score_role+'_score').html("Round score: " + positive_score);

        // $('#'+score_role+'_misses').html("Misses: "+ data[role_index][ind].misses);
        // $('#'+score_role+'_correctRejections').html("Correct Rejections: "+ data[role_index][ind].correctRejections);
      }
    }
  });

  game.socket.on('calculatingReward', function(data){
    console.log("calculatingReward");
    var reward = totalScore * globalGame.bonusAmt * 0.01;
    console.log("reward: $" + reward);
  });


  // initialize experiment_template
  init()
};

// called when a player joins the game / gets connected
var client_onjoingame = function(num_players, role) {
  // set role locally
  globalGame.my_role = role;
  console.log(role)
  globalGame.get_player(globalGame.my_id).role = globalGame.my_role;

  _.map(_.range(num_players - 1), function(i){
    globalGame.players.unshift({id: null, player: new game_player(globalGame)});
  });

  // Update w/ role (can only move stuff if agent)
  $('#roleLabel').append(role + '.');

  if(num_players == 1) {
    // Set timeout only for first player...
    this.timeoutID = setTimeout(function() {
      if(_.size(this.urlParams) == 4) {
       this.submitted = true;
       window.opener.turk.submit(this.data, true);
       window.close();
     } else {
       console.log("would have submitted the following :");
       console.log(this.data);
     }
   }, 1000 * 60 * 15);
  }
};


/*
 MOUSE EVENT LISTENERS
 */
function buttonClickListener(evt) {
  console.log("cliked button")
  globalGame.socket.send("clickedObj.");
};
