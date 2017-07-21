/*  Copyright (c) 2012 Sven "FuzzYspo0N" Bergström,
                  2013 Robert XD Hawkins

 written by : http://underscorediscovery.com
    written for : http://buildnewgames.com/real-time-multiplayer/

    substantially modified for collective behavior experiments on the web
    MIT Licensed.
    */

/*
  The main game class. This gets created on both server and
  client. Server creates one for each game that is hosted, and each
  client creates one for itself to play the game. When you set a
  variable, remember that it's only set in that instance.
  */
  var has_require = typeof require !== 'undefined';

  if( typeof _ === 'undefined' ) {
    if( has_require ) {
      _ = require('underscore');
      utils  = require(__base + '/sharedUtils/sharedUtils.js');
    }
    else throw 'mymodule requires underscore, see http://underscorejs.org';
  }

  var game_core = function(options){
  // Store a flag if we are the server instance
  console.log('inside game core function')
  this.server = options.server ;

  // How many players in the game?
  this.players_threshold = 2;
  this.playerRoleNames = {
    role1 : 'speaker',
    role2 : 'listener'
  };

  // Determines which critters are present in the game and who gets which first
  this.critter = {
    role1 : 'bird',
    role2 : 'bug'
  }

  // Determines the specifics of the critters used in the experiment. Can be probabilistic 
  // Change this to change distribution, critter type, names of species, and critter characteristics
  this.critterScale = 0.5;
  this.creatureOpts = [
  { creature: "bird",
  name: "wug",
  globalColors: [
  {
    p: 0.99,
    props: {
      color_mean: "blue",
      color_var: 0.001,
      location: "ground"
    }
  }, {
    p: 0.01,
    props: {
      color_mean: "green",
      color_var: 0.001,
      location: "trees"
    }
  }],
  		col1_mean: "#00ff00", // col1 = crest
  		col1_var: 0.001,
  		col2_mean: "#00ff1a", // col2 = body
  		col2_var: 0.001,
  		col3_mean: "#006400", // col3 = wing
  		col3_var: 0.001,
     col4_mean: null,
     col4_var: null,
     col5_mean: null,
     col5_var: null,
  		prop1: null, // height
  		prop2: null, // fatness
  		tar1: 0.5, // tails
  		tar2: 0.2, // crest
  		internal_prop: 0.8 // pepsin
  	},
  	{ creature: "bird",
    name: "fep",
    globalColors: [
    {
      p: 1,
      props: {
        color_mean: "yellow",
        color_var: 0.001,
        location: "ground"
      }
    }, {
      p: 0,
      props: {
        color_mean: "red",
        color_var: 0.001,
        location: "trees"
      }
    }],
  		col1_mean: "#ff4500", // col1 = crest
  		col1_var: 0.001,
  		col2_mean: "#ff4500", // col2 = body
  		col2_var: 0.001,
  		col3_mean: "#ff4500", // col3 = wing
  		col3_var: 0.001,
     col4_mean: null,
     col4_var: null,
     col5_mean: null,
     col5_var: null,
  		prop1: null, // height
  		prop2: null, // fatness
  		tar1: 0, // tails
  		tar2: 1, // crest
  		internal_prop: 0.2, // pepsin
  	},
  	{ creature: "bird",
    name: "lorch",
    globalColors: [
    {
      p: 0.5,
      props: {
        color_mean: "yellow",
        color_var: 0.001,
        location: "ground"
      }
    }, {
      p: 0.5,
      props: {
        color_mean: "purple",
        color_var: 0.001,
        location: "trees"}
      }],
  		col1_mean: "#ffff00", // col1 = crest
  		col1_var: 0.001,
  		col2_mean: "#ffff00", // col2 = body
  		col2_var: 0.001,
  		col3_mean: "#ffff00", // col3 = wing
  		col3_var: 0.001,
     col4_mean: null,
     col4_var: null,
     col5_mean: null,
     col5_var: null,
  		prop1: null, // height
  		prop2: null, // fatness
  		tar1: 1, // tails
  		tar2: 0.2, // crest
  		internal_prop: 0 // pepsin
  	}
    ]

    // total number of creatures
    this.creatureN = 12;
    // number of different species
    this.creatureTypesN = 3;
    // number of each critter of a species
    this.exemplarN = this.creatureN/this.creatureTypesN;
    this.uniqueCreatures =  _.uniq(_.pluck(this.creatureOpts, "name"));

    // allows us to write (and record) what color we want without needing hex codes
    this.color_dict = {
      blue: "#5da5db",
      red: "#f42935",
      yellow: "#eec900",
      green: "#228b22",
      orange: "#ff8c00",
      purple: "#dda0dd"
    }

  // Which round are we on (initialize at -1 so that first round is 0-indexed)
  this.roundNum = -1;

  // How many rounds do we want people to complete?
  this.numRounds = 2;

  this.currentSlide = {
    speaker: "i0",
    listener: "i0"
  }

  // This will be populated with the critters shown
  this.trialInfo = [];

  if(this.server) {
    // If we're initializing the server game copy, pre-create the list of trials
    // we'll use, make a player object, and tell the player who they are
    this.id = options.id;
    this.expName = options.expName;
    this.player_count = options.player_count;

    // needs to be generalized
    // determines what critters will be used and who sees what when
    var bugCritters = this.genCreatures("bug");
    var birdCritters = this.genCreatures("bird");
    var speakerOrder = [bugCritters, birdCritters];
    var listenerOrder = [birdCritters, bugCritters];

    // assigns the critters to their respective players
    this.trialList = {
      speaker: speakerOrder,
      listener: listenerOrder
    };

    // this is switched so the they will get tested on the information their partner relayed to them
    this.testList = {
      speaker: listenerOrder,
      listener: speakerOrder
    };

    this.data = {
      id : this.id,
      trials : [],
      catch_trials : [], system : {},
      subject_information : {
        gameID: this.id,
        score: 0
      }
    };
    this.players = [{
      id: options.player_instances[0].id,
      instance: options.player_instances[0].player,
      player: new game_player(this,options.player_instances[0].player)
    }];
    this.streams = {};
    this.server_send_update();
  } else {
    // If we're initializing a player's local game copy, create the player object
    this.players = [{
      id: null,
      instance: null,
      player: new game_player(this)
    }];
  }
};

