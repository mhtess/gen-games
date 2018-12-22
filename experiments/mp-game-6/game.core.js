//   Copyright (c) 2012 Sven "FuzzYspo0N" Bergström,
//                 2013 Robert XD Hawkins
//   Written by : http://underscorediscovery.com
//   Written for : http://buildnewgames.com/real-time-multiplayer/
//   Modified for collective behavior experiments on Amazon Mechanical Turk
//   MIT Licensed.

// -------------------------------------------------------------------
// The main game class. This gets created on both server and
//   client. Server creates one for each game that is hosted, and each
//   client creates one for itself to play the game. When you set a
//   variable, remember that it's only set in that instance.
// -------------------------------------------------------------------

// -----------------------------
// LOAD DEPENDENCIES (IF SERVER)
// -----------------------------
var has_require = typeof require !== "undefined";
if (typeof _ === "undefined" ) {
    if( has_require ) _ = require("lodash");
    else throw "mymodule requires lodash, see https://lodash.com/";
}
if (has_require) {
  utils  = require(__base + "sharedUtils/sharedUtils.js");
  assert = require("assert");
}

// Functional form, for game creation 
var game_core = function(options){
    // Store a flag if we are the server instance
    this.server = options.server;

    // Some config settings
    this.email = "schopra8@stanford.edu";
    this.projectName = "cultural_ratchet";
    this.experimentName = "mp_game_6";
    this.iterationName = "pilot";
    this.anonymizeCSV = true;
    this.bonusAmt = 1; // in cents

    // save data to the following locations (allowed: "csv", "mongo")
    this.dataStore = ["csv", "mongo"];

    // Player parameters
    this.players_threshold = 2;
    this.playerRoleNames = {
        role1 : "explorer",
        role2 : "student"
    };

    // Round Info
    this.roundNum = -1;
    this.numRounds = 5;

    if(this.server) {
        this.id = options.id;
        this.trialList = this.makeTrialList();
        this.data = {
            id: this.id,
            subject_information: {
                score: 0,
                gameID: this.id,
            }
        };
        this.players = [{
            id: options.player_instances[0].id,
            instance: options.player_instances[0].player,
            player: new game_player(this, options.player_instances[0].player)
        }];

        this.streams = {};
        this.server_send_update();
    } else {
        // If we're initializing a player's local game copy, create the player object
        // and the game object. We'll be copying real values into these items
        // on a server update.
        this.players = [{
        id: null,
        instance: null,
        player: new game_player(this)
        }];
    }
};

var game_player = function(game_instance, player_instance) {
    this.instance = player_instance;
    this.game = game_instance;
    this.role = '';
    this.message = '';
    this.id = '';
};

if('undefined' != typeof global) {
    // server side we set some classes to global types, so that
    // we can use them in other files (specifically, game.server.js)
    module.exports = {
        game_core,
        game_player
    };
}

// ----------------
// HELPER FUNCTIONS
// -----------------
game_core.prototype.get_player = function(id) {
  // Method to easily look up player
  var result = _.find(this.players, function(e){ return e.id == id; });
  return result.player;
};

game_core.prototype.get_others = function(id) {
  // Method to get list of players that aren't the given id
  var otherPlayersList = _.filter(this.players, function(e){ return e.id != id; });
  var noEmptiesList = _.map(otherPlayersList, function(p){return p.player ? p : null;});
  return _.without(noEmptiesList, null);
};

game_core.prototype.get_active_players = function() {
  // Returns all players
  var noEmptiesList = _.map(this.players, function(p){return p.player ? p : null;});
  return _.without(noEmptiesList, null);
};

game_core.prototype.newRound = function(delay) {
    var players = this.get_active_players();
    var localThis = this;
    setTimeout(function() {
        // If you've reached the planned number of rounds, end the game
        if(localThis.roundNum == localThis.numRounds - 1) {
            _.forEach(players, p => p.player.instance.disconnect());
        } else {
            // Tell players
            _.forEach(players, p => p.player.instance.emit( 'newRoundUpdate'));
  
            // Otherwise, get the preset list of tangrams for the new round
            localThis.roundNum += 1;
  
            localThis.trialInfo = {
                currStim: localThis.trialList[localThis.roundNum],
                currContextType: localThis.contextTypeList[localThis.roundNum],
                roles: _.zipObject(_.map(localThis.players, p =>p.id),
                            _.values(localThis.trialInfo.roles))
            };
            localThis.server_send_update();
        }
    }, delay);
};

game_core.prototype.server_send_update = function(){
    // Make a snapshot of the current state, for updating the clients
    var local_game = this;

    // Add info about all players
    var player_packet = _.map(local_game.players, function(p){
        return {id: p.id, player: null};
    });

    var state = {
        gs : this.game_started,
        pt : this.players_threshold,
        pc : this.player_count,
        dataObj  : this.data,
        roundNum : this.roundNum,
        trialInfo: this.trialList[this.roundNum],
    };
    _.extend(state, {players: player_packet});

    // Send the snapshot to the players
    this.state = state;
    _.map(local_game.get_active_players(), function(p){
        p.player.instance.emit( 'onserverupdate', state);
    });
};

game_core.prototype.makeTrialList = function () {
    // TOOD: Implement Function
    var trialList = [];
    return trialList;
};