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
  explorer: "Explorer",
  student: "Student"
};

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
  exp.training_summary_stats = {
    type: "training",
    hits: 0,
    misses: 0,
    correct_rejections: 0,
    false_alarms: 0,
    score: 0,
  };
  exp.testing_summary_stats = {
    type: "testing",
    hits: 0,
    misses: 0,
    correct_rejections: 0,
    false_alarms: 0,
    score: 0,
  };
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
    "thanks",
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

  // Learning instructions slide -- information as how the learning trials
  // shall proceed for Player A.
  slides.learning_instructions = slide({
    name : "learning_instructions",
    start : function() {
      // Notify the server:
      // 1) Player has entered the learning instructions slide for book keeping.
      // 2) Player needs the learning critters.
      globalGame.socket.send("enterSlide.learning_instructions.");

      var playerAInstructions = `
      <br><br>
      <h3>Instructions</h3>
      <br>
      <p>
        You are on a new planet called Crittun, studying creatures with a wudsy detector.
        The wudsy detector will tell you whether or not a creature is wudsy.
        <br> <br>
        On each trial, you will make a guess as to whether or not a new creature is wudsy, and then use the detector to find out if you were right.
        If you guess incorrectly, you will have to wait 5 seconds before using the detector again. 
        We will keep a log of all the creatures you see and put a box around the ones that were wudsy for your reference.<br> 
        <br>
        Press Continue to start the game.
        <br><br>
      </p>
      <button class="continuebutton" onclick="_s.button()">Continue</button>`;

      var playerBInstructions = `
        <br><br>
        <h3>Instructions</h3>
        <br>
        <p>
          Your partner is currently exploring a new planet caleld Crittun, studying wudsy creatures. 
          <br> <br>
          It will take them approximately 1 - 15 minutes to finish exploring. After which, they will join you in a chatroom and you both will discuss what they learned about wudsy creatures.
          <br> <br>
          During your partner's 1 - 15 exploration period, you are free to do as you desire. Just stay at the computer and DO NOT CLOSE THIS TAB. Otherwise, you will be disconnected from the game and we won't be able to reward you for the hit.
          Please keep checking the chat window, as the status will update when the other player has also entered the room.
          <br> <br> 
          Press Continue to join the chatroom.
          <br> <br> 
        </p>
        <button class="continuebutton" onclick="_s.button()">Continue</button>`;      

      if (globalGame.my_role == "explorer") {
        $("#learning_instructions").html(playerAInstructions);
      } else {
        $("#learning_instructions").html(playerBInstructions);
      }

    },
    button : function() {
      if (globalGame.my_role == "explorer") {
        exp.goToSlide("learning_critters");
      } else {
        exp.goToSlide("chatRoom")
      }
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
      $("input[type=radio]").attr('checked', false);

      // Render slide
      $(".trial_number").text("Critter " + String(this.learning_trial_idx + 1) + " of " + String(exp.num_learning_trials));
      render_prev_critters(this.prev_critters, 6);
      render_curr_critter(stim, true);
      this.stim = stim;

      // Time Markers
      this.start_time = Date.now()
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

        var cur_index = this.learning_trial_idx;
        this.learning_trial_idx++;
        var stim = this.stim;
        var turker_label = ($("input[type=radio]:checked").val() === "true");
        var true_label = stim["belongs_to_concept"];
        var is_correct = (turker_label === true_label);

        if (turker_label === false && true_label === false) {
          exp.training_summary_stats.correct_rejections += 1;
        } else if (turker_label === false && true_label === true){
          exp.training_summary_stats.misses += 1;
        } else if (turker_label === true && true_label === false) {
          exp.training_summary_stats.false_alarms += 1;
        } else {
          exp.training_summary_stats.hits += 1;
        }

        $('#continueButton').prop('disabled', true); // Prevent Double Clicking
        if (!is_correct) {
          alert("Incorrect Label Applied to Creature ... You Will Have to Wait 5 Seconds Before the Next Round");
          sleep(5000).then(() => {
            this.log_responses(cur_index, this.time_spent/1000, turker_label, true_label, is_correct);
            _stream.apply(this); //make sure this is at the *end*, after you log your data
            globalGame.socket.send("logTrain.learnCritters." + _.pairs(encodeData(exp.training_data_trials[cur_index])).join('.'));
          });
        } else {
          this.log_responses(cur_index, this.time_spent/1000, turker_label, true_label, is_correct);
          _stream.apply(this); //make sure this is at the *end*, after you log your data
          globalGame.socket.send("logTrain.learnCritters." + _.pairs(encodeData(exp.training_data_trials[cur_index])).join('.'));
        }

        if (this.learning_trial_idx == exp.num_learning_trials) {
          exp.training_summary_stats.score = exp.training_summary_stats['hits'] - exp.training_summary_stats['false_alarms']
          globalGame.socket.send("logScores.learnCritters." + _.pairs(encodeData(exp.training_summary_stats)).join('.'));
          exp.go();
        }

      } else {
        alert("Please make sure to label all the critters, before proceeding");
      }

    },
    log_responses : function(trial_num, time_in_seconds, turker_label, true_label, is_correct){
      var record = {
        "trial_num" : trial_num,
        "time_in_seconds" : time_in_seconds,
        "turker_label": turker_label,
        "true_label": true_label,
        "is_correct": is_correct,
      };
      exp.training_data_trials.push(record);
      console.log(record);
      },
    });

  // Chat instructions slide
  slides.chat_instructions = slide({
    name : "chat_instructions",
    start : function() {
      $('#chat_instructs').html("On the next page, you will enter into a chatroom with your partner. " +
      " After 30 seconds, a continue button will appear for the student, which, when clicked, will advance the game for both players. " +
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
      $('#status').show();
    }
  });

  // Test instructions slide
  slides.testing_instructions = slide({
    name : "testing_instructions",
    start : function() {
      // Remove flash from chat room
      var cancelFlashTitle = function (timeout) {
        clearTimeout(timeout);
        document.title = original;
        timeoutIndex = -1;
      };
      if (timeoutIndex != -1) {
        cancelFlashTitle(timeoutIndex);
      }

      globalGame.socket.send("enterSlide.testing_critters.");
      if (globalGame.my_role == "explorer") {
        var playerAInstructions = `<br><br>
        <h3>Instructions</h3>
        <br>
        <p>
        On each trial, you will determine whether a creature is wudsy, without the help of the detector. You will be awarded a bonus according to how well you and your partner perform on this task.
        <br> <br>
        Press Continue to start the game.</p>
        <br> <br>
        <button class="continuebutton" onclick="_s.button()">Continue</button>`;
        $("#testing_instructions").html(playerAInstructions);
      } else {
        var playerBInstructions = `<br><br>
        <h3>Instructions</h3>
        <br>
        In the chatroom, you and your partner should have talked about wudsy creatures.
        On each trial, you will determine whether a creature is wudsy. You will be awarded a bonus according to how well you and your partner perform on this task.
        <br> <br>
        Press Continue to start the game. </p>
        <br> <br>
        <button class="continuebutton" onclick="_s.button()">Continue</button>`;
        $("#testing_instructions").html(playerBInstructions);
      }
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
    $("input[type=radio]").attr('checked', false);

    // Render slide
    $(".trial_number").text("Critter " + String(this.testing_trial_idx + 1) + " of " + String(exp.num_testing_trials));
    render_curr_critter(stim, false);
    this.stim = stim;

    // Time Markers
    this.start_time = Date.now()
  },
  button : function() {
    $('#continueButton').prop('disabled', true); // Prevent Double CLicking
    var all_forms_filled = true;
    if ($("input[type=radio]:checked").length == 0) {
      all_forms_filled = false;
    }
    if (all_forms_filled) {
      var end_time = Date.now();
      this.time_spent = end_time - this.start_time;

      var cur_index = this.testing_trial_idx;
      this.testing_trial_idx++;
      var stim = this.stim;
      var turker_label = ($("input[type=radio]:checked").val() === "true");
      var true_label = stim['belongs_to_concept'];
      var is_correct = (turker_label === true_label);


      if (turker_label === false && true_label === false) {
        exp.testing_summary_stats.correct_rejections += 1;
      } else if (turker_label=== false && true_label === true){
        exp.testing_summary_stats.misses += 1;
      } else if (turker_label === true && true_label === false) {
        exp.testing_summary_stats.false_alarms += 1;
      } else {
        exp.testing_summary_stats.hits += 1;
      }

      this.log_responses(cur_index, this.time_spent/1000, turker_label, true_label, is_correct);
      _stream.apply(this); //make sure this is at the *end*, after you log your data
      globalGame.socket.send("logTest.testCritters." + _.pairs(encodeData(exp.testing_data_trials[cur_index])).join('.'));
    } else {
      alert("Please make sure to label all the critters, before proceeding");
    }
    
    if (this.testing_trial_idx == exp.num_testing_trials) {
      exp.testing_summary_stats.score = exp.testing_summary_stats['hits'] - exp.testing_summary_stats['false_alarms']
      globalGame.socket.send("logScores.testCritters." + _.pairs(encodeData(exp.testing_summary_stats)).join('.'));
      exp.go();
    }
  },
  log_responses : function(trial_num, time_in_seconds, turker_label, true_label, is_correct){
    exp.testing_data_trials.push({
      "trial_num" : trial_num,
      "time_in_seconds" : time_in_seconds,
      "turker_label": turker_label,
      "true_label": true_label,
      "is_correct": is_correct,
    });
    },
  });

  // Waiting room slide -- displayed, when a player is waiting for another
  // to joing the game or to finish their training or test batch.
  slides.wait_room = slide({
    name: "wait_room",
    start: function() {
      // Display appropriate wait room text
      $("#waitText").empty();
      $(".err").hide();
      if (exp.slideIndex == 0){
        $("#waitText").append("Waiting for another player to join the game ...");
      } else {
        $("#waitText").append("Waiting for your partner to catch up...");
      }

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
      //    once the other player has caught up.
      globalGame.socket.send("enterSlide.wait_room.");
      globalGame.socket.send("enterWaitRoom.");
    }
  });

  slides.score_report = slide({
    name: "score_report",
    start: function() {
      globalGame.socket.send("sendingTestScores." + _.pairs(encodeData(exp.testing_summary_stats)).join('.'));
    },
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
    },
    submit : function(e){
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
        "game_id": globalGame.data.id,
        "role": globalGame.my_role,
        "training_data_fn": globalGame.training_data_fn,
        "test_data_fn": globalGame.test_data_fn,
        "rule_idx": globalGame.rule_idx,
        "rule_type": globalGame.rule_type,
        "training_trials": exp.training_data_trials,
        "testing_trials": exp.testing_data_trials,
        "system" : exp.system,
        "subject_information" : exp.subj_data,
        "time_in_minutes" : (Date.now() - exp.startT)/60000,
        "training_summary_stats": exp.training_summary_stats,
        "testing_summary_stats": exp.testing_summary_stats,
      };
      setTimeout(function(){
        if(_.size(globalGame.urlParams) == 4) {
          window.opener.turk.submit(exp.data, true);
          window.close();
        } else {
          console.log("would have submitted the following :")
          console.log(exp.data);
        } }, 1000);
    }
  });
  return slides;
}