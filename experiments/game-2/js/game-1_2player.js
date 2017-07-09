function make_slides(f) {
  var   slides = {};

  slides.i0 = slide({
     name : "i0",
     start: function() {
      exp.startT = Date.now();
     }
  });

  slides.lobby = slide({
    name: "lobby",
    start: function(){
      socket.emit('request data', param('workerId'))
      socket.on('assignment', function(assignment_packet){
        exp.condition = assignment_packet.condition
        exp.gen = assignment_packet.gen
        exp.chain = assignment_packet.chain
        if(assignment_packet.data.length == 0 || exp.condition == 'language'){
          //if we're the firs gen, we won't receive anything so we generate new things
          //additionally, if we're in language condition, we sample randomly from the true fn
          exp.training_stims = _.range(0, exp.nTrainingTrials).map(
            function(x){ return makeDataPoint(functionsToLearn[exp.targetFn]) }
          )
          if(exp.condition == 'language' && exp.gen != 1){
            // exp.structure[2] = 'language_instructions' //use the language instructions slide instead of the regular instructions slide
            exp.posteriorMessage = assignment_packet.data
          }
        }else{
          //otherwise, we're in the data_incidental condition and use the given data
          exp.training_stims = assignment_packet.data
        }
        slides.fn_learning_train.present = exp.training_stims
        // console.log('condition', exp.condition)
        // console.log('generation', exp.gen)
        // console.log('chain', exp.chain)
        exp.go()
      })
    }
  })

  slides.waiting_room = slide({
     name : "waiting_room",
     //change button show that it only shows up after both players have connected
     /**
     if(num_players == 1){
       $(".waiting").show();
       document.getElementById('after_waiting').style.visibility = 'hidden';
     } else {
       $(".waiting").hide();
       document.getElementById('after_waiting').style.visibility = 'visible';
     }
 
     */
     
     start : function() {
       //while(document.getElementById("after_waiting").onclick == false);
       for(var i=0; i<1000; i++){
         $(".waiting_message").html("Waiting for another player to join...").fadeOut(500);
         $(".waiting_message").html("Waiting for another player to join...").fadeIn(500);
       }
     },
 
 
 
     button : function() {
       exp.go(); //after both players have connected
     },
   });

  slides.instructions = slide({
    name : "instructions",
    button : function() {
      exp.go(); //use exp.go() if and only if there is no "present" data.
    },
  });

  // slides.chat = slide({
  //   name: "chat"
    

  // })

  slides.welcome_critterLand = slide({
    name : "welcome_critterLand",
    start : function() {
      var shuffledCritters = _.shuffle(allCreatures)
      for (var i=0; i<18; i++) {
           $("#all_critters").append(
            "<svg id='critter" + i.toString() +
            "'></svg>");
            var scale = 0.5;
            Ecosystem.draw(
              "bird", shuffledCritters[i],
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

    present : _.shuffle(allCreatures),

    present_handle : function(stim) {
      $("#birdSVG").empty();
      $(".err").hide();

      this.stim = stim; //I like to store this information in the slide so I can record it later.

      var scale = 0.5;
      Ecosystem.draw(
        "bird", stim,
        "birdSVG", scale)

      stim.pepsin ?
        pepsinString = "<strong>has pepsin</strong> in its bones" :
        pepsinString = "<strong>does not have pepsin</strong> in its bones"

      $(".prompt").html("This is a " + stim.creatureName + ". <br>" + "It " + pepsinString + ".");

      $(".attentionCheck").html("Does it have a " +stim.attentionCheck + "?")

      $('input[type=radio]').attr('checked', false);
    },




    button : function() {
      boolResponse = ($('input[type=radio]:checked').size() != 0);
      if (!boolResponse) { //change later?
        $(".err").show();
      } else {
        this.log_responses();
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
  exp.structure=["i0", "chat", "waiting_room", "instructions", "chatbox","welcome_critterLand", "lobby", "single_trial", 'subj_info', 'thanks'];

  exp.data_trials = [];
  //make corresponding slides:
  exp.slides = make_slides(exp);

  // exp.nQs = utils.get_exp_length(); //this does not work if there are stacks of stims (but does work for an experiment with this structure)
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
