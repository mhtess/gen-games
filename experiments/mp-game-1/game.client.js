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

  // update data object on first round, don't overwrite (FIXME)
  if(!_.has(globalGame, 'data')) {
    globalGame.data = data.dataObj;
  }

  var myCritters = data.initialLearningCritters;
  exp.slides.welcome_critterLand.crittersFromServer = myCritters;
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
        // Redirect to exit survey
        ondisconnect();
        console.log("received end message...");
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

var client_addnewround = function(game) {
  $('#roundnumber').append(game.roundNum);
};

// Set up new round on client's browsers after submit round button is pressed.
// This means clear the chatboxes, update round number, and update score on screen
var customSetup = function(game) {
  game.socket.on('newRoundUpdate', function(data){
    $('#chatbox').removeAttr("disabled");
    $('#chatbox').focus();
    $('#messages').empty();
    if(game.roundNum + 2 > game.numRounds) {
      $('#roundnumber').empty();
      $('#instructs').empty()
      .append("Round\n" + (game.roundNum + 1) + "/" + game.numRounds);
    } else {
      $('#roundnumber').empty()
      .append("Round\n" + (game.roundNum + 2) + "/" + game.numRounds);
    }
  });

  // here we will want to set the subject's stimuli (that are coming in data) to be what gets presented. 
  // this may be able to be done by modifying the slides e.g., exp.slides.learning_trial.present
  game.socket.on('exitChatRoom', function(data){
    console.log("exitChatRoom")
    console.log(data)

    exp.slides.test_critters.crittersFromServer = data.thisRoundTest;
    exp.slides.welcome_critterLand.crittersFromServer = data.nextRoundLearning;
    exp.go();
  });

  // Means both players are in the wait room, results in moving to next slide
  game.socket.on('enterWaitRoom', function(data){
    console.log("enterWaitRoom")
    // fix this later
    // if(hidden === 'hidden') {
    //   flashTitle("Connected!");
    // }
    exp.go()
  });

  // One player has not yet made it to the chatroom, so sending messages is impossible
  game.socket.on('chatWait', function(data){
    $('#chatbox').attr("disabled", "disabled");
    console.log("in chatWait");

    var blinking = setInterval(function() {
      $("#waiting").fadeOut(1000);
      $("#waiting").fadeIn(1000);
      if(!($('#chatbox').prop("disabled"))){
        $("#waiting").fadeOut(1000);
        clearInterval(blinking);
      };

    }, 2500);
      

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
      setTimeout(function() { $("#chatCont").show() }, 3*1000)
      continueButton.addEventListener("click", buttonClickListener, false);
    }
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
  if(role === globalGame.playerRoleNames.role1) {
    $('#instructs').append("Discuss with your partner what each of you learned.");
  } else if(role === globalGame.playerRoleNames.role2) {
    $('#instructs').append("Discuss with your partner what each of you learned.");
  }

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
