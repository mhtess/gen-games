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

  dataStore = ['csv']; //maybe change to just csv
  email = 'mtessler@stanford.edu';
  projectName = 'genGames';
  experimentName = 'game-4';
  // This has replaced expid - see if this is recorded
  iterationName = 'pilot1';
  anonymizeCSV = true;
  bonusAmt = 2; // in cents

  // Determines which critters are present in the game and who gets which first
  critter = {
    role1 : 'bird',
    role2 : 'bug'
  }

  // lodash -- underscore
  // _.uniqBy -- _.uniq
  // _.filter -- _.where
  // _.map -- _.pluck

genCreatures = function(creatureCategory, num, interval_feature_probs){ //include num as parameter
  var j = 0;
  // Generates the characteristics for each critter
  var allCreatures = [];
  var creatureOpts = categories[creatureCategory][num];
  // get unique labels (e.g., wug, fep, lorch); should be number of unique kinds in each block
  uniqueCreatures =  _.uniq(_.pluck(creatureOpts, "name"));
  for (var i = 0; i < uniqueCreatures.length; i++){
    var creatOpts = _.where(creatureOpts, {name: uniqueCreatures[i]})[0];
    // console.log(uniqueCreatures[i])
    var creatureColor = createFeatureArray(
     uniqueCreatures[i], creatureCategory, num
     );
    //  console.log(creatureColor)
    var n_with_feature =  representativeFlip(interval_feature_probs[i], exemplarN);
    var localCounter = 0;
    while (j<(exemplarN*(i+1))) {
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
      "internal_prop": n_with_feature[j % exemplarN],
      "creatureOpts": creatureOpts,
      "critter_full_info": creatOpts
    })
     localCounter++;
     j++;
   }
 }
 return allCreatures
}


  // // How many rounds do we want people to complete? MAKE SURE THIS ALIGNS WITH EXP TEMPLATE SLIDE AMT
  // numRounds = 4;
  // // number of different species
  // creatureTypesN = 3;
  // // number of exemplars displayed in a block
  // creatureN = 12;
  // // number of each critter of a species
  // exemplarN = creatureN/creatureTypesN;

  // Number of rows & columns in table presenting critters
  // presentRows = 2;
  // presentCols = creatureN/presentRows;

  // Determines the specifics of the critters used in the experiment. Can be probabilistic
  // Change this to change distribution, critter type, names of species, and critter characteristics
  critterScale = 0.5;

  // 4 rounds, 3 categories per round
  // assuming each property is boolean
  // tar is a feature (e.g., whiskers)
  // prop is shape / size (e.g., fat)

  // allows us to write (and record) what color we want without needing hex codes
  color_dict = {
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

  categories = {
    bird: [],
    bug: [],
    fish: [],
    tree: [],
  }

  colorOptions = _.keys(color_dict);
  //works!!
  console.log("coloroptions: "+ colorOptions)
  species = _.keys(categories);

  distributions = {
    internal:  [
        [0, 0, 1],
        [0.5, 0.5, 0.5],
        [0, 0.75, 1],
        [0, 0.25, 1]
      ],
    colors: []
  }

  

  createDeterministicColorArray = function(colorLabel){
    return [{p:1, mean: colorLabel}, {p:0, mean: colorLabel}]
  }

  // var testCreatNames = _.clone(ourCreatNames);

  creatureNames = [
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


// How many rounds do we want people to complete? MAKE SURE THIS ALIGNS WITH EXP TEMPLATE SLIDE AMT
  numRounds = 4;
  // number of different species
  creatureTypesN = 3;
  // number of exemplars displayed in a block
  creatureN = 12;
  // number of each critter of a species
  exemplarN = creatureN/creatureTypesN;

  presentRows = 2;
  presentCols = creatureN/presentRows;
  
ourCreatNames = _.shuffle(creatureNames).slice(0, numRounds * creatureTypesN * 2);

console.log(_.shuffle(colorOptions).slice(0, creatureTypesN))
console.log(createDeterministicColorArray('yellow'))

for (i = 0; i < numRounds * 2; i++){
    distributions.colors.push(
      _.map(
        _.shuffle(colorOptions).slice(0, creatureTypesN), createDeterministicColorArray)
    )
  }
// works
  console.log(distributions.colors[0])


  var testCreatNames = _.clone(ourCreatNames);

  createCreatureOptsObj = function(creature, shapeParams, featureParams, colors) {
    var newName = testCreatNames.pop()
    // var colors = this.distributions.colors.pop();
    // console.log(creature)
    // console.log(colors);
    return _.extend({ creature, name: newName.exemplar,
      expColors: [
      { p: colors[0].p, props: { color_mean: colors[0].mean, color_var: 0.001 } },
      { p: colors[1].p, props: { color_mean: colors[1].mean, color_var: 0.001 } }
    ] }, shapeParams, featureParams)
  }

  speciesFeatureParams = {
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

  // // GENERATE CREATURE OPTS
  // for (repeatSpecies = 0; repeatSpecies < 2; repeatSpecies++){
  //   for (speciesInd = 0; speciesInd < species.length; speciesInd++){
  //     var speciesLabel = species[speciesInd]
  //     var colorDistribution = distributions.colors.pop(); // set of colors (one for each category)

  //     var blockCreatureOpts = []; // the current format for creatureOpts is an array of arrays
  //     // so this will be that inner array
  //     for (i=0; i<creatureTypesN; i++){
  //       // prop and tar info (can be different for the repetitions of species [eg bird, bug] across blocks)
  //       var speciesFeatureParams = speciesFeatureParams[speciesLabel][repeatSpecies];

  //       blockCreatureOpts.push(createCreatureOptsObj(speciesLabel,
  //           speciesFeatureParams[0], speciesFeatureParams[1],colorDistribution[i])
  //       )

  //     }
  //     categories[speciesLabel].push(blockCreatureOpts)
  //   }
  // }

  // console.log(this.categories)
  // console.log(this.categories.fish)


    //this.uniqueCreatures =  _.uniq(_.pluck(this.creatureOpts, "name")); //might need to comment back in


  // // Which round are we on (initialize at -1 so that first round is 0-indexed)
  // roundNum = -1;

  // This will be populated with the critters shown
  trialInfo = [];

  task_welcome_critter = {
    bird_bug: "<h2>Save the population</h2><p><br> The population of birds on the island is dwindling because of poisonous bugs. Learn about the birds and bugs with your partner to try to save the birds.</p>",
    tree_fish: "<h2>Protect the fish</h2><p><br> Fish off the shore of the island are under threat by crocodiles. They can be helped by putting them near plants with leaves that can protect them. Learn about the fish and the plants with your partner to try to save the fish.</p>"
  }

  critter_instructions = {
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

  console.log(genCreatures("fish", 12, [1,0,1])[0])

    // needs to be generalized
    // determines what critters will be used and who sees what when
    var critterOrders = ["fish", "bug", "tree", "bird"]
    var order = [];
    for (i = 0; i<distributions.internal.length; i++){
      // console.log(playerDistributions.A[i]) 4times
      order.push(
        genCreatures(critterOrders[i],
          12, // was 0, im confused
          distributions.internal[i])
        )
      console.log("order: " + order)
    }

    // this is switched so the they will get tested on the information their partner relayed to them
    var allCreatures = order;
    console.log("stim all: " + allCreatures)

    // console.log(this.testList)

    // data = {
    //   //id : id,
    //   trials : [],
    //   catch_trials : [], system : {},
    //   subject_information : {
    //     score: 0
    //   }
    // };
    // players = [{
    //   //id: null,
    //   instance: null,
    //   player: new game_player(exp)
    // }];
  

// HELPER FUNCTIONS

// need this or one of the critter things wont show up anymore
newRound = function() {
  // If you've reached the planned number of rounds, end the game
  if(roundNum == numRounds - 1) {
    _.pluck(get_active_players(), function(p){
      p.player.instance.disconnect();});
  } else {
    // Otherwise, get the preset list of tangrams for the new round
    roundNum += 1;
    blockCritters = {currStim: trialList[roundNum]};
    server_send_update();
  }
};

var fillArray = function(n, fillVal){
  return Array(n).fill(fillVal)
}

var probToCount = function(p, n){
  return Math.round(p*n);
}

createFeatureArray = function(creatureLabel, creatureCategory, num){ //add num as parameter too
  var creatureOpts = categories[creatureCategory][num];
  var creatOpts = _.where(creatureOpts, {name: creatureLabel})[0];
  var creatureColors = [];
  var creatureLocation = [];
  var nRemaining = exemplarN; // number of exemplars in category
  // 2 possible colors (so loop for i < 2)
  for (var i=0; i < creatOpts.expColors.length; i++ ){
    var colorProps = creatOpts.expColors[i];

    var n_creatures_of_this_color =  probToCount(
      colorProps.p, exemplarN
      );

    var ncrit = n_creatures_of_this_color == 0 ?
    ((colorProps.p > 0) && (nRemaining > 0)) ? 1 : 0 :
    n_creatures_of_this_color
    creatureColors = creatureColors.concat(
      fillArray(ncrit,
        utils.genColor(
          color_dict[colorProps["props"]["color_mean"]],
          colorProps["props"]["color_var"]
          ))
      )
    creatureLocation = 0;
    nRemaining = nRemaining-ncrit;
  }
  return {color: creatureColors, location: creatureLocation}
}


representativeFlip = function(p, n){
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





// this gets run when the game is created and creates all trial information
// functionally equivalent to making something like stims in init() in template.js
makeTrialList = function () {
  var local_this = exp;
  var conditionList = getRandomizedConditions();
  var trialList = [];
  for (var i = 0; i < conditionList.length; i++) {
    var condition = conditionList[i];
    var objList = sampleTrial(condition); // Sample three objects
    var locs = sampleStimulusLocs(); // Sample locations for those objects
  };
  return(trialList);
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
