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
    _ = require('lodash');
    utils  = require(__base + 'sharedUtils/sharedUtils.js');
    assert = require('assert');
  }
  else throw 'mymodule requires underscore, see http://underscorejs.org';
}

var game_core = function(options){
  // Store a flag if we are the server instance
  console.log('inside game core function')
  this.server = options.server ;

  this.dataStore = ['csv']; //maybe change to just csv
  this.email = 'mtessler@stanford.edu';
  this.projectName = 'genGames';
  this.experimentName = 'mpGame1';
  // This has replaced expid - see if this is recorded
  this.iterationName = 'pilot1';
  this.anonymizeCSV = true;
  this.bonusAmt = 2; // in cents

  // How many players in the game?
  this.players_threshold = 2;
  this.playerRoleNames = {
    role1 : 'playerA',
    role2 : 'playerB'
  };

  this.testScores = {
    "playerA": [],
    "playerB": []
  }

  // How many rounds do we want people to complete? MAKE SURE THIS ALIGNS WITH EXP TEMPLATE SLIDE AMT
  this.numRounds = 4;
  // number of different species
  this.creatureTypesN = 3;
  // number of exemplars displayed in a block
  this.creatureN = 12;
  // number of each critter of a species
  this.exemplarN = this.creatureN/this.creatureTypesN;

  // Number of rows & columns in table presenting critters
  this.presentRows = 2;
  this.presentCols = this.creatureN/this.presentRows;

  this.creatureNames = [
      {list:0,category: "morseths", exemplar:"morseth"},
      {list:1, category: "ollers", exemplar:"oller"},
      {list:2, category: "kweps", exemplar:"kwep"},
      {list:0,category: "blins", exemplar:"blin"},
      {list:1, category: "reesles", exemplar:"reesle"},
      {list:2, category: "dorbs", exemplar:"dorb"},
      {list:0,category: "zorbs", exemplar:"zorb"},
      {list:1, category: "taifels", exemplar:"taifel"},
      {list:2, category: "trufts", exemplar:"truft"},
      {list:0,category: "daiths", exemplar:"daith"},
      {list:1, category: "mooks", exemplar:"mook"},
      {list:2, category: "frams", exemplar:"fram"},
      {list:0,category: "moxes", exemplar:"mox"},
      {list:1, category: "luzaks", exemplar:"luzak"},
      {list:2, category: "javs", exemplar:"jav"},
      {list:0,category: "pangolins", exemplar:"pangolin"},
      {list:1, category: "ackles", exemplar:"ackle"},
      {list:2, category: "wugs", exemplar:"wug"},
      {list:0,category: "cheebas", exemplar:" cheeba"},
      {list:1, category: "elleps", exemplar:"ellep"},
      {list:2, category: "kazzes", exemplar:"kaz"},
      {list:0,category: "lorches", exemplar:"lorch"},
      {list:1, category: "plovs", exemplar:"plov"},
      {list:2, category: "grinks", exemplar:"grink"},
      {list:0,category: "glippets", exemplar:"glippet"},
      {list:1, category: "sapers", exemplar:"saper"},
      {list:2, category: "stups", exemplar:"stup"},
      {list:0,category: "krivels", exemplar:"krivel"},
      {list:1, category: "zoovs", exemplar:"zoov"},
      {list:2, category: "thups", exemplar:"thup"},
      {list:3, category: "crullets", exemplar:"crullet"},
      {list:3, category: "feps", exemplar:"fep"}
  ]

  this.ourCreatNames = _.shuffle(this.creatureNames).slice(0, this.numRounds * this.creatureTypesN * 2);
  // Determines the specifics of the critters used in the experiment. Can be probabilistic
  // Change this to change distribution, critter type, names of species, and critter characteristics
  this.critterScale = 0.5;

  this.booleanFeatures = {
    // bird: {tail: "tar1", crest: "tar2", height: "prop1", fatness: "prop2"},
    // bug: {antennae: "tar1", wings: "tar2", headSize: "prop1", bodySize: "prop2"},
    // fish: {fangs: "tar1", whiskers: "tar2", bodySize: "prop1", tailSize: "prop2"},
    // flower: {thorns: "tar1", spots: "tar2", centerSize: "prop1", petalLength: "prop2"}
    bird: {tar1: "tail", tar2: "crest", prop1: "height", prop2: "fatness"},
    bug: {tar1: "antennae", tar2: "wings", prop1: "headSize", prop2: "bodySize"},
    fish: {tar1: "fangs", tar2: "whiskers", prop1: "bodySize", prop2: "tailSize"},
    flower: {tar1: "thorns", tar2: "spots", prop1: "centerSize", prop2: "petalLength"}
  }

  // allows us to write (and record) what color we want without needing hex codes
  this.color_dict = {
    blue: "#5da5db",
    red: "#f42935",
    yellow: "#eec900",
    green: "#228b22",
    orange: "#ff8c00",
    purple: "#b62fef",
    pink: "#f97ada",
    lightblue: "#11edf4",
    lightgreen: "#11f427",
    lightpurple: "#dda0dd"
  }

  this.categories = {
    bird: [],
    bug: [],
    fish: [],
    tree: [],
  }

  this.colorOptions = _.keys(this.color_dict);
  this.species = _.keys(this.categories);


  this.threeFeatures = ["tar1","tar2","prop1"]


  this.allBinaryPossibilities = [
    [0,0,0], [0,0,1], [0,1,0], [0,1,1],
    [1,0,0], [1,0,1], [1,1,0], [1,1,1]
  ]

  this.arrayToString = function(arr){
    return arr.join(',')
  }

  // concept = array of feature strings
  this.getComplementConcept = function(concept){
    return _.map(
      _.difference(this.allBinaryStrings, _.map(concept, this.arrayToString)),
      function(str){return str.split(',')}
    )
  }

  this.allBinaryStrings = _.map(this.allBinaryPossibilities, this.arrayToString)

  this.shepardConcepts = {
    i:  [ [0,0,0], [0,0,1], [0,1,0], [0,1,1]],
    ii: [ [0,0,0], [0,0,1], [1,1,0], [1,1,1]],
    iii:[ [0,0,0], [0,0,1], [0,1,0], [1,0,1]],
    iv: [ [0,0,0], [0,0,1], [0,1,0], [1,0,0]],
    v:  [ [0,0,0], [0,0,1], [0,1,0], [1,1,1]],
    vi: [ [0,0,0], [1,0,1], [1,1,0], [0,1,1]],
  }

  this.defaultCritterOptions = {
    tar1: 0, tar2: 0, tar3: 0,
    col1: "#808080", col2: "#808080", col3: "#808080", col4: "#808080", col5: "#808080",
    prop1: 0, prop2: 0,
    categoryLabel: "blicket", genus:"bird"
  }

  // positiveExamples = array of arrays (one of this.shepardConcepts)
  // genus is bird, bug, fish ...
  this.generateBlock = function(positiveExamples, genus){
    var negativeExamples = this.getComplementConcept(positiveExamples); // subtract positiveExamples from allBinaryPossibilities
    var featureOrder = _.shuffle(this.threeFeatures); // randomize what creature features correspond to the boolean slots e.g., [1,0,0]
    var labelPositiveOrNegative = (0.5 > Math.random()) ? 1 : 0; // does the label get assigned to the "positive examples" or "negative examples"?
    var label = this.ourCreatNames.pop().exemplar; // a name (e.g., wug)
    var colorName = _.shuffle(this.colorOptions).pop(); // a color name (e.g., "blue") [all exemplars will be of the same color]
    var blockOfStims = [];
    for (var j = 0; j < 2; j++){ // loop over positive and negative examples
      var categoryExemplars = [positiveExamples, negativeExamples][j];
      console.log(j)
      console.log(labelPositiveOrNegative)
      console.log(labelPositiveOrNegative == j)
      var categoryLabel = (labelPositiveOrNegative == j) ? label : "unlabeled";

      for (var i = 0; i < categoryExemplars.length; i++){ // loop over each exemplar
        var basicOptions = _.clone(this.defaultCritterOptions);
        var featureValues = categoryExemplars[i]; // e.g., [1, 0, 0]
        var featureObj = _.fromPairs(_.zip(featureOrder, featureValues)); // e.g., {tar1: 1, tar2: 0, prop1: 0}

        blockOfStims.push(_.assign(basicOptions,
          featureObj,  { categoryLabel,
                    colorName,
                    genus },
          _.fromPairs(_.zip(
            ["col1", "col2", "col3", "col4", "col5"],
            fillArray(5, this.color_dict[colorName])
            )
          )
          )
        )

      }

    }
    return blockOfStims
  }

  // {
  //  "col1": creatureColor["color"][localCounter],
  //  "col2": creatureColor["color"][localCounter],
  //  "col3": creatureColor["color"][localCounter] == null ? null : creatureColor["color"][localCounter] ,
  //  "col4": creatureColor["color"][localCounter] == null ? null : creatureColor["color"][localCounter],
  //  "col5": creatureColor["color"][localCounter] == null ? null : creatureColor["color"][localCounter],
  //  "prop1": creatOpts.prop1 == null ? utils.randProp() : creatOpts.prop1,
  //  "prop2": creatOpts.prop2 == null ? utils.randProp() : creatOpts.prop2,
  //  "tar1": utils.flip(creatOpts.tar1),
  //  "tar2": utils.flip(creatOpts.tar2),
  //  "tar3": utils.flip(creatOpts.tar3),
  //  "creatureName": uniqueCreatures[i],
  //  "critter" : creatureCategory,
  //  "stimID": j,
  //  "internal_prop": n_with_feature[j % this.exemplarN],
  //  "internalFeature_probs": internalFeature_probs[i],
  //  "internalFeature_dist" : internalFeature_probs.join(','),
  //  "meanColorName": _.invert(this.color_dict)[creatureColor["creatureColorNames"][localCounter]],
  //  "creatureOpts": creatureOpts, //?
  //  // "critter_full_info": creatOpts
  // }




  this.speciesFeatureParams = {
    "bird": [
      [{prop1: 0, prop2: 0}, {tar1: 0, tar2: 0}],
      [{prop1: 0.8, prop2: 0.8}, {tar1: 1, tar2: 1}]
    ],
    "bug": [
      [{prop1: 0, prop2: 0}, {tar1: 0, tar2: 0}],
      [{prop1: 0.8, prop2: 0.8}, {tar1: 1, tar2: 1}]
    ],
    "fish":[
      [{prop1: 0, prop2: 0}, {tar1: 0, tar2: 0}],
      [{prop1: 0.8, prop2: 0.8}, {tar1: 1, tar2: 1}]
    ],
    "tree": [
      [{prop1: 0.2, prop2: 0.2}, {tar1: 0, tar2: 0}],
      [{prop1: 0.8, prop2: 0.8}, {tar1: 0, tar2: 0}]
    ],
  }


  // 4 rounds, 3 categories per round
  // assuming each property is boolean
  // tar is a feature (e.g., whiskers)
  // prop is shape / size (e.g., fat)


  this.createDeterministicColorArray = function(colorLabel){
    return [{p:1, mean: colorLabel}, {p:0, mean: colorLabel}]
  }

  this.distributions = {
    internal:  [
        [0, 0, 1],
        [0.5, 0.5, 0.5],
        [0, 0.75, 1],
        [0, 0.25, 1]
      ],
    colors: []
    // _.map(_.range(this.numRounds * 2), function(i){
    //   return _.map(_.shuffle(this.colorOptions).slice(0, 3), this.createDeterministicColorArray)
    // })
      // [{p:1, mean: "blue"}, {p:0, mean: "blue"}],
      // [{p:1, mean: "yellow"}, {p:0, mean: "yellow"}],
      // [{p:1, mean: "red"}, {p:0, mean: "red"}]
  //  ]
    // tar1: [
    //
    // ],
    // tar2: [
    //
    // ],
    // prop1: [
    //
    // ],

    // prop2: [
    //
    // ]
  }

  for (i = 0; i < this.numRounds * 2; i++){
    this.distributions.colors.push(
      _.map(
        _.shuffle(this.colorOptions).slice(0, this.creatureTypesN), this.createDeterministicColorArray)
    )
  }

  // console.log(this.distributions.colors)
  var testCreatNames = _.clone(this.ourCreatNames);

  this.createCreatureOptsObj = function(creature, shapeParams, featureParams, colors) {
    var newName = testCreatNames.pop()
    // var colors = this.distributions.colors.pop();
    // console.log(creature)
    // console.log(colors);
    return _.extend({ creature, name: newName.exemplar,
      globalColors: [
      { p: colors[0].p, props: { color_mean: colors[0].mean, color_var: 0.001 } },
      { p: colors[1].p, props: { color_mean: colors[1].mean, color_var: 0.001 } }
    ] }, shapeParams, featureParams)
  }


  // GENERATE CREATURE OPTS
  for (repeatSpecies = 0; repeatSpecies < 2; repeatSpecies++){
    for (speciesInd = 0; speciesInd < this.species.length; speciesInd++){
      var speciesLabel = this.species[speciesInd]
      var colorDistribution = this.distributions.colors.pop(); // set of colors (one for each category)

      var blockCreatureOpts = []; // the current format for creatureOpts is an array of arrays
      // so this will be that inner array
      for (i=0; i<this.creatureTypesN; i++){
        // prop and tar info (can be different for the repetitions of species [eg bird, bug] across blocks)
        var speciesFeatureParams = this.speciesFeatureParams[speciesLabel][repeatSpecies];

        blockCreatureOpts.push(this.createCreatureOptsObj(speciesLabel,
            speciesFeatureParams[0], speciesFeatureParams[1],colorDistribution[i])
        )

      }
      this.categories[speciesLabel].push(blockCreatureOpts)
    }
  }

  // console.log(this.categories)
  // console.log(this.categories.fish)


    //this.uniqueCreatures =  _.uniq(_.pluck(this.creatureOpts, "name")); //might need to comment back in


  // Which round are we on (initialize at -1 so that first round is 0-indexed)
  this.roundNum = -1;

  this.currentSlide = {
    playerA: "i0",
    playerB: "i0"
  }

  // This will be populated with the critters shown
  this.trialInfo = [];

  this.task_welcome_critter = {
    bird_bug: "<h2>Save the population</h2><p><br> The population of birds on the island is dwindling because of poisonous bugs. Learn about the birds and bugs with your partner to try to save the birds.</p>",
    tree_fish: "<h2>Protect the fish</h2><p><br> Fish off the shore of the island are under threat by crocodiles. They can be helped by putting them near plants with leaves that can protect them. Learn about the fish and the plants with your partner to try to save the fish.</p>"
  }

  this.critter_instructions = {
    bird: {
      internal_prop_instruct: "it lays eggs.",
      internal_prop_symbol: "&#x1F423;", //hatching chick
      test_instruct: "birds that lay eggs."
    },
    bug: {
      internal_prop_instruct: "it is poisonous.",
      internal_prop_symbol: "&#x2620;", //skull & crossbones sign
      test_instruct: "bugs that are poisonous."
    },
    fish: {
      internal_prop_instruct: "it lives near crocodiles.",
      internal_prop_symbol: "&#x1f40a;", //crocodile
      test_instruct: "fish that live near crocodiles."
    },
    tree: {
      internal_prop_instruct: "it grows leaves.",
      internal_prop_symbol: "&#x2618;", //shamrock
      test_instruct: "plants that grow leaves."
    }
  }

  if(this.server) {

    console.log(this.generateBlock(this.shepardConcepts.i, "bird"))

    // If we're initializing the server game copy, pre-create the list of trials
    // we'll use, make a player object, and tell the player who they are
    this.id = options.id;
    this.expName = options.expName;
    this.player_count = options.player_count;

    var playerDistributions = {
      A: _.shuffle(this.distributions.internal),
      B: _.shuffle(this.distributions.internal)
    };

    // needs to be generalized
    // determines what critters will be used and who sees what when
    var critterOrders = {
      A: ["fish", "bug", "tree", "bird"],
      B: ["tree", "bird", "fish", "bug"]
    }
    var aOrder = [], bOrder = [];
    for (i = 0; i<playerDistributions.A.length; i++){
      // console.log(playerDistributions.A[i])
      aOrder.push(
        this.genCreatures(critterOrders.A[i],
          0,
          playerDistributions.A[i])
        )

        // console.log(playerDistributions.B[i])

      bOrder.push(
        this.genCreatures(critterOrders.B[i],
          1,
          playerDistributions.B[i])
        )

    }

    // console.log(aOrder)
    // assigns the critters to their respective players
    this.trialList = {
      playerA: aOrder,
      playerB: bOrder
    };

    console.log(JSON.stringify(aOrder[0][0]))

    // this is switched so the they will get tested on the information their partner relayed to them
    this.testList = {
      playerA: bOrder,
      playerB: aOrder
    };

    // console.log(this.testList)

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
  module.exports = {game_core, game_player};
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

game_core.prototype.createFeatureArray = function(creatureLabel, creatureCategory, num){ //add num as parameter too
  var creatureOpts = this.categories[creatureCategory][num];
  var creatOpts = _.filter(creatureOpts, {name: creatureLabel})[0];
  var creatureColors = [];
  var creatureColorNames = [];
  var creatureLocation = [];
  var nRemaining = this.exemplarN; // number of exemplars in category
  // 2 possible colors (so loop for i < 2)
  for (var i=0; i < creatOpts.globalColors.length; i++ ){
    var colorProps = creatOpts.globalColors[i];

    var n_creatures_of_this_color =  probToCount(
      colorProps.p, this.exemplarN
      );

    var ncrit = n_creatures_of_this_color == 0 ?
    ((colorProps.p > 0) && (nRemaining > 0)) ? 1 : 0 :
    n_creatures_of_this_color
    creatureColors = creatureColors.concat(
      fillArray(ncrit,
        utils.genColor(
          this.color_dict[colorProps["props"]["color_mean"]],
          colorProps["props"]["color_var"]
          ))
      )
    creatureLocation = 0;

    creatureColorNames = creatureColorNames.concat(
      fillArray(ncrit,
        this.color_dict[colorProps["props"]["color_mean"]]   )
      )

    nRemaining = nRemaining-ncrit;
  }
  return {color: creatureColors, location: creatureLocation,  creatureColorNames: creatureColorNames}
}


game_core.prototype.representativeFlip = function(p, n){
  var creatureBooleans = [];
  var n_creatures_w_feature =  probToCount(p, n);
  var ncrit = n_creatures_w_feature == 0 ?
      (p > 0) ? 1 : 0 :
        n_creatures_w_feature
  creatureBooleans = creatureBooleans.concat(
      fillArray(ncrit, 1),
      fillArray(n - ncrit, 0)
      )
  return _.shuffle(creatureBooleans)
}


game_core.prototype.genCreatures = function(creatureCategory, num, internalFeature_probs){ //include num as parameter
  var j = 0;
  // Generates the characteristics for each critter
  var allCreatures = [];
  var creatureOpts = this.categories[creatureCategory][num];
  // get unique labels (e.g., wug, fep, lorch); should be number of unique kinds in each block
  uniqueCreatures =  _.uniqBy(_.map(creatureOpts, "name"));
  for (var i = 0; i < uniqueCreatures.length; i++){
    var creatOpts = _.filter(creatureOpts, {name: uniqueCreatures[i]})[0];
    // console.log(uniqueCreatures[i])
    var creatureColor = this.createFeatureArray(
     uniqueCreatures[i], creatureCategory, num
     );
    //  console.log(creatureColor)
    var n_with_feature =  this.representativeFlip(internalFeature_probs[i], this.exemplarN);
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
      "tar3": utils.flip(creatOpts.tar3),
      "creatureName": uniqueCreatures[i],
      "critter" : creatureCategory,
      "stimID": j,
      "internal_prop": n_with_feature[j % this.exemplarN],
      "internalFeature_probs": internalFeature_probs[i],
      "internalFeature_dist" : internalFeature_probs.join(','),
      "meanColorName": _.invert(this.color_dict)[creatureColor["creatureColorNames"][localCounter]],
      "creatureOpts": creatureOpts, //?
      // "critter_full_info": creatOpts
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
  // console.log(local_game.get_active_players())
  _.map(local_game.get_active_players(), function(p){
    // console.log(p.instance.role)
    // p.instance.role ? console.log(local_game.trialList[p.instance.role][0][0]): null
    var playerState = p.instance.role ? _.extend(state,
    {
      initialLearningCritters: local_game.trialList[p.instance.role][0]
    }
    ) : state
    p.player.instance.emit( 'onserverupdate', playerState);
  });
};

// var calculate_end_game_bonus = function(){
//     console.log(this.testScores)
//     console.log(this.bonusAmt)
//     var reward = 0;
//     for(var i=0; i<this.numRounds; i++){
//       for (var j=0; j<2; j++){
//         var role_index = j == 0 ? "playerA" : "playerB";
//         reward += this.testScores[role_index][i].hits + this.testScores[role_index][i].correctRejections;
//       }
//     }
//     console.log("reward is " + reward);
//     return reward;

//   }
