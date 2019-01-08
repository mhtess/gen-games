//   Copyright (c) 2012 Sven "FuzzYspo0N" Bergström,
//                 2013 Robert XD Hawkins
//   Written by : http://underscorediscovery.com
//   Written for : http://buildnewgames.com/real-time-multiplayer/
//   Modified for collective behavior experiments on Amazon Mechanical Turk
//   MIT Licensed.

// ----------------
// GLOBAL VARIABLES
// ----------------
var
  fs    = require('fs'),
  utils = require(__base + 'sharedUtils/sharedUtils.js');

var multipleTrialResponses = function(client, data) {
    // This is the function where the server parses and acts on
    // a list of trial data sent from 'clients', i.e. browsers of 
    // people playing the game.
    // 
    // Note: We separate this out from onMessage, as we might
    // want to emit list of JSON objects. These are hard to
    // serialize in a single message in a format that won't
    // interfere with the existing messages API.
    // Thus, we have factored this out separately.
    var info = {
        'info': commonOutput(client)
    };
    return _.extend(data, info);
}
    
var onMessage = function(client, message) {
    // This is the function where the server parses and acts on messages
    // sent from 'clients' aka the browsers of people playing the
    // game.

    // Cut the message up into sub components
    var message_parts = message.split('.');
    var message_type = message_parts[0];

    // Get game information
    var gc = client.game;
    var id = gc.id;
    var all = gc.get_active_players();
    gc.rounds = {"explorer": 1, "students": 1};

    // Get current player and differentiates him/her from others
    var target = gc.get_player(client.userid);
    var others = gc.get_others(client.userid);

    switch(message_type) {
        case 'enterSlide' :
            // keeps track of which "experiment template" slide each particular user is on
            // will update (through use of globalGame.socket.send("enterSlide.slide_name.");) in game js file
            gc.currentSlide[target.instance.role] = message_parts[1];
            console.log("Explorer is in: ==== " + gc.currentSlide["explorer"] + " ====")
            console.log("Student is in: ==== " + gc.currentSlide["student"] + " ====")
            break;

        case 'proceedToTestInstructions' :
            _.map(all, function(p) {
                p.player.instance.emit('exitChatRoom');
            });
            break;

        case 'newRoundUpdate' :
            gc.numPlayersCompletedRound++;
            if (gc.numPlayersCompletedRound == 2) {
                gc.newRound();
            }
            break;

        case 'playerTyping' :
            // will result in "other player is typing" on others' chatboxes
            _.map(others, function(p) {
                p.player.instance.emit( 'playerTyping',
                {typing: message_parts[1]});
            });
        break;

        case 'chatMessage' :
            // Only allows a message to be sent when both players are present in the chatroom
            // If this is true, the message will be relayed
            if(gc.currentSlide["explorer"] == gc.currentSlide["student"]) {
                // Update others
                var msg = message_parts[1].replace(/~~~/g,'.');
                _.map(all, function(p){
                    p.player.instance.emit( 'chatMessage', {user: client.userid, msg: msg});
                });
            }
            break;

        case 'enterChatRoom' :
            // Will show a wait message if only one player is in the chatroom
            // Will allow them to enter the chatroom
            if (gc.currentSlide["explorer"] != gc.currentSlide["student"]) {
                console.log("Waiting for another player.....");
                target.instance.emit("chatWait", {})
            } else {
                setTimeout(function() {
                _.map(all, function(p){
                    p.player.instance.emit("enterChatRoom", {})
                });
                }, 300);
            }
            break;

        // Receive message when browser focus shifts
        case 'h' :
            target.visible = message_parts[1];
            break;

        case 'sendingTestScores':
            var scoreObj = _.fromPairs(_.map(
                message_parts.slice(1), // get relevant part of message
                function(i){return i.split(',')}
            ));

            gc.testScores[target.instance.role][gc.roundNum] = scoreObj;
            setTimeout(function() {
                _.map(all, function(p){
                p.player.instance.emit("sendingTestScores",
                    gc.testScores)
                });
            }, 300);
            break;
    }
};

var commonOutput = function (client) {
    var roundNum = client.game.roundNum;
    var trialInfo = client.game.trialList[roundNum];

    return {
        experimentName: client.game.experimentName,
        iterationName: client.game.iterationName,
        gameid: client.game.id,
        time: Date.now(),
        role: client.role,
        rule_idx: trialInfo.ruleIdx,
        rule_name: '"' + trialInfo.name + '"',
        rule_file_name: trialInfo.fileName,
        round_num: roundNum,
    };
}

/*
  Associates events in onMessage with callback returning json to be saved
  {
    <eventName>: (client, message_parts) => {<datajson>}
  }
  Note: If no function provided for an event, no data will be written
*/
var dataOutput = function() {
  function decodeData(dataObj){
    var result = _.mapValues(dataObj, function(val){
      if (val == undefined) {
        return '';
      } else if (utils.isNumeric(val)) {
        return val
      } else {
        return val.replace("&", ".")
      }
    });
    return result;
  }

  function flattenedArrayToObj(m_data){
    return _.fromPairs(_.map(m_data, function(i){return i.split(',')}))
  }

  // takes the data sent from client and packages it into logResponseOutput
  var logResponseOutput = function(client, message_data) {
    // message_data constrains the flattened JSON object with training/test trial info.
    var result = _.extend(
      commonOutput(client),
      decodeData(flattenedArrayToObj(message_data.slice(2)))
    );
    console.log(result);
    return result;
  };


  var chatMessageOutput = function(client, message_data) {
    console.log(client.role + " said " + message_data[1].replace(/~~~/g, '.'))
    return _.extend(
      commonOutput(client), {
      	// intendedName,
      	text: '"' + message_data[1].replace(/~~~/g, '.') + '"',
      	reactionTime: message_data[2]/1000.0,
      }
    );
  };

  return {
    'chatMessage' : chatMessageOutput,
    'logTest' : logResponseOutput,
    'logTrain': logResponseOutput,
    'logScores': logResponseOutput,
    'logSubjInfo': logResponseOutput,
    'logTimes': logResponseOutput,
  };
}();

var setCustomEvents = function(socket) {
  //empty
};

module.exports = {dataOutput, setCustomEvents, onMessage, multipleTrialResponses}