var game_player = function( game_instance, player_instance) {
  this.instance = player_instance;
  this.game = game_instance;
  this.role = '';
  this.message = '';
  this.id = '';
};

// server side we set some classes to global types, so that
// we can use them in other files (specifically, game.server.js)
if('undefined' != typeof global) {
  module.exports = global.game_core = game_core;
  module.exports = global.game_player = game_player;
}

// HELPER FUNCTIONS

// Method to easily look up player
game_core.prototype.get_player = function(id) {
  var result = _.find(this.players, function(e){ return e.id == id; });
  return result.player;
};

// Method to get list of players that aren't the given id
game_core.prototype.get_others = function(id) {
  var otherPlayersList = _.filter(this.players, function(e){ return e.id != id; });
  var noEmptiesList = _.map(otherPlayersList, function(p){return p.player ? p : null;});
  return _.without(noEmptiesList, null);
};

// Returns all players
game_core.prototype.get_active_players = function() {
  var noEmptiesList = _.map(this.players, function(p){return p.player ? p : null;});
  return _.without(noEmptiesList, null);
};

// need this or one of the critter things wont show up anymore
game_core.prototype.newRound = function() {
  // If you've reached the planned number of rounds, end the game
  if(this.roundNum == this.numRounds - 1) {
    _.map(this.get_active_players(), function(p){
      p.player.instance.disconnect();});
  } else {
    // Otherwise, get the preset list of tangrams for the new round
    this.roundNum += 1;
    this.blockCritters = {currStim: this.trialList[this.roundNum]};
    this.server_send_update();
  }
};

var fillArray = function(n, fillVal){
  return Array(n).fill(fillVal)
}

