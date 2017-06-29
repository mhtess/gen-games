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

  /**
  slides.critter_page = slide({
    name: "critter_page",
    start: function() {

      $(".err").hide();

      for (var i=0; i<20; i++) {
           $("#imgs").append(
            "<svg id='svg" + i.toString() +
            "'></svg>");

            var scale = 0.5;
            // increasing height decreasing fat - see prop1/2
            Ecosystem.draw(
              "bird", {"col1":"#ff0000",
                 "col2":"#00ff00",
                 "col3":"#0000ff",
                 "tar1":false,
                 "tar2":true,
                 "prop1":i*(1/20),
                 "prop2":(20-i)*(1/20)},
              "svg"+i, scale)
      }  
    },

    button : function() {
      response = $("#critter_response").val();
      if (response.length == 0) {
        $(".err").show();
      } else {
        exp.data_trials.push({
          "trial_type" : "critter_page",
          "response" : response
        });
        
        exp.go(); //make sure this is at the *end*, after you log your data
      }
    },
  });
  */

  slides.single_trial = slide({
    name: "single_trial",

    /* trial information for this block
     (the variable 'stim' will change between each of these values,
      and for each of these, present_handle will be run.) */
    
    present : [ //change later to present 18
      {subject: "Wug", object: "ball"},
      {subject: "Blick", object: "windowsill"},
      {subject: "Rambo", object: "shiny object"},
      //***double check if this is right
      /**
      for(i=0; i<1; i++){
        {subject: "some animal** change later to pick one of the 3", object: "some object"},
      }
      */
      
    ],
    /**
    present_handle : function(stim) {
      $(".err").hide();

      this.stim = stim; //I like to store this information in the slide so I can record it later.


      $(".prompt").html(stim.subject + "s like " + stim.object + "s.");
      this.init_sliders();
      exp.sliderPost = null; //erase current slider value
    }
    */
    
    start: function() {
      $(".err").hide();
      //$(".display_condition").html("You are in " + exp.condition + ".");
    },
    

    button : function() {
      boolResponse = ($('input[type=radio]:checked').size() != 0);
      response = $("#trial_response").val();
      if (!boolResponse) { //change later?
        $(".err").show();
      } else {
        exp.data_trials.push({
          "trial_type" : "single_trial",
          "response" : response
        });
        exp.go(); //make sure this is at the *end*, after you log your data
        //exp.go(); will jump the critter
      }
    },

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
  exp.structure=["i0", "instructions", "welcome_critterLand", "single_trial", "chatbox", 'subj_info', 'thanks'];

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
