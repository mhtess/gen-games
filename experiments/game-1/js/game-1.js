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
      exp.go(); //use exp.go() if and only if there is no "present" data.
    },
  });

  slides.welcome_critterLand = slide({
    name : "welcome_critterLand",
    start : function() {
      var shuffledCritters = _.shuffle(allCreatures)
      for (var i=0; i<18; i++) {
           $("#all_critters").append(
            "<svg id='critter" + i.toString() +
            "'></svg>");
            var scale = 0.5;
            // needs to be generalized
            Ecosystem.draw(
              shuffledCritters[i]["critter"], shuffledCritters[i],
              "critter"+i, scale)
      }
      /**
      for (var j=9; j<18; j++) {
           $("#all_critters").append(
            "<svg id='critter" + j.toString() +
            "'></svg>");

            var scale = 0.5;
            Ecosystem.draw(
              "bug", {},
              "critter"+j, scale)
      }
      */
    },
    button : function() {
      exp.go(); //use exp.go() if and only if there is no "present" data.
    },
  });

  slides.condition = slide({
    name: "condition",
    start : function() {
      var cond_sentence = "You are the only one on your team equipped with a "
      exp.condition == "pepsin_detector" ?
        cond_sentence += "pepsin detector." :
        cond_sentence += "book that will help you identify species."
      $("#get_cond").append(
        "<p>"+cond_sentence+"</p>");
    },
    button : function() {
      exp.go();
    },

  });


  slides.learning_trial = slide({
    name: "learning_trial",

    /* trial information for this block
     (the variable 'stim' will change between each of these values,
      and for each of these, present_handle will be run.) */

    present : _.shuffle(allCreatures),
    trial_num: 0,

    present_handle : function(stim) {
      $("#critterSVG").empty();
      $(".err").hide();
      this.critOpts = _.where(critFeatures, {creature: stim.critter})[0];

      this.stim = stim; //I like to store this information in the slide so I can record it later.

      this.start_time = Date.now()

      var scale = 0.5;
      Ecosystem.draw(
        stim.critter, stim,
        "critterSVG", scale)

      stim.internal_prop ?
        pepsinString = "<strong>has pepsin</strong> in its bones" :
        pepsinString = "<strong>does not have pepsin</strong> in its bones"

      $(".prompt").html("This is a " + stim.creatureName + ". <br>" + "It " + pepsinString + ".");

      $(".attentionCheck").html("Does it have a " + this.critOpts[stim.attentionCheck] + "?")

      $('input[type=radio]').attr('checked', false);

      this.trial_num++;
      
    },

    button : function() {
      var end_time = Date.now();
      boolResponse = ($('input[type=radio]:checked').size() != 0);
      if (!boolResponse) { //change later?
        $(".err").show();
      } else {
        this.time_spent = end_time - this.start_time;
        this.log_responses();
        _stream.apply(this); //make sure this is at the *end*, after you log your data
        // exp.go(); //will jump the critter
      }
    },


    log_responses: function(){
    //this.critOpts = _.where(critFeatures, {creatureName: this.stim["creature"]})[0];    
    exp.catch_trials.push({
        "trial_type" : "learning_trial",
        "trial_num" : this.trial_num,
        "condition": exp.condition,
        "response" : $('input[type=radio]:checked').val(),
        "question" : this.stim["attentionCheck"],
        "time_in_seconds" : this.time_spent/1000,
        "critter" : this.stim["critter"],

        // need to make this more variable - this is only for birds
        "col1_crit" : this.critOpts.col1, //_.where(critFeatures, {creatureName: this.stim["critter"]}[0], //want it to say crest/tail,
        "col2_crit" : this.critOpts.col2,
        "col3_crit" : this.critOpts.col3,
        "col4_crit" : this.critOpts.col4,
        "col5_crit" : this.critOpts.col5,
        "prop1_crit" : this.critOpts.prop1,
        "prop2_crit" : this.critOpts.prop2,
        "tar1_crit" : this.critOpts.tar1,
        "tar2_crit" : this.critOpts.tar2,

        // fix the properties as they don't work
        // also need to fix progress bar
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



  slides.chatbox = slide({
    name: "chatbox",

    start: function() {
      $(".err").hide();
      //$(".display_condition").html("You are in " + exp.condition + ".");
    },

    button : function() {
      response = $("#chat_response").val();
      if (response == "") { //change later?
        $(".err").show();
      } else {
        exp.data_trials.push({
          "trial_type" : "chatbox",
          "condition" : exp.condition,
          "response" : response
        });
        exp.go(); //make sure this is at the *end*, after you log your data
        //exp.go(); will jump the critter
      }
    },

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
          "condition" : exp.condition,
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
  exp.trials = [];
  exp.catch_trials = [];
  //exp.all_stimuli = _.shuffle(all_stimuli); // all_stimuli
  exp.condition = _.sample(["label_book", "pepsin_detector"]); //can randomize between subject conditions here
  exp.system = {
      Browser : BrowserDetect.browser,
      OS : BrowserDetect.OS,
      screenH: screen.height,
      screenUH: exp.height,
      screenW: screen.width,
      screenUW: exp.width
    };
  //blocks of the experiment:
  exp.structure=["i0",
  // "waiting_room",
  "instructions","welcome_critterLand", "condition",  "learning_trial",
  "chatbox",
  'subj_info', 'thanks'];


  exp.data_trials = [];
  //make corresponding slides:
  exp.slides = make_slides(exp);

  exp.nQs = utils.get_exp_length() - 1; //this does not work if there are stacks of stims (but does work for an experiment with this structure)
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
    //$('slides.multi_slider').hide();
  });
  exp.go(); //show first slide

}
