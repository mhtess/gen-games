/*  Copyright (c) 2012 Sven "FuzzYspo0N" Bergström, 2013 Robert XD Hawkins

    written by : http://underscorediscovery.com
    written for : http://buildnewgames.com/real-time-multiplayer/

    modified for collective behavior experiments on Amazon Mechanical Turk

    MIT Licensed.
    */
    var
    fs    = require('fs'),
    utils = require(__base + 'sharedUtils/sharedUtils.js');

// This is the function where the server parses and acts on messages
// sent from 'clients' aka the browsers of people playing the
// game. For example, if someone clicks on the map, they send a packet
// to the server (check the client_on_click function in game.client.js)
// with the coordinates of the click, which this function reads and
// applies.
var startTime;




var onMessage = function(client,message) {
  //Cut the message up into sub components
  var message_parts = message.split('.');

  //The first is always the type of message
  var message_type = message_parts[0];

  //Extract important variables
  var gc = client.game;
  var id = gc.id;
  var all = gc.get_active_players();
  gc.rounds = {"playerA": 1, "playerB": 1};
  // gets current player and differentiates them from other players
  var target = gc.get_player(client.userid);
  var others = gc.get_others(client.userid);

  switch(message_type) {

    // keeps track of which "experiment template" slide each particular user is on
    // will update (through use of globalGame.socket.send("enterSlide.slide_name.");) in game js file
    case 'enterSlide' :
      gc.currentSlide[target.instance.role] = message_parts[1]
      console.log("Player A is in: ==== " + gc.currentSlide["playerA"] + " ====")
      console.log("Player B is in: ==== " + gc.currentSlide["playerB"] + " ====")
      break;

    // continue button from chat room
    case 'clickedObj' :
      gc.state.roundNum += 1;
      setTimeout(function() {
        _.map(all, function(p){
            // tell client to advance to next slide
            var playerRole = p.instance.role;
            // here, decide what data to pass to each subject
            console.log("Enter block num ==== " + (gc.roundNum + 1) + " ====")

            var dataPacket = {
              thisRoundTest: gc.testList[playerRole][gc.roundNum],
              nextRoundLearning: gc.trialList[playerRole][gc.roundNum + 1],
              currentRoundNum: gc.state.roundNum
            };
            // calls exitChatRoom to move to next slide and collect data to the packet
            p.player.instance.emit("exitChatRoom", dataPacket)

            _.map(all,function(p){
                p.player.instance.emit('newRoundUpdate', {user: client.userid});
            });
          });
          // tell server to advance to next round (or if at end, disconnect)
          gc.roundNum += 1;
        }, 3);
      break;

    // will result in "other player is typing" on others' chatboxes
    case 'playerTyping' :
      _.map(others, function(p) {
        p.player.instance.emit( 'playerTyping',
         {typing: message_parts[1]});
      });
      break;

    // Only allows a message to be sent when both players are present in the chatroom
    // If this is true, the message will be relayed
    case 'chatMessage' :
      if(gc.currentSlide["playerA"] == gc.currentSlide["playerB"]) {
          // Update others
          var msg = message_parts[1].replace(/~~~/g,'.');
          _.map(all, function(p){
           p.player.instance.emit( 'chatMessage', {user: client.userid, msg: msg});});
      }
      break;

    // Will show a wait message if only one player is in the chatroom
    // Will allow them to enter the chatroom
    case 'enterChatRoom' :
      if (gc.currentSlide["playerA"] != gc.currentSlide["playerB"]) {
        target.instance.emit("chatWait", {})
      } else {
        setTimeout(function() {
          _.map(all, function(p){
            p.player.instance.emit("enterChatRoom", {})
          });
          startTime = Date.now();
        }, 300);
      }
      break;

    // Seems confusing, but this fn actually goes to the wait room and only moves forward,
    // (enterWaitRoom) when both the speaker (playerA) and listener (playerB) are in the wait room
    case 'enterWaitRoom' :
      if (gc.currentSlide["playerA"] == gc.currentSlide["playerB"]) {
        setTimeout(function() {
          _.map(all, function(p){
            p.player.instance.emit("enterWaitRoom", {})
          });
        }, 300);
      }
      break;

    case 'logResponse' :
       break

    // Receive message when browser focus shifts
    case 'h' :
      target.visible = message_parts[1];
      break;

    case 'sendingTestScores' :
       var scoreObj = _.fromPairs(_.map(
        message_parts.slice(2), // get relevant part of message
        function(i){return i.split(',')}))

      gc.testScores[target.instance.role].push(scoreObj);


      // if (gc.currentSlide["playerA"] == gc.currentSlide["playerB"]) {
        //var msg = message_parts[1].replace(/~~~/g,'.');
        setTimeout(function() {
          _.map(all, function(p){
            p.player.instance.emit("sendingTestScores",
              gc.testScores)
          });
        }, 300);
      // }
      break;

    case 'calculatingReward' :

      setTimeout(function() {
          _.map(all, function(p){
            p.player.instance.emit("calculatingReward",
              {})
          });
        }, 300);
      break;
  }
};



/*
  Associates events in onMessage with callback returning json to be saved
  {
    <eventName>: (client, message_parts) => {<datajson>}
  }
  Note: If no function provided for an event, no data will be written
*/
var dataOutput = function() {

  function commonOutput (client, message_data) {
    return {
      iterationName: client.game.iterationName,
      gameid: client.game.id,
      time: Date.now(),
      trialNum : client.game.state.roundNum + 1,
      workerId: client.workerid,
      assignmentId: client.assignmentid,
      role: client.role
    };
  };

  function decodeData(dataObj){
    return _.mapValues(dataObj, function(val){
      return val.replace("&", ".")
    })
  }

  function flattenedArrayToObj(m_data){
    return _.fromPairs(_.map(m_data, function(i){return i.split(',')}))
  }

  var logResponseOutput = function(client, message_data) {
    // message_data contrains the flattened JSON object with test trial info.
    return _.extend(
      commonOutput(client, message_data),
      decodeData(flattenedArrayToObj(message_data.slice(2)))
    );
  };

  var chatMessageOutput = function(client, message_data) {
    // var intendedName = getIntendedTargetName(client.game.trialInfo.currStim);
    console.log(client.role + " said " + message_data[1].replace(/~~~/g, '.'))
    return _.extend(
      commonOutput(client, message_data), {
      	// intendedName,
      	text: message_data[1].replace(/~~~/g, '.'),
      	reactionTime: message_data[2]
      }
    );
  };

  return {
    'chatMessage' : chatMessageOutput,
    'logTest' : logResponseOutput,
    'logTrain': logResponseOutput,
    'logScores': logResponseOutput,
    'logSubjInfo': logResponseOutput
  };
}();

var setCustomEvents = function(socket) {
  //empty
};


module.exports = {dataOutput, setCustomEvents, onMessage}
