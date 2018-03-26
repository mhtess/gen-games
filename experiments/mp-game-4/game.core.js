//   Copyright (c) 2012 Sven "FuzzYspo0N" Bergström,
//                 2013 Robert XD Hawkins
//   Written by : http://underscorediscovery.com
//   Written for : http://buildnewgames.com/real-time-multiplayer/
//   Modified for collective behavior experiments on Amazon Mechanical Turk
//   MIT Licensed.

// -----------------------------
// LOAD DEPENDENCIES (IF SERVER)
// -----------------------------
var has_require = typeof require !== 'undefined';
if( typeof _ === 'undefined' ) {
  if( has_require ) _ = require('lodash');
  else throw 'mymodule requires underscore, see http://underscorejs.org';
}
if (has_require) {
  utils  = require(__base + 'sharedUtils/sharedUtils.js');
  assert = require('assert');
  training_data = require('./js/training_data.json');
  test_data = require('./js/test_data.json');
}

// Functional form, for game creation 
var game_core = function(options){
  // Log, whether this server version
  this.server = options.server ;

  // Data storage parameters
  this.dataStore = ['csv', 'mongo'];
  this.email = 'schopra8@stanford.edu';
  this.projectName = 'genGames';
  this.experimentName = 'mpGame4';
  this.iterationName = 'pilot1';
  this.anonymizeCSV = true;
  this.bonusAmt = 2; // 2 cents

  // Player parameters
  this.players_threshold = 2;
  this.playerRoleNames = {
    role1 : "explorer",
    role2 : "student"
  };
  this.currentSlide = {
    explorer: "i0",
    student: "i0"
  }

  // Scores
  this.trainingScores = {
    "explorer": [],
  };
  this.testScores = {
    "explorer": [],
    "student": [],
  }

  if(this.server) {
    // If we're initializing the server game copy, pre-create the list of trials
    // we'll use, make a player object, and tell the player who they are
    this.id = options.id;
    this.expName = options.expName;
    this.player_count = options.player_count;
    this.trainingStimuli = {
      explorer: training_data,
    };
    this.testStimuli = {
      explorer: test_data,
      student: test_data,
    }
    this.data = {
      id: this.id,
      system: {},
      subject_information: {
        gameID: this.id,
      }
    };

    // Player creation is entirely handled by the server.
    // The client simply mantains a dummy / empty player object
    // and then copies values into this object, once a server
    // update is registered.
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

// server side we set some classes to global types, so that
// we can use them in other files (specifically, game.server.js)
if('undefined' != typeof global) {
  module.exports = {game_core, game_player};
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

game_core.prototype.newRound = function() {
  // Transition to the next slide (Learning Instructions for Player A, Waiting Room for Player B)
  this.server_send_update();
};

game_core.prototype.server_send_update = function(){
  //Make a snapshot of the current state, for updating the clients
  var local_game = this;

  // Add info about all players
  var player_packet = _.map(local_game.players, function(p){
    return {id: p.id, player: null};
  });

  var state = {
    gs : this.game_started,   // true when game's started
    pt : this.players_threshold,
    pc : this.player_count,
    dataObj  : this.data,
    roundNum : this.roundNum
  };
  _.extend(state, {players: player_packet});
  _.extend(state, {instructions: this.instructions});

  //Send the snapshot to the players
  this.state = state;

  _.map(local_game.get_active_players(), function(p){
    // Depending on player type (A vs. B), append training simuli
    // All players get test stimuli
    var playerState = p.instance.role == "explorer" ? _.extend(state, {training_critters: local_game.trainingStimuli[p.instance.role]}) : state;
    playerState = _.extend(playerState, {testing_critters: local_game.testStimuli[p.instance.role]});
    p.player.instance.emit('onserverupdate', playerState);
  });
};

