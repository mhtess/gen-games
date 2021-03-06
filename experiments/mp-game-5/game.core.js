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
  rule_summary = require('./js/rule_summary.json');
}

// Functional form, for game creation 
var game_core = function(options){
  // Log, whether this server version
  this.server = options.server;

  // Data storage parameters
  this.dataStore = ['csv'];
  this.email = 'schopra8@stanford.edu';
  this.projectName = 'genGames';
  this.experimentName = 'mpGame5';
  this.iterationName = 'pilot';
  this.anonymizeCSV = true;
  this.bonusAmt = 1; // 1 cent

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
    this.roundNum = 0;
    this.numRounds = options.rule_by_round.length;
    this.rule_by_round = options.rule_by_round;
    this.numPlayersCompletedRound = 0;
    this.possibleSpecies = options.possibleSpecies;
    this.possibleSpeciesPlural = options.possibleSpeciesPlural;

    this.data = {
      id: this.id,
      system: {},
      subject_information: {
        gameID: this.id,
      }
    };

    this.genStim();

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

game_core.prototype.genStim = function() {
    // Else, load train/test stimuli for the next round of the game
    var ruleIdx = this.rule_by_round[this.roundNum];
    var ruleInfo = rule_summary[ruleIdx];

    // Set rule information for the round
    this.ruleType = ruleInfo.type;
    this.trainingDataFn = "./js/training_data_" + ruleInfo.name + ".json";
    this.testDataFn = "./js/test_data_" + ruleInfo.name + ".json";
    this.ruleIdx = ruleIdx;
    console.log("Creating Round " + (this.roundNum + 1) + " with Rule: " + this.trainingDataFn);

    // Load training and test stimuli
    this.trainingStimuli = {explorer: require(this.trainingDataFn)};
    this.testStimuli = {
      explorer: require(this.testDataFn),
      student: require(this.testDataFn),
    }
}

game_core.prototype.newRound = function() {
  // Get contextual information
  var localThis = this;
  var players = this.get_active_players();

  if(this.roundNum != this.numRounds - 1) {
    this.roundNum += 1;
    this.genStim();
    this.numPlayersCompletedRound = 0;

    // Tell players that new round is starting
    _.forEach(players, p => p.player.instance.emit('newRoundUpdate'));
    this.server_send_update();
  }
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
    roundNum : this.roundNum,
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
    playerState = _.extend(playerState, {
      testing_critters: local_game.testStimuli[p.instance.role],
      trainingDataFn: local_game.trainingDataFn,
      testDataFn: local_game.testDataFn,
      ruleIdx: local_game.ruleIdx,
      ruleType: local_game.ruleType,
      speciesName: local_game.possibleSpecies[local_game.roundNum],
      pluralSpeciesName: local_game.possibleSpeciesPlural[local_game.roundNum],
      numRounds: local_game.numRounds,
      testScores: local_game.testScores,
      bonusAmt: local_game.bonusAmt,
    });
    p.player.instance.emit('onserverupdate', playerState);
  });
};

