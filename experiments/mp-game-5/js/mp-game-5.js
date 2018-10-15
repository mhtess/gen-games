// --------------------------------------------------------------------
//  Multiplayer Game 5: Multiplayer Concept Learning
//  By Sahil Chopra
//  Goal: The purpose of this game is to set up  a multiplayer concept
//        learning paradigm. Player A learns about "wudsy" creatures
//        over approximately 50 trials presented in a single summary
//        grid format. Then Player A and Player B
//        enter a chatroom together and forced to communicate,
//        in which Player A teaches Player B
//        about "wudsy" creatures. Then, they both take a "post test"
//        where A and B are asked to identify creatures as "wudsy"
//        or not on a test set of ~30 previously unseen critters.
//        This entire process then repeats itself for n "species" concepts.
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
  exp.training_records = [];
  exp.testing_records = [];
  exp.testing_summary_stats = [];
  exp.structure = [
    "wait_room",
    "training_instructions",
    "training_critters",
    "chat_instructions",
    "chatRoom",
    "testing_instructions",
    "testing_critters",
    "score_report",
    "wait_room",
    "score_report",
    "subj_info",
    "thanks",
  ];
  exp.slides = make_slides(exp);
  exp.selected_stim_idx = -1;
  exp.selected_training_stim = [];
  exp.selected_test_stim = [];


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

function generate_test_summary_stats(){
  return {
    type: "testing",
    hits: 0,
    misses: 0,
    correct_rejections: 0,
    false_alarms: 0,
    score: 0,
  }
}


// -----------------
// Critter Rendering
// -----------------

// Render the table of critters with all the 
// labels hidden from the user
function render_hidden_critters_table(critters, table_width, training) {
  var rows = Math.ceil(critters.length / table_width);
  var cols = table_width;

  var table = "<table>";
  var ind = 0;
  for(var i=0; i <rows; i++) {
    table += "<tr>";
    for(var j=0; j<cols; j++) {
      table += "<td>";
      if (ind >= critters.length) break;
      if (training === true){
        table += "<table class ='cell' id='training_cell_" + ind + "'\">";
      } else {
        table += "<table class ='cell' id='testing_cell_" + ind + "'\">";
      }

      table += "<td>";
      if (training === true) {
       table += "<svg id='training_critter_" + ind +
        "' style='max-width:150px;max-height:150px\'></svg></td>";       
      } else {
       table += "<svg id='testing_critter_" + ind +
        "' style='max-width:150px;max-height:150px\'></svg></td>";         
      }

      table += "<tr>";
      table += "</table>";
      table += "</td>";
      ind += 1;
    }
    table += "</tr>"
  }
  table += "</table>";

  if (training === true) {
    $("#training_critters_grid").append(table);
  } else {
    $("#testing_critters_grid").append(table);
  }

  for (var i = 0; i < critters.length; i++) {
    // Create critter svgs
    var scale = 0.5;
    var stim = critters[i];
    if (training) {
      createTrainingCritter(stim, i, scale);
    } else {
      createTestingCritter(stim, i, scale);
    }
  }
}

function createTrainingCritter(stim, i, scale){
  // Draw Critter
  var id = "training_critter_" + i;
  Ecosystem.draw(
    stim.critter, stim.props,
    id, scale
  );

  // Construct "wudsy" labels
  var label = "";
  if (stim.belongs_to_concept) {  
    label = "<div class='wudsy-label' id='cell-" + i + "-label'> wudsy </div>";
  } else {
    label = "<div class='wudsy-label' id='cell-" + i + "-label'> </div>";
  }
  $(label).insertAfter("#critter_" + i);

  // Add click handlers
  $("#training_cell_" + i).click(function(event) {
    console.log(i);
    var id = '#' + $(event.target).parents('.cell')[0].id;
    if (exp.selected_stim_idx != -1) {
      fade(exp.selected_stim_idx);
    }
    exp.selected_stim_idx = id;
    mark(id);
    showWudsyIndicators(id);

    if (!exp.selected_training_stim.includes(exp.selected_stim_idx)) {
      exp.selected_training_stim.push(exp.selected_stim_idx);

      if (exp.selected_training_stim.length == exp.training_critters.length) {
      // if (exp.selected_training_stim.length == 2) { // Debugging
        // Show "Continue" button -- exploration complete
        $('#training-critters-button').css('visibility', 'visible');
        $('#training-critters-button').prop('disabled', false);
        alert("Exploration Complete! Please take a moment to review your findings before continuing to the chatroom.");
      }
    }
  });
}

