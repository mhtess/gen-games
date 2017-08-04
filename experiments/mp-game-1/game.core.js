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

  this.dataStore = ['csv', 'mongo']; //maybe change to just csv

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
  this.birdOpts0 = [
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
  		prop1: 0, // height
  		prop2: 0, // fatness
  		tar1: 0, // tails
  		tar2: 0, // crest
  		internal_prop: 0.8 // lays eggs
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
  		prop1: 0, // height
      prop2: 0, // fatness
  		tar1: 0, // tails
  		tar2: 0, // crest
  		internal_prop: 0.2, // lays eggs
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
  		prop1: 0, // height
      prop2: 0, // fatness
  		tar1: 0, // tails
  		tar2: 0, // crest
  		internal_prop: 0 // lays eggs
  	}
    ]

    this.bugOpts0 = [
    { creature: "bug",
    name: "rambo",
    globalColors: [
    {
      p: 0.99,
      props: {
        color_mean: "red",
        color_var: 0.001,
        location: "ground"
      }
    }, {
      p: 0.01,
      props: {
        color_mean: "yellow",
        color_var: 0.001,
        location: "trees"
      }
    }],
        prop1: 0, // headsize
        prop2: 0, // bodysize
        tar1: 0, // antennae
        tar2: 0, // wings
        internal_prop: 0.8 // poisonous
      },
      { creature: "bug",
      name: "prit",
      globalColors: [
      {
        p: 1,
        props: {
          color_mean: "purple",
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
        prop1: 0, // headsize
        prop2: 0, // bodysize
        tar1: 0, // antennae
        tar2: 0, // wings
        internal_prop: 0.2, // poisonous
      },
      { creature: "bug",
      name: "radiss",
      globalColors: [
      {
        p: 0.5,
        props: {
          color_mean: "blue",
          color_var: 0.001,
          location: "ground"
        }
      }, {
        p: 0.5,
        props: {
          color_mean: "orange",
          color_var: 0.001,
          location: "trees"}
        }],
        prop1: 0, // headsize
        prop2: 0, // bodysize
        tar1: 0, // antennae
        tar2: 0, // wings
        internal_prop: 0 // poisonous
      }
      ]

    this.fishOpts0 = [
    { creature: "fish",
    name: "strate",
    globalColors: [
    {
      p: 0.99,
      props: {
        color_mean: "green",
        color_var: 0.001,
        location: "ground"
      }
    }, {
      p: 0.01,
      props: {
        color_mean: "orange",
        color_var: 0.001,
        location: "trees"
      }
    }],
        prop1: 0, // bodysize
        prop2: 0, // tailsize
        tar1: 0, // fangs
        tar2: 0, // whiskers
        internal_prop: 0.8 // eaten by crocodiles
      },
      { creature: "fish",
      name: "hilate",
      globalColors: [
      {
        p: 1,
        props: {
          color_mean: "blue",
          color_var: 0.001,
          location: "ground"
        }
      }, {
        p: 0,
        props: {
          color_mean: "purple",
          color_var: 0.001,
          location: "trees"
        }
      }],
        prop1: 0, // bodysize
        prop2: 0, // tailsize
        tar1: 0, // fangs
        tar2: 0, // whiskers
        internal_prop: 0.6 // eaten by crocodiles
      },
      { creature: "fish",
      name: "burge",
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
          color_mean: "green",
          color_var: 0.001,
          location: "trees"}
        }],
        prop1: 0, // bodysize
        prop2: 0, // tailsize
        tar1: 0, // fangs
        tar2: 0, // whiskers
        internal_prop: 0.3 // eaten by crocodiles
      }
      ]

    this.treeOpts0 = [
    { creature: "tree",
    name: "mider",
    globalColors: [
    {
      p: 0.99,
      props: {
        color_mean: "green",
        color_var: 0.001,
        location: "ground"
      }
    }, {
      p: 0.01,
      props: {
        color_mean: "orange",
        color_var: 0.001,
        location: "trees"
      }
    }],
        prop1: 0, // height
        prop2: 0, // fatness
        tar1: 0, // berries
        tar2: 0, // leaves
        internal_prop: 0.1 // leaves
      },
      { creature: "tree",
      name: "glibe",
      globalColors: [
      {
        p: 1,
        props: {
          color_mean: "blue",
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
        prop1: 0, // height
        prop2: 0, // fatness
        tar1: 0, // berries
        tar2: 0, // leaves
        internal_prop: 0.9 // leaves
      },
      { creature: "tree",
      name: "lopt",
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
          color_mean: "red",
          color_var: 0.001,
          location: "trees"}
        }],
        prop1: 0, // height
        prop2: 0, // fatness
        tar1: 0, // berries
        tar2: 0, // leaves
        internal_prop: 0.2 // leaves
      }
      ]


      this.birdOpts1 = [
    { creature: "bird",
    name: "blicket",
    globalColors: [
    {
      p: 0.99,
      props: {
        color_mean: "green",
        color_var: 0.001,
        location: "ground"
      }
    }, {
      p: 0.01,
      props: {
        color_mean: "orange",
        color_var: 0.001,
        location: "trees"
      }
    }],
        prop1: 1, // height
        prop2: 1, // fatness
        tar1: 1, // tails
        tar2: 1, // crest
        internal_prop: 0.4 // lays eggs
      },
      { creature: "bird",
      name: "creed",
      globalColors: [
      {
        p: 1,
        props: {
          color_mean: "red",
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
        prop1: 1, // height
        prop2: 1, // fatness
        tar1: 1, // tails
        tar2: 1, // crest
        internal_prop: 0.2, // lays eggs
      },
      { creature: "bird",
      name: "dredge",
      globalColors: [
      {
        p: 0.5,
        props: {
          color_mean: "blue",
          color_var: 0.001,
          location: "ground"
        }
      }, {
        p: 0.5,
        props: {
          color_mean: "yellow",
          color_var: 0.001,
          location: "trees"}
        }],
        prop1: 1, // height
        prop2: 1, // fatness
        tar1: 1, // tails
        tar2: 1, // crest
        internal_prop: 0 // lays eggs
      }
      ]

      this.bugOpts1 = [
      { creature: "bug",
      name: "shork",
      globalColors: [
      {
        p: 0.99,
        props: {
          color_mean: "green",
          color_var: 0.001,
          location: "ground"
        }
      }, {
        p: 0.01,
        props: {
          color_mean: "orange",
          color_var: 0.001,
          location: "trees"
        }
      }],
          prop1: 1, // headsize
          prop2: 1, // bodysize
          tar1: 1, // antennae
          tar2: 1, // wings
          internal_prop: 0.7 // poisonous
        },
        { creature: "bug",
        name: "flay",
        globalColors: [
        {
          p: 1,
          props: {
            color_mean: "blue",
            color_var: 0.001,
            location: "ground"
          }
        }, {
          p: 0,
          props: {
            color_mean: "green",
            color_var: 0.001,
            location: "trees"
          }
        }],
          prop1: 1, // headsize
          prop2: 1, // bodysize
          tar1: 1, // antennae
          tar2: 1, // wings
          internal_prop: 0.1, // poisonous
        },
        { creature: "bug",
        name: "codger",
        globalColors: [
        {
          p: 0.5,
          props: {
            color_mean: "red",
            color_var: 0.001,
            location: "ground"
          }
        }, {
          p: 0.5,
          props: {
            color_mean: "green",
            color_var: 0.001,
            location: "trees"}
          }],
          prop1: 1, // headsize
          prop2: 1, // bodysize
          tar1: 1, // antennae
          tar2: 1, // wings
          internal_prop: 0 // poisonous
        }
        ]

      this.fishOpts1 = [
      { creature: "fish",
      name: "croop",
      globalColors: [
      {
        p: 0.99,
        props: {
          color_mean: "purple",
          color_var: 0.001,
          location: "ground"
        }
      }, {
        p: 0.01,
        props: {
          color_mean: "orange",
          color_var: 0.001,
          location: "trees"
        }
      }],
          prop1: 1, // bodysize
          prop2: 1, // tailsize
          tar1: 1, // fangs
          tar2: 1, // whiskers
          internal_prop: 0.8 // eaten by crocodiles
        },
        { creature: "fish",
        name: "bleb",
        globalColors: [
        {
          p: 1,
          props: {
            color_mean: "red",
            color_var: 0.001,
            location: "ground"
          }
        }, {
          p: 0,
          props: {
            color_mean: "green",
            color_var: 0.001,
            location: "trees"
          }
        }],
          prop1: 1, // bodysize
          prop2: 1, // tailsize
          tar1: 1, // fangs
          tar2: 1, // whiskers
          internal_prop: 0.9 // eaten by crocodiles
        },
        { creature: "fish",
        name: "nift",
        globalColors: [
        {
          p: 0.5,
          props: {
            color_mean: "red",
            color_var: 0.001,
            location: "ground"
          }
        }, {
          p: 0.5,
          props: {
            color_mean: "blue",
            color_var: 0.001,
            location: "trees"}
          }],
          prop1: 1, // bodysize
          prop2: 1, // tailsize
          tar1: 1, // fangs
          tar2: 1, // whiskers
          internal_prop: 0.7 // eaten by crocodiles
        }
        ]

      this.treeOpts1 = [
      { creature: "tree",
      name: "garp",
      globalColors: [
      {
        p: 0.99,
        props: {
          color_mean: "red",
          color_var: 0.001,
          location: "ground"
        }
      }, {
        p: 0.01,
        props: {
          color_mean: "purple",
          color_var: 0.001,
          location: "trees"
        }
      }],
          prop1: 1, // height
          prop2: 1, // fatness
          tar1: 1, // berries
          tar2: 1, // leaves
          internal_prop: 0.8 // leaves
        },
        { creature: "tree",
        name: "harkel",
        globalColors: [
        {
          p: 1,
          props: {
            color_mean: "blue",
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
          prop1: 1, // height
          prop2: 1, // fatness
          tar1: 1, // berries
          tar2: 1, // leaves
          internal_prop: 0.4 // leaves
        },
        { creature: "tree",
        name: "zord",
        globalColors: [
        {
          p: 0.5,
          props: {
            color_mean: "purple",
            color_var: 0.001,
            location: "ground"
          }
        }, {
          p: 0.5,
          props: {
            color_mean: "green",
            color_var: 0.001,
            location: "trees"}
          }],
          prop1: 1, // height
          prop2: 1, // fatness
          tar1: 1, // berries
          tar2: 1, // leaves
          internal_prop: 0 // leaves
        }
        ]


    // total number of creatures
    this.creatureN = 12;
    // number of different species
    this.creatureTypesN = 3;
    // number of each critter of a species
    this.exemplarN = this.creatureN/this.creatureTypesN;
    //this.uniqueCreatures =  _.uniq(_.pluck(this.creatureOpts, "name")); //might need to comment back in

    // allows us to write (and record) what color we want without needing hex codes
    this.color_dict = {
      blue: "#5da5db",
      red: "#f42935",
      yellow: "#eec900",
      green: "#228b22",
      orange: "#ff8c00",
      purple: "#b62fef"
      // pink: "#f97ada",
      // lightblue: "#11edf4",
      // lightgreen: "#11f427",
      // lightpurple: "#dda0dd",

    }

    this.critter_dict = 

  // Which round are we on (initialize at -1 so that first round is 0-indexed)
  this.roundNum = -1;

  // How many rounds do we want people to complete? MAKE SURE THIS ALIGNS WITH EXP TEMPLATE SLIDE AMT
  this.numRounds = 4;

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
    var bugCritters0 = this.genCreatures("bug",0); 
    var birdCritters0 = this.genCreatures("bird",0);
    var fishCritters0 = this.genCreatures("fish",0);
    //var flowerCritters0 = this.genCreatures("flower",0);
    var treeCritters0 = this.genCreatures("tree",0);
    var bugCritters1 = this.genCreatures("bug",1); 
    var birdCritters1 = this.genCreatures("bird",1);
    var fishCritters1 = this.genCreatures("fish",1);
    //var flowerCritters1 = this.genCreatures("flower",1);
    var treeCritters1 = this.genCreatures("tree",1);
    var speakerOrder = [fishCritters0, bugCritters0, treeCritters1, birdCritters1];
    var listenerOrder = [treeCritters0, birdCritters0, fishCritters1, bugCritters1];

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

game_core.prototype.createFeatureArray = function(creatureLabel, p, creatureCategory, num){ //add num as parameter too
  var probs = [p, 1-p]
  var creatureOpts;
  switch(creatureCategory) {
    case "bird":
    num==0 ?
      creatureOpts = this.birdOpts0 :
      creatureOpts = this.birdOpts1 //add if/else statment here too
    break;
    case "bug":
    num==0 ?
      creatureOpts = this.bugOpts0 :
      creatureOpts = this.bugOpts1
    break;
    case "fish":
    num==0 ?
      creatureOpts = this.fishOpts0 :
      creatureOpts = this.fishOpts1
    break;
    case "tree":
    num==0 ?
      creatureOpts = this.treeOpts0 :
      creatureOpts = this.treeOpts1
    break;
  }

  var creatOpts = _.where(creatureOpts, {name: creatureLabel})[0];
  var creatureColors = [];
  var creatureLocation = [];
  var nRemaining = this.exemplarN;
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

game_core.prototype.genCreatures = function(creatureCategory, num){ //include num as parameter
  var j = 0;
  // Generates the characteristics for each critter
  var allCreatures = [];
  var creatureOpts;
  switch(creatureCategory) {
    case "bird":
    num==0 ?
      creatureOpts = this.birdOpts0 :
      creatureOpts = this.birdOpts1 //add if/else statment here too
    break;
    case "bug":
    num==0 ?
      creatureOpts = this.bugOpts0 :
      creatureOpts = this.bugOpts1
    break;
    case "fish":
    num==0 ?
      creatureOpts = this.fishOpts0 :
      creatureOpts = this.fishOpts1
    break;
    case "tree":
    num==0 ?
      creatureOpts = this.treeOpts0 :
      creatureOpts = this.treeOpts1
    break;
  }

  uniqueCreatures =  _.uniq(_.pluck(creatureOpts, "name"));
  for (var i = 0; i < uniqueCreatures.length; i++){
    var creatOpts = _.where(creatureOpts, {name: uniqueCreatures[i]})[0];
    var creatureColor = this.createFeatureArray(
     uniqueCreatures[i], distribution[i], creatureCategory, num
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
      "creatureName": uniqueCreatures[i],
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
