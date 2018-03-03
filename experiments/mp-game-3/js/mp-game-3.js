// --------------------------------------------------------------------
//  Multiplayer Game 3: Multiplayer Concept Learning
//  By Sahil Chopra
//  Goal: The purpose of this game is to set up  a multiplayer concept
//        learning paradigm. Player A learns about "wudsy" creatures
//        over approximately 50 trials. Then Player A and Player B
//        enter a chatroom together and forced to communicate for at
//        least 30 seconds, in which Player A teaches Player B
//        about "wudsy" creatures. Then, they both take a "post test"
//        where A and B are asked to identify creatures as "wudsy"
//        or not on a test set of ~30 previously unseen critters.
// Note: For greater details as to stimuli generation, please check out
//       welcome_critter.js. 
// --------------------------------------------------------------------

// -----------------
// GLOBAL VARIABLES
// ----------------
var roleDictionary = {
  a: "Player A",
  b: "Player B"
}

// Initialize the game and it's slides
function init() {
  // Store information about Turker's browser setup
  exp.system = {
    Browser : BrowserDetect.browser,
    OS : BrowserDetect.OS,
    screenH: screen.height,
    screenUH: exp.height,
    screenW: screen.width,
    screenUW: exp.width
  };

  // Initialize experiment variables
  exp.block = 0;
  exp.training_data_trials = [];
  exp.testing_data_trials = [];  
  exp.num_learning_trials = 0;
  exp.num_testing_trials = 0;
  exp.structure = [
    "wait_room",
    "learning_instructions",
    "learning_critters",
    "chat_instructions",
    "chatRoom",
    "testing_instructions",
    "testing_critters",
    "wait_room",
    "score_report",
    "subj_info",
    'thanks',
  ];
  exp.slides = make_slides(exp);

  // Ensure that Turker has accepted the hit, or that the use is not on MTurk
  $("#start_button").click(function() {
    if (turk.previewMode) {
      $("#mustaccept").show();
    } else {
      $("#start_button").click(function() {$("#mustaccept").show();});
      exp.go();
    }
  });
  exp.go();
}

// --------------------------
// Slide Creation & Rendering
// --------------------------
// Render a table of previous critters from the learning trials
// where "wudsy" creatures have black boxes around them to indicate
// that they belong to the class.
function render_prev_critters(prev_critters, table_width) {
  $("#prev_critters").append(`<H4>Previous Examples: </H4>`);
  var rows = Math.ceil(prev_critters.length / table_width);
  var cols = table_width;

  var table = "<table>";
  var ind = 0;
  for(var i=0; i <rows; i++) {
    table += "<tr>";
    for(var j=0; j<cols; j++) {
      table += "<td>";
      if (ind >= prev_critters.length) break;
      table += "<table class ='cell' id='cell" + ind + "'\">";

      table += "<td>";
      table += "<svg id='critter_" + ind +
        "' style='max-width:150px;max-height:150px\'></svg></td>";

      table += "<tr>";
      table += "<div class='critname' id='cell" + ind + "critname'></div></tr>";
      table += "</table>";
      table += "</td>";
      ind += 1;
    }
    table += "</tr>"
  }
  table += "</table>";
  $("#prev_critters").append(table);

  for (var i = 0 ; i < prev_critters.length; i++) {
    var scale = 0.5;
    var stim = prev_critters[i];
    var id = "critter_" + i;
    Ecosystem.draw(
      stim.critter, stim.props,
      id, scale
    );
    if (stim.belongs_to_concept) {
      mark(id);
    }
  }
}

// Mark a given stimulus with a black border box
function mark(id) {
  $('#' + id).parent().css({"border":'2px solid black'});
}

// Sleep for given number of milliseconds
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Render the current critter
function render_curr_critter(stim, training) {
  var critter_id = "training_critter";
  var rows = 1;
  var cols = 1;
  var table = "<table>";
  table += "<tr>";
  table += "<td>";
  table += "<table class ='cell' id='cell'\">";
  table += "<td>";  
  if (training) {
    table += "<svg id='training_critter' style='max-width:150px;max-height:150px\'></svg>";
  } else {
    table += "<svg id='testing_critter' style='max-width:150px;max-height:150px\'></svg>"; 
    critter_id = "testing_critter";
  }
  table += "<br><br><form id='critter_form' class='critter_label_form'>";
  table += "<input type='radio' name='belongs_to_concept' id='t' value=true> <label for='t'>Yes</label>";
  table += "<input type='radio' name='belongs_to_concept' id='f' value=false> <label for='f'>No</label>";   
  table += "</form></td>";
  table += "<tr>";
  table += "<div class='critname' id='cellcritname'></div></tr>";
  table += "</table>";
  table += "</td>";
  table += "</tr>"
  table += "</table>";
  if (training) {
    $("#curr_critter_training").append(table);
  } else {
    $("#curr_critter_testing").append(table);
  }
  Ecosystem.draw(
    stim.critter, stim.props,
    critter_id, 0.5
  );
}