function createTestingCritter(stim, i, scale){
  // Draw Critter
  var id = "testing_critter_" + i;
  Ecosystem.draw(
    stim.critter, stim.props,
    id, scale
  );

  // Add click handlers
  $("#testing_cell_" + i).click(function(event) {
    var id = '#' + $(event.target).parents('.cell')[0].id;
    if (exp.selected_test_stim.includes(id)) {
      unmarkAsWudsy(id);
      exp.selected_test_stim.slice(exp.selected_test_stim.indexOf(id), 1);
    } else {
      markAsWudsy(id);
      exp.selected_test_stim.push(id);
    }
  });
}

// Mark a given stimulus with a black border box
function mark(id) {
  $(id).css({"border":'2px solid black'});
  $(id).css({"opacity": 1});
}

// Fade a given stimulus
function fade(id) {
  $(id).css({"border": 'none'});
  $(id).css({"opacity": 0.3});
}

function showWudsyIndicators(id) {
  var labelID = id + '-label';
  $(labelID).css('visibility', 'visible');

  if ($(id).text().indexOf("wudsy") >= 0) {
    $(id).css({'background-color':'green'});
    $(labelID).css({'background-color':'green'});
  }
}

// Mark a given stimlus as wudsy (test)
function markAsWudsy(id) {
  $(id).css({'background-color':'yellow'});
}

// Unmark a given stimlus as wudsy (test)
function unmarkAsWudsy(id) {
  $(id).css({'background-color':'transparent'});
}

// Sleep for given number of milliseconds
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ---------------
// Slide Creation
// ---------------

