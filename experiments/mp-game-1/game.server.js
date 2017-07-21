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
var onMessage = function(client,message) {
  console.log("server onMessage")
  //Cut the message up into sub components
  var message_parts = message.split('.');

  //The first is always the type of message
  var message_type = message_parts[0];

  //Extract important variables
  var gc = client.game;
  var id = gc.id;
  var all = gc.get_active_players();
  // gets current player and differentiates them from other players
  var target = gc.get_player(client.userid);
  var others = gc.get_others(client.userid);

  switch(message_type) {

    // keeps track of which "experiment template" slide each particular user is on
    // will update (through use of globalGame.socket.send("enterSlide.slide_name.");) in game js file
    case 'enterSlide' :
      gc.currentSlide[target.instance.role] = message_parts[1]
      break;

    // continue button from chat room
    case 'clickedObj' :
      setTimeout(function() {
        _.map(all, function(p){
            // tell client to advance to next slide
            var playerRole = p.instance.role;
            // here, decide what data to pass to each subject
            var dataPacket = {
              thisRoundTest: gc.testList[playerRole][gc.roundNum],
              nextRoundLearning: gc.trialList[playerRole][gc.roundNum + 1]
            };
            // calls exitChatRoom to move to next slide and collect data to the packet
            p.player.instance.emit("exitChatRoom", dataPacket)
          });
          // tell server to advance to next round (or if at end, disconnect)
          gc.roundNum += 1;
        }, 300);
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
      if(gc.currentSlide["speaker"] == gc.currentSlide["listener"]) {
        writeData(client, "message", message_parts);
          // Update others
          var msg = message_parts[1].replace(/~~~/g,'.');
          _.map(all, function(p){
           p.player.instance.emit( 'chatMessage', {user: client.userid, msg: msg});});
      }
      break;

    // Will show a wait message if only one player is in the chatroom
    // Will allow them to enter the chatroom
    case 'enterChatRoom' :
      if (gc.currentSlide["speaker"] != gc.currentSlide["listener"]) {
        target.instance.emit("chatWait", {})
      } else {
        setTimeout(function() {
          _.map(all, function(p){
            p.player.instance.emit("enterChatRoom", {})
          });
        }, 300);      
      } 
      break;

    // Seems confusing, but this fn actually goes to the wait room and only moves forward,
    // (enterWaitRoom) when both the speaker and listener are in the wait room
    case 'enterWaitRoom' :
      if (gc.currentSlide["speaker"] == gc.currentSlide["listener"]) {
        setTimeout(function() {
          _.map(all, function(p){
            p.player.instance.emit("enterWaitRoom", {})
          });
        }, 300);
      }
      break;

    // Receive message when browser focus shifts
    case 'h' : 
      target.visible = message_parts[1];
      break;
  }
};

// Collects data..
var writeData = function(client, type, message_parts) {
  var gc = client.game;
  var roundNum = gc.state.roundNum + 1;
  var id = gc.id;
  switch(type) {
    case "clickedObj" :
    var outcome = message_parts[2] === "target";
    var targetVsD1 = utils.colorDiff(getStim(gc, "target"), getStim(gc, "distr1"));
    var targetVsD2 = utils.colorDiff(getStim(gc, "target"), getStim(gc, "distr2"));
    var D1VsD2 = utils.colorDiff(getStim(gc, "distr1"), getStim(gc, "distr2"));
    var line = (id + ',' + Date.now() + ',' + roundNum  + ',' +
      message_parts.slice(1).join(',') +
      targetVsD1 + "," + targetVsD2 + "," + D1VsD2 + "," + outcome +
      '\n');
    console.log("clickedObj:" + line);
    break;


    case "message" :
    var msg = message_parts[1].replace(/~~~/g,'.');
    var line = (id + ',' + Date.now() + ',' + roundNum + ',' + client.role + ',"' + msg + '"\n');
    console.log("message:" + line);
    break;
  }
  gc.streams[type].write(line, function (err) {if(err) throw err;});
};

// used in the fn above to collect data
var getStim = function(game, targetStatus) {
  return _.filter(game.trialInfo.currStim, function(x){
    return x.targetStatus == targetStatus;
  })[0]['color'];
};


// /*
//    The following functions should not need to be modified for most purposes
// */

var startGame = function(game, player) {
  // Establish write streams
  var startTime = utils.getLongFormTime();
  var dataFileName = startTime + "_" + game.id + ".csv";
  utils.establishStream(game, "message", dataFileName,
   "gameid,time,roundNum,sender,contents\n");
  utils.establishStream(game, "clickedObj", dataFileName,
   "gameid,time,roundNum,condition," +
   "clickStatus,clickColH,clickColS,clickColL,clickLocS,clickLocL"+
   "alt1Status,alt1ColH,alt1ColS,alt1ColL,alt1LocS,alt1LocL" +
   "alt2Status,alt2ColH,alt2ColS,alt2ColL,alt2LocS,alt2LocL" +
   "targetD1Diff,targetD2Diff,D1D2Diff,outcome\n");
  game.newRound();
};

module.exports = {
  writeData : writeData,
  startGame : startGame,
  onMessage : onMessage
};