// Make slides for the experiment
function make_slides(f) {
  var slides = {};

  // Waiting room slide -- displayed, when a player is waiting for another
  // to joing the game or to finish their training or test batch.
  slides.wait_room = slide({
    name: "wait_room",
    start: function() {
      // Display appropriate wait room text
      $("#waitText").empty();
      $(".err").hide();
      if(exp.block == 0) $("#waitText").append("Waiting for another player to connect...")
      else $("#waitText").append("Waiting for your partner to catch up...")
      $("#waitCont").hide();

      // Pretty Animation (Fade In / Out)
      var blinking_wait = setInterval(function() {
        $("#waitText").fadeOut(1000);
        $("#waitText").fadeIn(1000);
        if($("#welcome").is(':visible')){ //if it goes to next slide
          clearInterval(blinking_wait);
        }
      }, 2000);

      // Notify the server:
      // 1) Player has entered the wait room slide for book keeping.
      // 2) Player has entered the wait room and an action should be emitted,
      //    once another player is found / the other player's action is completed.
      globalGame.socket.send("enterSlide.wait_room.");
      globalGame.socket.send("enterWaitRoom.");
    }
  });

  // Learning instructions slide -- information as how the learning trials
  // shall proceed for Player A.
  slides.learning_instructions = slide({
    name : "learning_instructions",
    start : function() {
      // Notify the server:
      // 1) Player has entered the learning instructions slide for book keeping.
      // 2) Player needs the learning critters.
      globalGame.socket.send("enterSlide.learning_instructions.");
    },
    button : function() {
      exp.go()
    }
  });

  // Learning critter slide -- training trials
  slides.learning_critters = slide({
    name : "learning_critters",
    present: exp.training_critters,
    start: function() {
      globalGame.socket.send("enterSlide.learning_critters.");
      this.prev_critters = [];
      this.learning_trial_idx = 0;
    },
    present_handle : function(stim) {
      // hide + disable stuff
      $("#prev_critters").empty();
      $("#curr_critter_training").empty();
      $('#continueButton').prop('disabled', false);

      // Render slide
      $(".trial_number").text("Critter " + String(this.learning_trial_idx + 1) + " of " + String(exp.num_learning_trials));
      render_prev_critters(this.prev_critters, 6);
      render_curr_critter(stim, true);
      this.stim = stim;

      // Time Markers
      this.start_time = Date.now()
      this.learning_trial_idx++;
      this.prev_critters.push(stim);
    },    
    button : function() {
      var all_forms_filled = true;
      $(".critter_label_form").each(function () {
          if ($("input[type=radio]:checked", this).length == 0) {
            all_forms_filled = false;
          }
      });
      if (all_forms_filled) {
        var end_time = Date.now();
        this.time_spent = end_time - this.start_time;
        this.log_responses();

        var stim = this.stim;
        var correct_answer = true;
          var turker_label = $("input[type=radio]:checked").val() === "true";
          if (turker_label != stim['belongs_to_concept']) correct_answer = false;

        if (!correct_answer) {
          $('#continueButton').prop('disabled', true);
          alert("Incorrect Label Applied to Creature ... You Will Have to Wait 5 Seconds Before the Next Round");
          sleep(5000).then(() => _stream.apply(this));
        } else {
          _stream.apply(this); //make sure this is at the *end*, after you log your data
        }
      } else {
        alert("Please make sure to label all the critters, before proceeding");
      }
      if (this.learning_trial_idx - 1 == exp.num_learning_trials) {
        globalGame.socket.send("logTrain.learnCritters." + _.pairs(encodeData(exp.training_data_trials)).join('.'));
        exp.go()
      }
    },
    log_responses : function(){
      var stim = this.stim;
      var labels = [];
      var true_labels = [];
      labels.push($('input[name=belongs_to_concept]:checked', this).val() === "true");
      true_labels.push(stim['belongs_to_concept']);
      exp.training_data_trials.push({
          "player": globalGame.my_role,
          "training": true,
          "trial_num" : this.trial_num,
          "time_in_seconds" : this.time_spent/1000,
          "labels": labels,
          "true_labels": true_labels,
        });
      },
    });

  // Chat instructions slide
  slides.chat_instructions = slide({
    name : "chat_instructions",
    start : function() {
      $('#chat_instructs').html("On the next page, you will enter into a chatroom with your partner. " +
      " After 30 seconds, a continue button will appear for Player B, which, when clicked, will advance the game for both players. " +
      "You are " +  roleDictionary[globalGame.my_role] + ".")
    },
    button : function() {
      exp.go()
    }
  });

  // Connected players can discuss what they have learned in 'welcome_critter' here using a chatbox
  slides.chatRoom = slide({
    name: "chatRoom",
    start: function() {
      $("#cur_instructs").empty();
      $("#chatCont").hide();
      $('#messages').empty();
      console.log('start of chatRoom')
      globalGame.socket.send("enterSlide.chatRoom.");
      globalGame.socket.send("enterChatRoom.");
      $(".err").hide();
      $('#waiting').show();
    }
  });

  // Test instructions slide
  slides.testing_instructions = slide({
    name : "testing_instructions",
    start : function() {
      globalGame.socket.send("enterSlide.testing_critters.");
    },
    button : function() {
      exp.go()
    }
  });

  // Generates critters that the partner learned about and tests the user
  slides.testing_critters = slide({
  name : "testing_critters",
  present: exp.testing_critters,
  start: function() {
    this.testing_trial_idx = 0;
  },
  present_handle : function(stim) {
    // hide + disable stuff
    $("#curr_critter_testing").empty();
    $('#continueButton').prop('disabled', false);

    // Render slide
    $(".trial_number").text("Critter " + String(this.testing_trial_idx + 1) + " of " + String(exp.num_testing_trials));
    render_curr_critter(stim, false);
    this.stim = stim;

    // Time Markers
    this.start_time = Date.now()
    this.testing_trial_idx++;
  },
  button : function() {
    var all_forms_filled = true;
    if ($("input[type=radio]:checked").length == 0) {
      all_forms_filled = false;
    }
    if (all_forms_filled) {
      var end_time = Date.now();
      this.time_spent = end_time - this.start_time;
      this.log_responses();

      var stim = this.stim;
      var correct_answer = true;
      var turker_label = $("input[type=radio]:checked").val() === "true";
      if (turker_label != stim['belongs_to_concept']) correct_answer = false;
      _stream.apply(this); //make sure this is at the *end*, after you log your data
    } else {
      alert("Please make sure to label all the critters, before proceeding");
    }
    if (this.testing_trial_idx - 1 == exp.num_testing_trials) {
      globalGame.socket.send("logTest.testCritters." + _.pairs(encodeData(dataToSend)).join('.'));;
      exp.go()
    }
  },
  log_responses : function(){
    var stim = this.stim;
    var labels = [];
    var true_labels = [];
    labels.push($('input[name=belongs_to_concept]:checked', this).val() === "true");
    true_labels.push(stim['belongs_to_concept']);
    exp.testing_data_trials.push({
        "player": globalGame.my_role,
        "training": false,
        "trial_num" : this.trial_num,
        "time_in_seconds" : this.time_spent/1000,
        "labels": labels,
        "true_labels": true_labels,
      });
    },
  });

  slides.score_report = slide({
    name: "score_report",
    // start: function() {

    // },
    button : function() {
      exp.go()
    }
  });

  // Collects demographic information from users
  slides.subj_info =  slide({
    name : "subj_info",
    start: function(){
      $('#humanResult').hide();
      globalGame.socket.send("calculatingReward.")
      //console.log("reward: " + globalGame.calculate_end_game_bonus());

    },
    submit : function(e){
        //if (e.preventDefault) e.preventDefault(); // I don't know what this means.
        globalGame.socket.send("enterSlide.subj_info.");
        exp.subj_data = {
          nativeEnglish : $("#nativeEnglish").val(),
          enjoyment : $("#enjoyment").val(),
          assess : $('#assess').val(),
          age : $("#age").val(),
          gender : $("#gender").val(),
          education : $("#education").val(),
          comments : $("#comments").val(),
          problems: $("#problems").val(),
          fairprice: $("#fairprice").val(),
          strategy: $("#strategy").val(),
          humanPartner: $("#human").val(),
          likePartner: $("#likePartner").val()
        };

        globalGame.socket.send("logSubjInfo.subjInfo." + _.pairs(encodeData(exp.subj_data)).join('.'));

        exp.go();
      } //use exp.go() if and only if there is no "present" data.
    });

  // Generic thanks page that collects some data
  slides.thanks = slide({
    name : "thanks",
    start : function() {
      globalGame.socket.send("enterSlide.thanks.");

      exp.data= {
        "trials" : exp.data_trials,
        "system" : exp.system,
        "subject_information" : exp.subj_data,
        "time_in_minutes" : (Date.now() - exp.startT)/60000
      };
      setTimeout(function(){
        if(_.size(globalGame.urlParams) == 4) {
          window.opener.turk.submit(exp.data, true);
          window.close();
        } else {
          console.log("would have submitted the following :")
          console.log(exp.data);
        } }, 1000)
    }
  });

  return slides;
}