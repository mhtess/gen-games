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
      for (var i=0; i<18; i++) {
           $("#all_critters").append(
            "<svg id='critter" + i.toString() +
            "'></svg>");
            var scale = 0.5;
            Ecosystem.draw(
              "bird", {},
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


  slides.single_trial = slide({
    name: "single_trial",

    /* trial information for this block
     (the variable 'stim' will change between each of these values,
      and for each of these, present_handle will be run.) */
    
    present : _.shuffle([
      {subject: 'wug1', object: "question"},
      {subject: 'wug2', object: "question"},
      {subject: 'wug3', object: "question"}
      // ...
    ]),


    
    
    present_handle : function(stim) {
      $(".err").hide();

      this.stim = stim; //I like to store this information in the slide so I can record it later.

      $("#bird").append(
        "<svg id='" + stim.subject + "'></svg>");
        
      $(".prompt").html("This is a " + (stim.subject).substring(0, stim.subject.length - 1) + ". " + stim.object); // + "s like " + stim.object + "s.");
    
      
      $('input[type=radio]').attr('checked', false);
    },
    
   

    
    button : function() {
      boolResponse = ($('input[type=radio]:checked').size() != 0);
      if (!boolResponse) { //change later?
        $(".err").show();
      } else {
        this.log_responses();
        $("#" + this.stim.subject).hide();
        _stream.apply(this); //make sure this is at the *end*, after you log your data
        // exp.go(); //will jump the critter
      }
    },


    log_responses: function(){

      exp.data_trials.push({
          "trial_type" : "single_trial",
          "response" : $("#trial_response").val()
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
  exp.structure=["single_trial", "i0", "instructions", "welcome_critterLand", "chatbox", 'subj_info', 'thanks'];

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
    //$('slides.multi_slider').hide();
  });
  exp.go(); //show first slide

}
