//var socket = io('/function-nsp');

function make_slides(f) {
  var   slides = {};

  slides.i0 = slide({
     name : "i0",
     start: function() {
      exp.startT = Date.now();
//      socket.emit('connection')
     }
  });
  
  // slides.waiting_room = slide({
  //    name : "waiting_room",
  //    //change button show that it only shows up after both players have connected
  //    /**
  //    if(num_players == 1){
  //      $(".waiting").show();
  //      document.getElementById('after_waiting').style.visibility = 'hidden';
  //    } else {
  //      $(".waiting").hide();
  //      document.getElementById('after_waiting').style.visibility = 'visible';
  //    }
  
  //    */
  
  //    start : function() {
  //      //while(document.getElementById("after_waiting").onclick == false);
  //      for(var i=0; i<1000; i++){
  //        $(".waiting_message").html("Waiting for another player to join...").fadeOut(500);
  //        $(".waiting_message").html("Waiting for another player to join...").fadeIn(500);
  //      }
  //    },
  
  
  
  //    button : function() {
  //      exp.go(); //after both players have connected
  //    },
  //  });
  
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
      for (var i=0; i<shuffledCritters.length; i++) {
           $("#all_critters").append(
            "<svg id='critter" + i.toString() +
            "'></svg>");
            var scale = 0.5;
            Ecosystem.draw(
              shuffledCritters[i]["critter"], shuffledCritters[i],
              "critter"+i, scale)
      }
    },
    button : function() {
      exp.go(); // use exp.go() if and only if there is no "present" data.
    },
  });

  slides.condition = slide({
    name: "condition",
    start : function() {
      var cond_sentence = "To help you learn about the critters, you have been given a "
      exp.condition == "pepsin_detector" ?
        cond_sentence += "device that can detect a substance called pepsin." :
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
      this.question = _.where(question_phrase, {creature: stim.critter})[0];

      this.stim = stim; //I like to store this information in the slide so I can record it later.

      this.start_time = Date.now()

      var scale = 0.5;
      // debugger;
      Ecosystem.draw(
        stim.critter, stim,
        "critterSVG", scale)

      // would need to change if you want a different internal property
      stim.internal_prop ?
        internalString = "<strong>has pepsin</strong> in its bones" :
        internalString = "<strong>does not have pepsin</strong> in its bones"

      $(".prompt").html("This is a <strong>" + stim.creatureName + "</strong>. <br>" + "It " + internalString + ".");

      $(".attentionCheck").html("Does it have " + this.question[stim.attentionCheck] + "?")

      $('input[type=radio]').attr('checked', false);

      this.trial_num++;
    },
    button : function() {
      var end_time = Date.now();
      boolResponse = ($('input[type=radio]:checked').size() != 0);
      if (!boolResponse) {
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
          "condition": exp.condition,
          "response" : $('input[type=radio]:checked').val(),
          "question" : this.stim["attentionCheck"],
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

  slides.robertPage = slide({
    name: "robertPage",
  
    start: function() {
      console.log('start of robert page')
      $(".err").hide();
      // $('#exit_survey').hide();
      // $('#message_panel').show();
      // $('#main').show();
      // $('#submitbutton').show();
      // $('#roleLabel').show();
      // $('#textInfo').show();
      // $('#viewport').show();
      // $('#score').show();
      // $('#roundnumber').show();
      // $('#exit_survey').show();
      // $('#sketchpad').show(); // this is from sketchpad experiment (jefan 4/23/17)
      // $('#loading').show();
    },
  
    button : function() {
      response = $("#chat_response").val();
      if (response == "") {
        $(".err").show();
      } else {
        exp.data_trials.push({
          "trial_type" : "chatbox",
          "response" : response
        });

        // $('#message_panel').hide();
        // $('#main').hide();
        // $('#submitbutton').hide();
        // $('#roleLabel').hide();
        // $('#textInfo').hide();
        // $('#viewport').hide();
        // $('#score').hide();
        // $('#roundnumber').hide();
        // $('#exit_survey').hide();
        // $('#sketchpad').hide(); // this is from sketchpad experiment (jefan 4/23/17)
        // $('#loading').hide();
        // $('#exit_survey').show();

        exp.go(); //make sure this is at the *end*, after you log your data
        //exp.go(); will jump the critter
      }
    },
  
  });
  
  
  slides.chatbox = slide({
    name: "chatbox",
  
    start: function() {
      $(".err").hide();
      $('#exit_survey').hide();
      $('#message_panel').show();
      $('#main').show();
      $('#submitbutton').show();
      $('#roleLabel').show();
      $('#textInfo').show();
      $('#viewport').show();
      $('#score').show();
      $('#roundnumber').show();
      $('#exit_survey').show();
      $('#sketchpad').show(); // this is from sketchpad experiment (jefan 4/23/17)
      $('#loading').show();
    },
  
    button : function() {
      response = $("#chat_response").val();
      if (response == "") {
        $(".err").show();
      } else {
        exp.data_trials.push({
          "trial_type" : "chatbox",
          "response" : response
        });

        $('#message_panel').hide();
        $('#main').hide();
        $('#submitbutton').hide();
        $('#roleLabel').hide();
        $('#textInfo').hide();
        $('#viewport').hide();
        $('#score').hide();
        $('#roundnumber').hide();
        $('#exit_survey').hide();
        $('#sketchpad').hide(); // this is from sketchpad experiment (jefan 4/23/17)
        $('#loading').hide();
        // $('#exit_survey').show();

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
    },
    button : function() {
      exp.go();
    } //use exp.go() if and only if there is no "present" data.
    
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
  // $('#message_panel').hide();
  // $('#main').hide();
  // $('#submitbutton').hide();
  // $('#roleLabel').hide();
  // $('#textInfo').hide();
  // $('#viewport').hide();
  // $('#score').hide();
  // $('#roundnumber').hide();
  // $('#exit_survey').hide();
  // $('#sketchpad').hide(); // this is from sketchpad experiment (jefan 4/23/17)
  // $('#loading').hide();
  //  // this is from sketchpad experiment (jefan 4/23/17)
  //  $('#contButton').hide();


  exp.trials = [];
  exp.catch_trials = [];
  //exp.all_stimuli = _.shuffle(all_stimuli); // all_stimuli
  exp.condition = _.sample(["CONDITION 1", "condition 2"]); //can randomize between subject conditions here
  exp.system = {
      Browser : BrowserDetect.browser,
      OS : BrowserDetect.OS,
      screenH: screen.height,
      screenUH: exp.height,
      screenW: screen.width,
      screenUW: exp.width
    };
  //blocks of the experiment:
  exp.structure=["i0", "instructions", "robertPage", "welcome_critterLand", "learning_trial", 
  "condition", 'subj_info', 'thanks'] 
    // "chatbox", 'subj_info', 'thanks'];//,
  // "waiting_room", "instructions", "welcome_critterLand", "single_trial", "chatbox",];

  exp.data_trials = [];
  //make corresponding slides:
  exp.slides = make_slides(exp);

  exp.nQs = utils.get_exp_length(); //this does not work if there are stacks of stims (but does work for an experiment with this structure)
                    //relies on structure and slides being defined
  $('.slide').hide(); //hide everything
  // debugger;
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