// Make slides for the experiment
function make_slides(f) {
  var slides = {};

  // Training instructions slide -- information as how the training trials
  // shall proceed for Player A.
  slides.training_instructions = slide({
    name : "training_instructions",
    start : function() {
      // Notify the server:
      // 1) Player has entered the training instructions slide for book keeping.
      // 2) Player needs the training critters.
      globalGame.socket.send("enterSlide.training_instructions.");

      var playerAInstructions = `
      <br><br>
      <h3>Instructions</h3>
      <br>
      <p>
        You are studying creatures with a wudsy detector.
        <br> <br>
        You will be shown a grid of creatures. Click on a creature to discover whether it is wudsy.
        Pay close attention, as you will have to teach your partner which are wudsy.
        <br> <br>
        Press Continue to start the game.
        <br><br>
      </p>
      <button class="continuebutton" onclick="_s.button()">Continue</button>`;

      var playerBInstructions = `
        <br><br>
        <h3>Instructions</h3>
        <br>
        <p>
          Your partner is currently studying creatures with a wudsy detector. It will take them approximately 1 - 2 minutes to finish exploring. 
          <br> <br>
          Meanwhile you will be waiting in a chatroom. Once the explorer is done, they will enter the chatroom. You should discuss what properties of wudsy creatures they learned during exploration. Pay close attention and ask questions, as you will be tested on your understanding of wudsy creatures.
          <br> <br>
          During your partner's exploration period please stay at the computer and <b>DO NOT CLOSE THIS TAB</b>. Otherwise, you will be disconnected from the game and we won't be able to reward you for the hit.
          Please keep checking the chat window, as the status will update when the other player has also entered the room.
          <br> <br> 
          Press Continue to join the chatroom.
          <br> <br> 
        </p>
        <button class="continuebutton" onclick="_s.button()">Continue</button>`;      

      if (globalGame.my_role == "explorer") {
        $("#training_instructions").html(playerAInstructions);
      } else {
        $("#training_instructions").html(playerBInstructions);
      }

    },
    button : function() {
      if (globalGame.my_role == "explorer") {
        exp.goToSlide("training_critters");
      } else {
        exp.goToSlide("chatRoom")
      }
    }
  });

  // Training Trials Slide
  slides.training_critters = slide({
    name : "training_critters",
    start: function() {
      globalGame.socket.send("enterSlide.training_critters.");
      $("#training_critters_grid").empty();

      // Render slide
      render_hidden_critters_table(exp.training_critters, 6, true);      

      // Time Markers
      this.start_time = Date.now()
    },
    button : function() {
      var end_time = Date.now();
      this.time_spent = end_time - this.start_time;
      this.log_responses(this.time_spent/1000);

      // TODO: Redo this so that we only send the logTrain message, once all the training rounds are complete.
      _stream.apply(this); //make sure this is at the *end*, after you log your data
      globalGame.socket.send("logTrain.trainingCritters." + _.pairs(encodeData(exp.training_records[0])).join('.'));
      exp.go();
    },
    log_responses : function(time_spent){
      var record = {
        "training_time" : time_spent,
      };
      exp.training_records.push(record);
    },
  });

  // Chat instructions slide
  slides.chat_instructions = slide({
    name : "chat_instructions",
    start : function() {
      $('#chat_instructs').html("On the next page, you will enter into a chatroom with your partner. " +
      "Please discuss the properties of wudsy creatures. The \"student\" will be advance the game out of the chatroom, once they feel like they have a good understanding of wudsy creatures' properties. " +
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
      globalGame.socket.send("enterSlide.testing_instructions.");

      // Remove flash from chat room
      var cancelFlashTitle = function (timeout) {
        clearTimeout(timeout);
        document.title = original;
        timeoutIndex = -1;
      };
      if (timeoutIndex != -1) {
        cancelFlashTitle(timeoutIndex);
      }

      var instructions = `<br><br>
        <h3>Instructions</h3>
        <br>
        You will be presented a grid. Click on the creatures you believe are wudsy.
        <br> <br>
        Press Continue to start the game.</p>
        <br> <br>
        <button class="continuebutton" onclick="_s.button()">Continue</button>`;
      $("#testing_instructions").html(instructions);
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
    globalGame.socket.send("enterSlide.testing_critters.");

    // hide + disable stuff
    $('#continueButton').prop('disabled', false);
    $("#testing_critters_grid").empty();

    render_hidden_critters_table(exp.testing_critters, 6, false);

    // Time Markers
    this.start_time = Date.now()
  },
  button : function() {
    console.log("Need to write code for evaluating performance on this.");
    var end_time = Date.now();
    this.time_spent = end_time - this.start_time;


    //   var stim = this.stim;
    //   var turker_label = ($("input[type=radio]:checked").val() === "true");
    //   var true_label = stim['belongs_to_concept'];
    //   var is_correct = (turker_label === true_label);


    //   if (turker_label === false && true_label === false) {
    //     exp.testing_summary_stats.correct_rejections += 1;
    //   } else if (turker_label=== false && true_label === true){
    //     exp.testing_summary_stats.misses += 1;
    //   } else if (turker_label === true && true_label === false) {
    //     exp.testing_summary_stats.false_alarms += 1;
    //   } else {
    //     exp.testing_summary_stats.hits += 1;
    //   }

    //   this.log_responses(cur_index, this.time_spent/1000, turker_label, true_label, is_correct);
    //   _stream.apply(this); //make sure this is at the *end*, after you log your data
    //   globalGame.socket.send("logTest.testCritters." + _.pairs(encodeData(exp.testing_data_trials[cur_index])).join('.'));
    // } else {
    //   alert("Please make sure to label all the critters, before proceeding");
    // }
    
    // if (this.testing_trial_idx == exp.num_testing_trials) {
    //   exp.testing_summary_stats.score = exp.testing_summary_stats['hits'] - exp.testing_summary_stats['false_alarms']
    //   globalGame.socket.send("logScores.testCritters." + _.pairs(encodeData(exp.testing_summary_stats)).join('.'));
    //   exp.go();
    // }
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
        "training_trials": [exp.training_trial],
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