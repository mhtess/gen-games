function make_slides(f) {
  var   slides = {};

  slides.i0 = slide({
    name : "i0",
    start: function() {
      exp.startT = Date.now();
    }
  });

  slides.instructions = slide({
    name : "instructions",
    button : function() {
      exp.go(); // use exp.go() if and only if there is no "present" data.
    },
  });

  slides.learning_critters = slide({
    name : "learning_critters",

    start : function(stim) {
      var start_time = Date.now()
      this.stim = stim;
      $(".critname").hide();
      $(".err").hide();
      $("#learning_button").hide();

      // ???
      $("#welcome").show();
      $("#meeting").show();
      $("#internalprops_instruct").show();
      $("#critter_display").show();

      var shuffledCritters = _.shuffle(exp.allCreatures)
      console.log(allCreatures)

      this.num_creats = exp.allCreatures.length;
      this.creat_type = shuffledCritters[0]["critter"];

      // This generates all the critters
      create_table(exp.presentRows,exp.presentCols,"critter_display");


      for (var i=0; i<shuffledCritters.length; i++) {
        var scale = 0.5;
        Ecosystem.draw(
          shuffledCritters[i]["critter"], shuffledCritters[i],
          "critter"+i, scale)

        $('#cell'+i+'critname').html(shuffledCritters[i]["creatureName"]);

        $('#internalprops_instruct').html(
          "Click on each one to discover whether <strong>" +
          exp.critter_instructions[shuffledCritters[i]["critter"]]["internal_prop_instruct"] +
          "</strong>"
          );

        if (shuffledCritters[i]["internal_prop"]) {
          $('#cell'+i+'internalprop').html(exp.critter_instructions[shuffledCritters[i]["critter"]]["internal_prop_symbol"]);
        }

        $('#cell'+i+'internalprop').css({'opacity': 0});

      }

    },

    button : function() {
      var end_time = Date.now()
      this.time_spent = end_time - this.start_time;
      
      // clears table
      for (var i = 0; i < this.num_creats; i++) {
        var dataToSend = {
          "block_num" : exp.block,
          //"distribution" : exp.distribution, //fix this later
          "time_in_ms" : this.time_spent,
          "block": "learnCritters",
          "critter" : shuffledCritters[i]["critter"],
          "critter_num" : i,
          "species" : shuffledCritters[i]["creatureName"],
          "color" : shuffledCritters[i]["col1"],
          "prop1" : shuffledCritters[i]["prop1"],
          "prop2" : shuffledCritters[i]["prop2"],
          "tar1" : shuffledCritters[i]["tar1"],
          "tar2" : shuffledCritters[i]["tar2"],
          "tar3" : shuffledCritters[i]["tar3"],
          "internal_prop" : shuffledCritters[i]["internal_prop"]
        }
        exp.catch_trials.push(dataToSend);

        $('#critter' + i).empty();
        $('#cell' + i).css({'opacity': '1'});
        $('#cell' + i).css({'border': ''});
        $('#creature_table').remove();
        prev = null;
      }

      exp.allCreatures = [];
      shuffledCritters = [];
      //this.log_responses();
      exp.go(); // use exp.go() if and only if there is no "present" data.
      
    },
  });

slides.test_instructions = slide({
  name : "test_instructions",
  start : function() {
    // send signal to server to send stimuli
    exp.socket.send("enterSlide.test_critters.");

    this.creat_type = exp.learning_creats
    [0]["critter"];
    $('#test_instructs').html(
      "<br>On the next slide, select the " +
      exp.critter_instructions[this.creat_type]["test_instruct"]
      );

  },
  button : function() {
    exp.go()
  }
});

slides.test_critters = slide({
  name: "test_critters",

    /* trial information for this block
     (the variable 'stim' will change between each of these values,
      and for each of these, present_handle will be run.) */

critters: _.shuffle(exp.learning_creats),
trial_num: 0,

start : function() {
// reset critter & note
$("#critterTestSVG").empty();


this.start_time = Date.now()
$(".err").hide();
exp.allCreatures
shuffledCritters = _.shuffle(exp.allCreatures)
this.num_creats = exp.allCreatures.length;
this.creat_type = shuffledCritters[0]["critter"];

$('#chooseCrit').html(
 "Click on the " +
 exp.critter_instructions[this.creat_type]["test_instruct"]
 );

    // Generates critters for test phase
    create_table(exp.presentRows,exp.presentCols,"critter_test_display");

    for (var i=0; i<shuffledCritters.length; i++) {
     var scale = 0.5;
     Ecosystem.draw(
       shuffledCritters[i]["critter"], shuffledCritters[i],
       "critter"+i, scale)
     $('#cell'+i+'critname').html(shuffledCritters[i]["creatureName"]);
   }

   this.critOpts = _.where(critFeatures, {creature: stim.critter})[0];

   this.question = _.where(question_phrase, {creature: stim.critter})[0];

      this.stim = stim; //I like to store this information in the slide so I can record it later.

      this.start_time = Date.now()

      var scale = 0.5;
      Ecosystem.draw(
        stim.critter, stim,
        "critterTestSVG", scale)

      this.trial_num++;

    },
    

    button : function() {
      var end_time = Date.now();

      this.time_spent = end_time - this.start_time;

      var blockScores = {
        hits:0, misses:0, falseAlarms: 0, correctRejections: 0
      }

      for (i = 0; i < shuffledCritters.length; i++){
        var correctAnswer = shuffledCritters[i].internal_prop;
        var selectedAnswer = $('#cell' + i).attr("data-selected");
        blockScore[scoreSingle(correctAnswer, selectedAnswer)]++
      }

        //log responses
        for (var i=0; i<this.num_creats; i++) {
          var correctAnswer = shuffledCritters[i]["internal_prop"];
          var selectedAnswer = $('#cell' + i).attr("data-selected");
          var dataToSend = {
            "block_num" : exp.block,
            "block_type": "testCritters",
      //"distribution" : exp.distribution, //fix this later
      "time_in_ms" : this.time_spent,
      "critter" : shuffledCritters[i]["critter"],
      "critter_num" : i,
      "species" : shuffledCritters[i]["creatureName"],
      "color" : shuffledCritters[i]["col1"],
      "prop1" : shuffledCritters[i]["prop1"],
      "prop2" : shuffledCritters[i]["prop2"],
      "tar1" : shuffledCritters[i]["tar1"],
      "tar2" : shuffledCritters[i]["tar2"],
      "tar3" : shuffledCritters[i]["tar3"],
      "internal_prop" : correctAnswer,
      "selected" : selectedAnswer,
      "full_globalColor0_p" : shuffledCritters[i]["critter_full_info"].globalColors[0]["p"].toString(),
      "full_globalColor0_color_mean" : shuffledCritters[i]["critter_full_info"].globalColors[0]["props"]["color_mean"],
      "full_globalColor0_color_var" : shuffledCritters[i]["critter_full_info"].globalColors[0]["props"]["color_var"],
      "full_globalColor1_p" : shuffledCritters[i]["critter_full_info"].globalColors[1]["p"],
      "full_globalColor1_color_mean" : shuffledCritters[i]["critter_full_info"].globalColors[1]["props"]["color_mean"],
      "full_globalColor1_color_var" : shuffledCritters[i]["critter_full_info"].globalColors[1]["props"]["color_var"],
      "full_prop1" : shuffledCritters[i]["critter_full_info"]["prop1"],
      "full_prop2" : shuffledCritters[i]["critter_full_info"]["prop2"],
      "full_tar1" : shuffledCritters[i]["critter_full_info"]["tar1"],
      "full_tar2" : shuffledCritters[i]["critter_full_info"]["tar2"],
      "full_internal_prop" : shuffledCritters[i]["critter_full_info"]["internal_prop"],
      "score" : score(correctAnswer, selectedAnswer)
    }

    exp.catch_trials.push(dataToSend);

  }

  // empties the critter arrays so they can be repopulated without overlap
  exp.allCreatures = [];
  shuffledCritters = [];

  // resets table
  for (var i = 0; i < this.num_creats; i++) {
   $('#critter' + i).empty();
   $('#cell' + i).css({'opacity': '1'});
   $('#cell' + i).css({'border': ''});
   $('#creature_table').remove();
   prev = null;
 }

 exp.block++;
  exp.go(); // use exp.go() if and only if there is no "present" data.

}
});


slides.messagePassing = slide({
  name: "messagePassing",

  present : _.shuffle(exp.creatureCategories),
  trial_num: 0,

  present_handle : function(stim) {
    this.stim = stim;
    this.start_time = Date.now();
    $(".err").hide();
    $("#chat_response").val('');
    var critterPlural = stim == "lorch" ?
    "lorches" : stim + "s"
      // N.B.: Creature Names expected to have regular +"s" plural
      var messageQuestion = (exp.question == "find creatures") ?
      "find " + critterPlural:
      "find all of the " + critterPlural

      $("#messageInstructions").html("You can now send a message to a turker who will complete a different HIT.<br> <br>" +
        "That turker will explore CritterLand and have to <strong>" + messageQuestion  + "</strong>, but they won't have access to your CritterDex. " + "<br><br> Enter your message below:")

      this.trial_num++;
      //
      // " "++"
      // The next turker will have to explore CritterLand but won't be provided any information about the critters. Please tell them about the species in order to best guide them:")
},

button : function() {
  response = $("#chat_response").val();

  if (response == "") {
    $(".err").show();
  } else {
    this.log_responses();
        _stream.apply(this); //make sure this is at the *end*, after you log your data
      }
    },

    log_responses: function(){
      var end_time = Date.now();
      this.time_spent = end_time - this.start_time;
      response = $("#chat_response").val();

      exp.data_trials.push({
        "trial_type" : "chatbox",
        "question": exp.question,
        "time_in_seconds" : this.time_spent/1000,
        "species" : this.stim,
        "distribution": JSON.stringify(exp.distribution),
        "response" : response
      });
    }

  });

slides.score_report = slide({
  name: "score_report",
  button : function() {
    exp.go()
  }
});

slides.subj_info =  slide({
  name : "subj_info",
  submit : function(e){
      //if (e.preventDefault) e.preventDefault(); // I don't know what this means.
      exp.subj_data = {
        language : $("#language").val(),
        enjoyment : $("#enjoyment").val(),
        assess : $('#assess').val(),
        age : $("#age").val(),
        gender : $("#gender").val(),
        education : $("#education").val(),
        comments : $("#comments").val(),
        problems: $("#problems").val(),
        fairprice: $("#fairprice").val()
      };
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

slides.thanks = slide({
  name : "thanks",
  start : function() {
    exp.data= {
      "trials" : exp.data_trials,
      "catch_trials" : exp.catch_trials,
          //"learning_trials" : exp.learning_trials,
          "system" : exp.system,
          "question": exp.question,
          "distribution": JSON.stringify(exp.distribution),          
          "subject_information" : exp.subj_data,
          "time_in_minutes" : (Date.now() - exp.startT)/60000
        };
        setTimeout(function() {turk.submit(exp.data);}, 1000);
      }
    });

return slides;
}

/// init ///
function init() {

  (function(){
   var ut_id = "mht-gengame2-20170710";
   if (UTWorkerLimitReached(ut_id)) {
     $('.slide').empty();
     repeatWorker = true;
     alert("You have already completed the maximum number of HITs allowed by this requester. Please click 'Return HIT' to avoid any impact on your approval rating.");
   }
 });
 exp.trials = [];
 exp.catch_trials = [];

  // Which round are we on (initialize at -1 so that first round is 0-indexed)
  exp.roundNum = -1;
  
  exp.allCreatures = allCreatures;
  
  
  //exp.learning_trials = [];
  //exp.all_stimuli = _.shuffle(all_stimuli); // all_stimuli
  // exp.distribution is probability of binary feature
  // p( color | category1), p( color | category2 )
  // color is binary (but may have different binary values for two categories)
 // GENERATE CREATURE OPTS
 for (repeatSpecies = 0; repeatSpecies < 2; repeatSpecies++){
  for (speciesInd = 0; speciesInd < species.length; speciesInd++){
    var speciesLabel = species[speciesInd]
    var colorDistribution = distributions.colors.pop(); // set of colors (one for each category)

    var blockCreatureOpts = []; // the current format for creatureOpts is an array of arrays
    // so this will be that inner array
    for (i=0; i<exp.creatureTypesN; i++){
      // prop and tar info (can be different for the repetitions of species [eg bird, bug] across blocks)
      var speciesFeatureParam = speciesFeatureParams[speciesLabel][repeatSpecies];
      // just changed above for left side no s at end
      blockCreatureOpts.push(createCreatureOptsObj(speciesLabel,
        speciesFeatureParam[0], speciesFeatureParam[1],colorDistribution[i])
      )

    }
  categories[speciesLabel].push(blockCreatureOpts)
  }
}

  // TO DO:
  // - test trials: 2 x each category (perhaps one of each color)

  exp.creatureCategories = _.uniq(_.pluck(exp.allCreatures, "creatureName"))

  // exp.test_critters = _.uniq(_.map(exp.allCreatures, function(stim){
  //   _.omit(stim, ["col4", "col5","stimID", "internal_prop",
  // "attentionCheck", "location"])
  // }

// ))
exp.learning_creats = _.shuffle(exp.allCreatures);
// exp.test_critters = _.uniq(exp.allCreatures, function(stim){
//   return _.values(_.pick(stim,
//       //"col1", "col2","col3", "creatureName", "tar1","tar2"
//       "color", "col1", "col2","col3", "creatureName", "tar1","tar2" //maybe change back later
//       )).join('')
// })

exp.system = {
  Browser : BrowserDetect.browser,
  OS : BrowserDetect.OS,
  screenH: screen.height,
  screenUH: exp.height,
  screenW: screen.width,
  screenUW: exp.width
};
  //Change order of slides here, blocks of the experiment:
  exp.structure=[
    "i0",
    "instructions",
    "learning_critters",
    "messagePassing",
    "test_instructions",
    "test_critters",
    "score_report",
    'subj_info',
    'thanks'
    ];

  exp.data_trials = [];
  //make corresponding slides:
  exp.slides = make_slides(exp);

  exp.nQs = utils.get_exp_length(); //this does not work if there are stacks of stims (but does work for an experiment with this structure)
                    //relies on structure and slides being defined

  $('.slide').hide(); //hide everything

  //make sure turkers have accepted HIT (or you're not in mturk)
  $("#start_button").click(function() {
    if (turk.previewMode) {
      $("#mustaccept").show();
    } else {
      $("#start_button").click(function() {$("#mustaccept").show();});
      exp.go();
    }
  });
  exp.go(); //show first slide

}
