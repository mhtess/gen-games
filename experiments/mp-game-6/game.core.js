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
    utils = require(__base + "sharedUtils/sharedUtils.js");
    assert = require("assert");
    sendPostRequest = require('request').post;
}

// Functional form, for game creation 
var game_core = function(options){
    // Store a flag if we are the server instance
    this.server = options.server;
    this.isProd = options.isProd;

    // Some config settings
    this.email = "schopra8@stanford.edu";
    this.projectName = "cultural_ratchet";
    this.experimentName = "mp-game-6";
    this.iterationName = "pilot";
    this.anonymizeCSV = true;
    this.bonusAmt = 1; // in cents

    // save data to the following locations (allowed: "csv", "mongo")
    this.dataStore = ["csv", "mongo"];

    // Player parameters
    this.player_count = 1;
    this.players_threshold = 2;
    this.playerRoleNames = {
        role1 : "explorer",
        role2 : "student"
    };

    // Round Info
    this.roundNum = -1;
    this.numRounds = 5;
    this.testScores = {};
    this.testScores[this.playerRoleNames.role1] = _.times(this.numRounds, _.constant({}));
    this.testScores[this.playerRoleNames.role2] = _.times(this.numRounds, _.constant({}));
    this.roundSummaries = [];
    this.roundSelections = [];


    // Other info
    this.currentSlide = {}
    this.currentSlide[this.playerRoleNames.role1] = '';
    this.currentSlide[this.playerRoleNames.role2] = '';

    if(this.server) {
        this.trialList = [];
        this.numTrialsDefined = 0;

        this.id = options.id;
        this.players = [{
            id: options.player_instances[0].id,
            instance: options.player_instances[0].player,
            player: new game_player(this, options.player_instances[0].player)
        }];

        this.startTime = null;
        this.numPlayersCompletedRound = 0;

        this.streams = {};

        var localThis = this;
        this.makeTrialList(options.connection, function(trial){
            localThis.trialList.push(trial);
            localThis.numTrialsDefined += 1;
            if (localThis.numTrialsDefined === localThis.numRounds) {
                localThis.trialList = _.shuffle(localThis.trialList);
                localThis.trialStimuli = [];
                _.forEach(
                    localThis.trialList,
                    trialInfo => {
                        localThis.trialStimuli.push({
                            train: options.train_stimuli[trialInfo.fileName] ,
                            test:  options.test_stimuli[trialInfo.fileName],
                            ruleIdx: trialInfo.ruleIdx,
                            ruleName: trialInfo.name,
                            ruleFileName: trialInfo.fileName,
                            speciesName: trialInfo.speciesName,
                            pluralSpeciesName: trialInfo.pluralSpeciesName,
                        });
                    }
                )
                console.log(localThis.trialList);
                localThis.server_send_update();
            }
        });
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
    console.log("Triggering a new round");

    var players = this.get_active_players();
    var localThis = this;
    setTimeout(function() {
        // If you've reached the planned number of rounds, end the game
        if (localThis.roundNum == localThis.numRounds - 1) {
            console.log(localThis.testScores);
            var totalScore = 0;
            for (var i = 0; i < localThis.numRounds; i++){
                totalScore += parseInt(localThis.testScores['student'][i]['score']);
                totalScore += parseInt(localThis.testScores['explorer'][i]['score']);
            }
            _.forEach(
                players,
                p => p.player.instance.emit('totalScoreUpdate', totalScore));

        } else {
            // Tell players
            _.forEach(players, p => p.player.instance.emit('newRoundUpdate', localThis.roundNum + 1));
            localThis.roundNum += 1;
            localThis.numPlayersCompletedRound = 0;
            localThis.server_send_update();
        }
    }, delay);
};

game_core.prototype.server_send_update = function(){
    // Make a snapshot of the current state, for updating the clients

    // Add info about all players
    var player_packet = _.map(this.players, function(p){
        return {id: p.id, player: null};
    });

    var state = {
        id : this.id,
        gs : this.start_time,
        pt : this.players_threshold,
        pc : this.player_count,
        roundNum : this.roundNum,
        numRounds : this.numRounds,
    };
    if (this.numTrialsDefined === this.numRounds) {
        state.trialList = this.trialList;
        state.trialInfo = this.trialStimuli[this.roundNum];
    }

    _.extend(state, {players: player_packet});

    // Send the snapshot to the players
    this.state = state;
    _.map(this.get_active_players(), function(p){
        p.player.instance.emit('onserverupdate', state);
    });
};

game_core.prototype.makeTrialList = function (connection, callback) {
    col_prefix = "fifty_rules_";
    console.log("Loading from: " + col_prefix);
    var gameId = this.id;
    var ruleTypes = [
        "SINGLE_FEATURE",
        "CONJUNCTION",
        "DISJUNCTION",
        "CONJUNCTION_DISJUNCTION",
        "DISJUNCTION_CONJUNCTION"
    ];

    _.forEach(ruleTypes,
        ruleType => {
            utils.getStims(
                connection,
                "genGames",
                col_prefix + ruleType,
                gameId,
                function(result) {
                    var trial = {
                        gameid: gameId,
                        ruleIdx: result.rule_idx,
                        fileName: result.file_name,
                        name: result.name,
                        ruleType: ruleType,
                        speciesName: result.speciesName,
                        pluralSpeciesName: result.speciesNamePlural,
                    };
                    callback(trial);
                }
            );
        }
    );

};
