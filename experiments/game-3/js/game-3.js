var prev = null;

function mark(el, otherEls) {
  if(prev != null){
    gray(prev);
  }
  prev = el;

    el.style.border=='' ? 
    $('#'+el.id).css({"border":'2px solid red',
                    'background-color': 'white','opacity': '1'}) &
    $('#'+el.id+'critname').css({'opacity': '1', 'font-weight': 'bold'})
                     : 
    $('#'+el.id).css({"border":'',
                    'background-color': 'white'})
    otherEls.map(function(cell){$('#'+cell).css({"border":'',
      'background-color': 'white'})})

  $('#'+el.id+'critname').css({'opacity': '1'});
  check(allCreatures.length);

}


function gray(el) {
   $('#'+el.id).css({'opacity': '0.5'})
   $('#'+el.id+'critname').css({'opacity': '0.5', 'font-weight': 'normal'});

}

function check(num){
  var check_all = 0;
  for(var i=0; i<num; i++) {
     if($('#cell'+i+'critname').css('opacity') != 0){
        ++check_all;
     }
  }
  console.log(check_all);

  if(check_all == num) {
     $("#learning_button").show();
  }

}

function create_table(rows, cols) { //rows * cols = number of exemplars
  var table = "<table>";
  for(var i=0; i <rows; i++) {
    table += "<tr>";
    for(var j=0; j<cols; j++) {
      table += "<td>";
      var ind = i * cols + j;
      table += "<table class ='cell' id='cell" + ind + "' onclick=\"mark(cell" + ind +",";
      table += "[";
      for(var k=0; k<rows*cols; k++) {
        if(k != ind){
          table += "'cell" + k + "'";
        }
        if(!(k == rows*cols-1 || k == ind || (ind == rows*cols-1 && k == rows*cols-2))) {
          table += ",";
        }
      }
      table += "])\">";

      table += "<td>";
      table += "<svg id='critter" + ind +
        "' style='max-width:100px;max-height:100px\'></svg></td>";

      table += "<tr>";
      table += "<div class='critname' id='cell" + ind + "critname'></div></tr>";
      table += "</table>";
      table += "</td>";
      
    }
    table += "</tr>"
  }
  table += "</table>";
  $("#critter_display").append(table);
}



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


  slides.welcome_critterLand = slide({
    name : "welcome_critterLand",


    start : function(stim) {
      var start_time = Date.now()
      this.stim = stim;
      $(".critname").hide();
      $(".err").hide();
      $("#learning_button").hide(); //fix this
      var shuffledCritters = _.shuffle(allCreatures)


      create_table(3,4);

      for (var i=0; i<shuffledCritters.length; i++) {
            var scale = 0.5;
            Ecosystem.draw(
              shuffledCritters[i]["critter"], shuffledCritters[i],
              "critter"+i, scale)
      }

      
       for(var i=0; i<shuffledCritters.length; i++) {
         $('#cell'+i+'critname').html(shuffledCritters[i]["creatureName"]);
         $('#cell'+i+'critname').css({'opacity': '0'});

      }

    },

    button : function() {
      var end_time = Date.now()
      this.time_spent = end_time - this.start_time;
      exp.go(); // use exp.go() if and only if there is no "present" data.
      
    },
  });


  slides.learning_trial = slide({
    name: "learning_trial",

    /* trial information for this block
     (the variable 'stim' will change between each of these values,
      and for each of these, present_handle will be run.) */

    present : exp.learning_critters,
    trial_num: 0,

    present_handle : function(stim) {
      // reset critter & note
      $("#critterSVG").empty();
      $("#participantNote").val('');
      $(".prompt").html('');

      // hide stuff
      $(".err").hide();
      $("#continueButton").hide();
      $(".notePrompt").hide();
      $("#participantNote").hide();

      // show stuff
      $("#detectorButton").show();

      this.critOpts = _.where(critFeatures, {creature: stim.critter})[0];
      this.question = _.where(question_phrase, {creature: stim.critter})[0];

      this.stim = stim; //I like to store this information in the slide so I can record it later.

      this.start_time = Date.now()

      var scale = 0.5;
      Ecosystem.draw(
        stim.critter, stim,
        "critterSVG", scale)

      // would need to change if you want a different internal property
      stim.location == "trees" ?
        environmentString = "in the <strong>trees</strong>" :
        environmentString = "on the <strong>ground</strong>"

      // $(".critterInfo").html("You see this creature " + environmentString);
      $(".critterInfo").html("You see this creature.");

      // $(".attentionCheck").html("Does it have " + this.question[stim.attentionCheck] + "?")

      // $('input[type=radio]').attr('checked', false);

      this.trial_num++;

    },

    detector: function(){
      // hide stuff
      $("#detectorButton").hide();

      // present stuff
      $(".prompt").html("CritterDex output: " + this.stim.creatureName);
      $(".notePrompt").html("Write yourself a note to help you remember.");

      // show stuff
      $("#participantNote").show();
      $("#continueButton").show();
      $(".notePrompt").show();

    },

    button : function() {
      var end_time = Date.now();
      response = $("#participantNote").val();
      if (response == "") {
        $(".err").show();
      } else {
        this.time_spent = end_time - this.start_time;
        this.log_responses();
        _stream.apply(this); //make sure this is at the *end*, after you log your data
      }
    },

    log_responses: function(){
      exp.catch_trials.push({
          "trial_type" : "learning_trial",
          "trial_num" : this.trial_num,
          "question": exp.question,
          "distribution": JSON.stringify(exp.distribution),
          "response" : $("#participantNote").val(),
          // "response" : $('input[type=radio]:checked').val(),
          // "question" : this.stim["attentionCheck"],
          "time_in_seconds" : this.time_spent/1000,
          "critter" : this.stim["critter"],
          "species" : this.stim["creatureName"],

          "col1_crit" : this.critOpts.col1,
          "col2_crit" : this.critOpts.col2,
          "col3_crit" : this.critOpts.col3,
          "col4_crit" : this.critOpts.col4,
          "col5_crit" : this.critOpts.col5,
          "prop1_crit" : this.critOpts.prop1,
          "prop2_crit" : this.critOpts.prop2,
          "tar1_crit" : this.critOpts.tar1,
          "tar2_crit" : this.critOpts.tar2,

          //"color" : this.stim["color"], //change this
          "col1" : this.stim["col1"],
          "col2" : this.stim["col2"],
          "col3" : this.stim["col3"] == null ? "-99" : this.stim["col3"],
          "col4" : this.stim["col4"] == null ? "-99" : this.stim["col4"],
          "col5" : this.stim["col5"] == null ? "-99" : this.stim["col5"],
          "prop1" : this.stim["prop1"] == null ? "-99" : this.stim["prop1"],
          "prop2" : this.stim["prop2"] == null ? "-99" : this.stim["prop2"],
          "tar1" : this.stim["tar1"] ? 1 : 0,
          "tar2" : this.stim["tar2"] ? 1 : 0
        });
    }
  });
  slides.test_trial = slide({
    name: "test_trial",

    /* trial information for this block
     (the variable 'stim' will change between each of these values,
      and for each of these, present_handle will be run.) */

    present : _.shuffle(exp.test_critters),
    trial_num: 0,

    present_handle : function(stim) {
      // reset critter & note
      $("#critterTestSVG").empty();
      $("#testFreeResponse").val('');

      // hide stuff
      $(".err").hide();

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
      response = $("#testFreeResponse").val();
      if (response == "") {
        $(".err").show();
      } else {
        this.time_spent = end_time - this.start_time;
        this.log_responses();
        _stream.apply(this); //make sure this is at the *end*, after you log your data
      }
    },

    log_responses: function(){
      exp.catch_trials.push({
          "trial_type" : "test_trial",
          "trial_num" : this.trial_num,
          "question": exp.question,
          "distribution": JSON.stringify(exp.distribution),
          "response" : $("#testFreeResponse").val(),
          // "response" : $('input[type=radio]:checked').val(),
          "question": exp.question,
          "time_in_seconds" : this.time_spent/1000,
          "critter" : this.stim["critter"],
          "species" : this.stim["creatureName"],

          "col1_crit" : this.critOpts.col1,
          "col2_crit" : this.critOpts.col2,
          "col3_crit" : this.critOpts.col3,
          "col4_crit" : this.critOpts.col4,
          "col5_crit" : this.critOpts.col5,
          "prop1_crit" : this.critOpts.prop1,
          "prop2_crit" : this.critOpts.prop2,
          "tar1_crit" : this.critOpts.tar1,
          "tar2_crit" : this.critOpts.tar2,

          //"color" : this.stim["color"], //change this
          "col1" : this.stim["col1"],
          "col2" : this.stim["col2"],
          "col3" : this.stim["col3"] == null ? "-99" : this.stim["col3"],
          "col4" : this.stim["col4"] == null ? "-99" : this.stim["col4"],
          "col5" : this.stim["col5"] == null ? "-99" : this.stim["col5"],
          "prop1" : this.stim["prop1"] == null ? "-99" : this.stim["prop1"],
          "prop2" : this.stim["prop2"] == null ? "-99" : this.stim["prop2"],
          "tar1" : this.stim["tar1"] ? 1 : 0,
          "tar2" : this.stim["tar2"] ? 1 : 0
        });
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

  slides.subj_info =  slide({
    name : "subj_info",
    submit : function(e){
      //if (e.preventDefault) e.preventDefault(); // I don't know what this means.
      exp.subj_data = {
        language : $("#language").val(),
        enjoyment : $("#enjoyment").val(),
        asses : $('input[name="assess"]:checked').val(),
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
   })();
  exp.trials = [];
  exp.catch_trials = [];
  //exp.all_stimuli = _.shuffle(all_stimuli); // all_stimuli
  exp.question = _.sample([
    "find creatures",
    "find all of the creatures"
  ]); //can randomize between subject conditions here
  // exp.distribution is probability of binary feature
  // p( color | category1), p( color | category2 )
  // color is binary (but may have different binary values for two categories)

  // inside shuffle is to randomize between the two colors
  exp.distribution = _.sample([
    [1, 1, 0.5],
    [1, 1, 0.25]
  ])
  // console.log(exp.distribution)
  // TO DO:
  // - test trials: 2 x each category (perhaps one of each color)

  // Generates the characteristics for each critter
  for (var i = 0; i < creatureTypesN; i++){
  // for (var i = 0; i < uniqueCreatures.length; i++){
  	var creatureName = uniqueCreatures[i]
  	var creatOpts = _.where(creatureOpts, {name: creatureName})[0];
  	var creatureColor = createFeatureArray(
      creatureName, exp.distribution[i]
    );

  	var localCounter = 0;
  	// debugger;
  	while (j<(exemplarN*(i+1))) {
  		allCreatures.push({
        //"color": creatureColor, //color 
  			"col1": creatureColor["color"][localCounter],
  			"col2": creatureColor["color"][localCounter],
  			"col3": creatureColor["color"][localCounter] == null ? null : creatureColor["color"][localCounter] ,
  	    	"col4" : creatOpts.col4_mean == null ? null : genColor(creatOpts.col4_mean, creatOpts.col4_var),
  	    	"col5" : creatOpts.col5_mean == null ? null : genColor(creatOpts.col5_mean, creatOpts.col5_var),
  			"prop1": creatOpts.prop1 == null ? Ecosystem.randProp() : creatOpts.prop1,
  			"prop2": creatOpts.prop2 == null ? Ecosystem.randProp() : creatOpts.prop2,
  			"tar1": flip(creatOpts.tar1),
  			"tar2": flip(creatOpts.tar2),
  			"creatureName": uniqueCreatures[i],
  			"critter" : creatOpts.creature,
  			"query": "question",
  			"stimID": j,
  			"internal_prop": flip(creatOpts.internal_prop),
  			"attentionCheck": generateAttentionQuestion(),
  			"location":creatureColor.location[localCounter]
  		})
  		localCounter++;
    		j++;
  	}

    //var shuffledCritters = _.shuffle(allCreatures)
  }

  exp.creatureCategories = _.uniq(_.pluck(allCreatures, "creatureName"))

  // exp.test_critters = _.uniq(_.map(allCreatures, function(stim){
  //   _.omit(stim, ["col4", "col5","stimID", "internal_prop",
  // "attentionCheck", "location"])
  // }

// ))
  exp.learning_critters = _.shuffle(allCreatures);
  exp.test_critters = _.uniq(allCreatures, function(stim){
    return _.values(_.pick(stim,
      //"col1", "col2","col3", "creatureName", "tar1","tar2"
      "color", "col1", "col2","col3", "creatureName", "tar1","tar2" //maybe change back later
    )).join('')
  })

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
    "welcome_critterLand",
    //"learning_trial",
    "messagePassing",
    "test_trial",
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
