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
                    'background-color': 'white'}) &
    $('#'+el.id+'critname').css({'opacity': '0.5', 'font-weight': 'normal'})
    otherEls.map(function(cell){$('#'+cell).css({"border":'',
      'background-color': 'white'})})

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

  if(check_all == num) {
     $("#learning_button").show();
     console.log("good to go!");
  }

}

var ind = 0;
function create_table(rows, cols) { //rows * cols = number of exemplars
  var table = "<table id='creature_table'>";
  for(var i=0; i <rows; i++) {
    table += "<tr>";
    for(var j=0; j<cols; j++) {
      table += "<td>";
      ind = i * cols + j;
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
        "' style='max-width: 128px;max-height:128px\'></svg></td>";

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

    crittersFromServer : "",

    start : function(stim) {
      var start_time = Date.now()
      this.stim = stim;
      $(".critname").hide();
      $(".err").hide();
      $("#learning_button").hide(); //fix this
      allCreatures = this.crittersFromServer;//genCreatures();
      var shuffledCritters = _.shuffle(allCreatures)

      this.num_creats = allCreatures.length;

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
      allCreatures = [];

      for (var i = 0; i < this.num_creats; i++) {
        $('#critter' + i).empty();
        $('#cell' + i).css({'opacity': '1'});
        $('#cell' + i).css({'border': ''});
        $('#creature_table').remove();
        prev = null;
        //$('#cell'+i+'critname').css({'opacity': '1'});
      }

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
      globalGame.socket.send("enterChatRoom.");
      $(".err").hide();
      $("#chatCont").hide();
      // change this to 60 seconds (10 -> 60)
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
    }

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
      $('input[type=radio]').attr('checked', false); //for radio button response

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
      // if ($('input[type=radio]:checked').size() == 0) {
      //   $(".err").show();
      // } else {
        this.time_spent = end_time - this.start_time;
        this.log_responses();
        _stream.apply(this); //make sure this is at the *end*, after you log your data
      //}
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
  allCreatures = genCreatures();
  exp.test_critters = _.uniq(allCreatures, function(stim){
    return _.values(_.pick(stim,
      //"col1", "col2","col3", "creatureName", "tar1","tar2"
      "color", "col1", "col2","col3", "creatureName", "tar1","tar2" //maybe change back later
    )).join('')
  })
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

  // learning - chat - test rounds
    var numRounds = function(num) {
      array1 = ["welcome_critterLand", "robertPage", "test_trial"]
      while (num != 0) {
        array1.push.apply(array1, array1);
        num --;
      }
      return array1
    }


  //blocks of the experiment:

  exp.structure=[
    "i0",
    "welcome_critterLand",
    "robertPage",
    "welcome_critterLand",
    "robertPage",
    "test_trial",
    "instructions",
    // "condition",
    "robertPage",
    // need a waiting room here
     'subj_info',
    'thanks'
  ]

  // var start_exp = ["i0", "instructions"]
  // // change this as you please
  // var middle_exp = numRounds(2)
  // var end_exp = ['subj_info','thanks']
  // start_exp.push.apply(start_exp, middle_exp)
  // //  exp.structure.push.apply(middle_exp)
  // start_exp.push.apply(start_exp, end_exp)
  // exp.structure = start_exp

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
