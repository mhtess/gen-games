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
      // took out the shuffling 
      this.shuffledCritters = _.shuffle(exp.allCreatures[exp.blockNum])
      console.log(exp.blockNum)

      this.num_creats = exp.allCreatures.length;
      this.creat_type = this.shuffledCritters[0]["critter"]; //fish, etc

      // This generates all the critters
      create_table(exp.presentRows,exp.presentCols,"critter_display");

      for (var i=0; i<this.shuffledCritters.length; i++) {
        var scale = 0.5;
        Ecosystem.draw(
          this.shuffledCritters[i]["critter"], this.shuffledCritters[i],
          "critter"+i, scale)

        $('#cell'+i+'critname').html(this.shuffledCritters[i]["creatureName"]);

        $('#internalprops_instruct').html(
          "Click on each one to discover whether <strong>" +
          exp.critter_instructions[this.shuffledCritters[i]["critter"]]["internal_prop_instruct"] +
          "</strong>"
          );

        if (this.shuffledCritters[i]["internal_prop"]) {
          $('#cell'+i+'internalprop').html(exp.critter_instructions[this.shuffledCritters[i]["critter"]]["internal_prop_symbol"]);
        }

        $('#cell'+i+'internalprop').css({'opacity': 0});

      }

    },

    button : function() {
      var end_time = Date.now()
      this.time_spent = end_time - this.start_time;
      
      // clears table
      for (var i = 0; i < this.num_creats; i++) {
        var dataToSend = _.extend(this.shuffledCritters[i], {
          "block_num" : exp.blockNum,
          "time_in_ms" : this.time_spent,
          "block": "learnCritters",
          "critter_num" : i,
        })

        exp.catch_trials.push(dataToSend);

        $('#critter' + i).empty();
        $('#cell' + i).css({'opacity': '1'});
        $('#cell' + i).css({'border': ''});
        $('#creature_table').remove();
        prev = null;
      }

      
      //this.log_responses();
      exp.go(); // use exp.go() if and only if there is no "present" data.
      
    },
  });

slides.test_instructions = slide({
  name : "test_instructions",
  start : function() {
    // can only do this if all creatures are the same 
    creat_type = exp.allCreatures[exp.blockNum][0]["critter"];
    $('#test_instructs').html(
      "<br>On the next slide, select the " +
      exp.critter_instructions[creat_type]["test_instruct"]
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


start : function() {
  // reset critter & note
  $("#critterTestSVG").empty();


  this.start_time = Date.now()
  $(".err").hide();

  this.shuffledCritters = _.shuffle(exp.allCreatures[exp.blockNum])

  this.num_creats = this.shuffledCritters.length;
  this.creat_type = this.shuffledCritters[0]["critter"];

  $('#chooseCrit').html(
   "Click on the " +
   exp.critter_instructions[this.creat_type]["test_instruct"]
   );

    // Generates critters for test phase
    create_table(exp.presentRows,exp.presentCols,"critter_test_display");

    for (var i=0; i<this.shuffledCritters.length; i++) {
     var scale = 0.5;
     Ecosystem.draw(
       this.shuffledCritters[i]["critter"], this.shuffledCritters[i],
       "critter"+i, scale)
     $('#cell'+i+'critname').html(this.shuffledCritters[i]["creatureName"]);
   }

      this.start_time = Date.now()

    },
    

    button : function() {
      var end_time = Date.now();

      this.time_spent = end_time - this.start_time;

      var blockScore = {
        hits:0, misses:0, falseAlarms: 0, correctRejections: 0
      }

      for (i = 0; i < this.shuffledCritters.length; i++){
        var correctAnswer = this.shuffledCritters[i].internal_prop;
        var selectedAnswer = $('#cell' + i).attr("data-selected");
        blockScore[scoreSingle(correctAnswer, selectedAnswer)]++
      }

  //log responses
  for (var i=0; i<this.num_creats; i++) {
    var correctAnswer = this.shuffledCritters[i]["internal_prop"];
    var selectedAnswer = $('#cell' + i).attr("data-selected");
    var dataToSend = _.extend(this.shuffledCritters[i], {
      "block_num" : exp.blockNum,
      "block_type": "testCritters",
      "time_in_ms" : this.time_spent,
      "critter_num" : i,
      "internal_prop" : correctAnswer,
      "selected" : selectedAnswer,
      "categorizedResponse" : scoreSingle(correctAnswer, selectedAnswer)
    })

    exp.data_trials.push(dataToSend);

  }

  // empties the critter arrays so they can be repopulated without overlap
  // resets table
  for (var i = 0; i < this.num_creats; i++) {
   $('#critter' + i).empty();
   $('#cell' + i).css({'opacity': '1'});
   $('#cell' + i).css({'border': ''});
   $('#creature_table').remove();
   prev = null;
 }

  totalScore = blockScore['hits'] + blockScore['correctRejections']
  $('#your_score').html(totalScore)

  exp.blockNum++;
  exp.go(); // use exp.go() if and only if there is no "present" data.

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
          "system" : exp.system,
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

  exp.data_trials = [];
  exp.catch_trials = [];

  exp.blockNum = 0;
  
  exp.allCreatures = [];
  exp.critter_instructions = critter_instructions
  exp.presentRows = presentRows
  exp.presentCols = presentCols

  var shuffledDistributionsInternal = _.shuffle(distributions.internal)
  
  // needs to be generalized
  // determines what critters will be used and who sees what when
  var critterOrders = ["fish", "bug", "tree", "bird"]
  // loop over number of blocks
  for (i = 0; i<distributions.internal.length; i++){
    exp.allCreatures.push(
      genCreatures(critterOrders[i],
        0, // because we only have 1 block per genus (fish, bug, bird, tree)
        shuffledDistributionsInternal[i])
      )
  }

  // TO DO:
  // - test trials: 2 x each category (perhaps one of each color)

  exp.creatureCategories = _.uniq(_.pluck(exp.allCreatures, "creatureName"))

  // exp.test_critters = _.uniq(_.map(exp.allCreatures, function(stim){
  //   _.omit(stim, ["col4", "col5","stimID", "internal_prop",
  // "attentionCheck", "location"])
  // }

// ))
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
    "test_instructions",
    "test_critters",
    "score_report",

    // "learning_critters",
    // "test_instructions",
    // "test_critters",
    // "score_report",

    // "learning_critters",
    // "test_instructions",
    // "test_critters",
    // "score_report",

    // "learning_critters",
    // "test_instructions",
    // "test_critters",
    // "score_report",

    // 'subj_info',
    'thanks'
    ];

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