var probToCount = function(p, n){
  return Math.round(p*n);
}

game_core.prototype.createFeatureArray = function(creatureLabel, p){
  var probs = [p, 1-p]
  var creatOpts = _.where(this.creatureOpts, {name: creatureLabel})[0];
  var creatureColors = [];
  var creatureLocation = [];
  var nRemaining = this.exemplarN;
  console.log("number remaining: " + nRemaining);
  for (var i=0; i<2; i++ ){
    var colorProps = creatOpts.globalColors[i];

    var n_creatures_of_this_color =  probToCount(
      probs[i], this.exemplarN
      );

    var ncrit = n_creatures_of_this_color == 0 ?
    ((probs[i] > 0) && (nRemaining > 0)) ? 1 : 0 :
    n_creatures_of_this_color
    creatureColors = creatureColors.concat(
      fillArray(ncrit,
        utils.genColor(
          this.color_dict[colorProps["props"]["color_mean"]],
          colorProps["props"]["color_var"]
          ))
      )
    creatureLocation = 0;
    nRemaining = nRemaining-ncrit;
  }
  return {color: creatureColors, location: creatureLocation}
}

var distribution = _.sample([
  [1, 1, 0.5],
  [1, 1, 0.25]
  ])

game_core.prototype.genCreatures = function(creatureCategory){
  var j = 0;
  // Generates the characteristics for each critter
  var allCreatures = [];
  for (var i = 0; i < this.uniqueCreatures.length; i++){
    var creatOpts = _.where(this.creatureOpts, {name: this.uniqueCreatures[i]})[0];
    var creatureColor = this.createFeatureArray(
     this.uniqueCreatures[i], distribution[i]
     );
    var localCounter = 0;
    while (j<(this.exemplarN*(i+1))) {
     allCreatures.push({
      "col1": creatureColor["color"][localCounter],
      "col2": creatureColor["color"][localCounter],
      "col3": creatureColor["color"][localCounter] == null ? null : creatureColor["color"][localCounter] ,
      "col4": creatureColor["color"][localCounter] == null ? null : creatureColor["color"][localCounter],
      "col5": creatureColor["color"][localCounter] == null ? null : creatureColor["color"][localCounter],
      "prop1": creatOpts.prop1 == null ? utils.randProp() : creatOpts.prop1,
      "prop2": creatOpts.prop2 == null ? utils.randProp() : creatOpts.prop2,
      "tar1": utils.flip(creatOpts.tar1),
      "tar2": utils.flip(creatOpts.tar2),
      "creatureName": this.uniqueCreatures[i],
      "critter" : creatureCategory,
      "query": "question",
      "stimID": j,
      "internal_prop": utils.flip(creatOpts.internal_prop),
      "attentionCheck": utils.generateAttentionQuestion()
    })
     localCounter++;
     j++;
   }
 }
 return allCreatures
}


// this gets run when the game is created and creates all trial information
// functionally equivalent to making something like exp.stims in init() in template.js
game_core.prototype.makeTrialList = function () {
  var local_this = this;
  var conditionList = this.getRandomizedConditions();
  var trialList = [];
  for (var i = 0; i < conditionList.length; i++) {
    var condition = conditionList[i];
    var objList = sampleTrial(condition); // Sample three objects
    var locs = this.sampleStimulusLocs(); // Sample locations for those objects
  };
  return(trialList);
};

game_core.prototype.server_send_update = function(){
  //Make a snapshot of the current state, for updating the clients
  var local_game = this;
  // Add info about all players
  var player_packet = _.map(local_game.players, function(p){
    return {id: p.id,
      player: null};
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
  console.log(local_game.get_active_players())
  _.map(local_game.get_active_players(), function(p){
    console.log(p.instance.role)
    p.instance.role ? console.log(local_game.trialList[p.instance.role][0][0]): null
    var playerState = p.instance.role ? _.extend(state,
    {
      initialLearningCritters: local_game.trialList[p.instance.role][0]
    }
    ) : state
    p.player.instance.emit( 'onserverupdate', playerState);
  });
};
