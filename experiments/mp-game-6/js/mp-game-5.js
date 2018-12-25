// --------------------------------------------------------------------
//  Multiplayer Game 5: Multiplayer Concept Learning
//  By Sahil Chopra
//  Goal: The purpose of this game is to set up  a multiplayer concept
//        learning paradigm. Player A learns about "species" creatures
//        over approximately 50 trials presented in a single summary
//        grid format. Then Player A and Player B
//        enter a chatroom together and forced to communicate,
//        in which Player A teaches Player B
//        about "species" creatures. Then, they both take a "post test"
//        where A and B are asked to identify creatures as "species"
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
  exp.combined_score = 0;
  exp.train_records = [];
  exp.test_records = [];
  exp.test_summary_stats = [];
  exp.test_summary_stats_combined = [];
  exp.structure = [
    "wait_room",
    "training_instructions",
    "training_critters",
    "chat_instructions",
    "chatRoom",
    "testing_instructions",
    "testing_critters",
    "wait_room",
    "score_report",

    "wait_room",
    "training_instructions",
    "training_critters",
    "chat_instructions",
    "chatRoom",
    "testing_instructions",
    "testing_critters",
    "wait_room",
    "score_report",

    "wait_room",
    "training_instructions",
    "training_critters",
    "chat_instructions",
    "chatRoom",
    "testing_instructions",
    "testing_critters",
    "wait_room",
    "score_report",

    "wait_room",
    "training_instructions",
    "training_critters",
    "chat_instructions",
    "chatRoom",
    "testing_instructions",
    "testing_critters",
    "wait_room",
    "score_report",

    "wait_room",
    "training_instructions",
    "training_critters",
    "chat_instructions",
    "chatRoom",
    "testing_instructions",
    "testing_critters",
    "wait_room",
    "score_report",    

    "total_score_report",
    "subj_info",
    "thanks",
  ];
  exp.slides = make_slides(exp);
  exp.selected_stim_idx = -1;
  exp.selected_training_stim = [];
  exp.selected_test_stim = [];
  exp.times = {
    'timestamps': {
      'training': {
        'start': {
          'exploration': [],
          'submission': [],
        },
        'end': {
          'exploration': [],
          'submission': [],
        },
      },
    'testing': {
      'start': {
        'exploration': [],
        'submission': [],
      },
      'end': {
        'exploration': [],
        'submission': [],
      },
    }
    },
    'durations': {
      'training': {
        'exploration': [],
        'submission': [],
        'total': [],
      },      
      'testing': {
        'exploration': [],
        'submission': [],
        'total': [],
      },     
    }
  };


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

function generate_round_test_summary_stats(){
  return {
    type: "testing",
    hits: 0,
    misses: 0,
    correct_rejections: 0,
    false_alarms: 0,
    score: 0,
    exploration_time: 0,
    submission_time: 0,
    total_time: 0,
  }
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
      <h3>Instructions, Round ` + (globalGame.roundNum + 1) + ` of ` + globalGame.numRounds + `</h3>
      <br>
      <p>
        You are the "Explorer", studying creatures with a ` + globalGame.speciesName + ` detector.
        <br> <br>
        You will be shown a grid of creatures. Click on a creature to discover whether it is a ` + globalGame.speciesName + `.
        Pay close attention, as you will have to teach your partner which are ` + globalGame.pluralSpeciesName + `. 
        <br> <br>
        Press Continue to start the game.
        <br><br>
      </p>
      <button class="continuebutton" onclick="_s.button()">Continue</button>`;

      var playerBInstructions = `
        <br><br>
        <h3>Instructions, Round ` + (globalGame.roundNum + 1) + ` of ` + globalGame.numRounds + `</h3>
        <br>
        <p>
          You are the "Student". Your partner is currently studying creatures with a ` + globalGame.speciesName + ` detector. It will take them approximately 1 - 2 minutes to finish exploring. 
          <br> <br>
          Meanwhile you will be waiting in a chatroom. Once your partner is done, they will enter the chatroom. You should discuss what properties of ` + globalGame.pluralSpeciesName + ` they learned during exploration. Pay close attention and ask questions, as you will be tested on your understanding of ` + globalGame.pluralSpeciesName + `.
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

      $("#training_critters_grid").empty(); // Reset
      exp.selected_training_stim = []; // Reset
      exp.selected_stim_idx = -1; // Reset

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
      var instructions = `<p class="label_prompt"> Click on each one to discover whether or not it is a <strong>` + globalGame.speciesName +`</strong>.
        <br>
        Study them carefully.
        </p>
        <br>
        <br>
        <div id="training_critters_grid"></div>
        <br>
        <br>
        <button class="continuebutton" id="training-critters-button" onclick="_s.button()" disabled>Continue</button>`
      $("#training_critters").html(instructions);
      globalGame.socket.send("enterSlide.training_critters.");

      // Render slide
      render_hidden_critters_table(exp.training_critters, 6, true);      

      // Time Markers
      exp.times.timestamps.training.start.exploration.push(Date.now());
    },
    button : function() {
      exp.times.timestamps.training.end.submission.push(Date.now());
      exp.times.durations.training.exploration.push(
        exp.times.timestamps.training.end.exploration[globalGame.roundNum] - exp.times.timestamps.training.start.exploration[globalGame.roundNum]
      );
      exp.times.durations.training.submission.push(
        exp.times.timestamps.training.end.submission[globalGame.roundNum] - exp.times.timestamps.training.start.submission[globalGame.roundNum]
      );
      exp.times.durations.training.total.push(
        exp.times.durations.training.exploration[globalGame.roundNum] + exp.times.durations.training.submission[globalGame.roundNum]
      );
      exp.train_records.push(this.log_responses(globalGame.roundNum, exp.times));

      _stream.apply(this); //make sure this is at the *end*, after you log your data
      globalGame.socket.send("logTrain.trainingCritters." + _.pairs(encodeData(exp.train_records[globalGame.roundNum])).join('.'));
      exp.go();
    },
    log_responses : function(block, times){
      return record = {
        "exploration_time" : times.durations.training.exploration[block]/1000,
        "submission_time": times.durations.training.submission[block]/1000,
        "total_time": times.durations.training.total[block]/1000,
      };
    },
  });

  // Chat instructions slide
  slides.chat_instructions = slide({
    name : "chat_instructions",
    start : function() {
      // Reset
      var instructions = `On the next page, you will enter into a chatroom with your partner.
      <br>
      <br>
      Please discuss the properties of the ` + globalGame.speciesName + ` creatures. The "student" will be advance the game out of the chatroom, once they feel like they have a good understanding of the properties of the  ` + globalGame.speciesName + ` species.
      <br>
      <br>
      After the chatroom, you both will be provided a set of unseen creatures that you must classify as belonging to the  ` + globalGame.speciesName + ` species or not. Your bonus will be the sum of your score and your partner's score on this task.
      <br>
      <br>
      You are the ` +  roleDictionary[globalGame.my_role] + `.`;
      $('#chat_instructs').html(instructions);
    },
    button : function() {
      exp.go()
    }
  });

  // Connected players can discuss what they have learned in 'welcome_critter' here using a chatbox
  slides.chatRoom = slide({
    name: "chatRoom",
    start: function() {
      var instructions = `Explorer, please talk to the student about the properties of the ` + globalGame.speciesName + ` species.`;
      $("#instructs").html(instructions);

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
        <h3>Quiz Instructions, Round ` + (globalGame.roundNum + 1) + ` of ` + globalGame.numRounds + `</h3>
        <br>
        You will be presented a grid. Click on the creatures you believe belong to the  ` + globalGame.speciesName + ` species.
        <br> <br>
        Press Continue to start the game.</p>
        <br> <br>
        <button class="continuebutton" onclick="_s.button()">Continue</button>`;
      $("#testing_instructions").html(instructions);

      $('#continueButton').prop('disabled', false); // Reset
      $("#testing_critters_grid").empty(); // Reset
      exp.selected_test_stim = []; // Reset
    },
    button : function() {
      exp.go();
    }
  });

  // Generates critters that the partner learned about and tests the user
  slides.testing_critters = slide({
  name : "testing_critters",
  present: exp.testing_critters,
  start: function() {
    var instructions = `
      <p class="label_prompt"> Click on the creatures that you believe are members of the <strong>` + globalGame.speciesName + `</strong> species.
        <br>
        Creatures that you have selected as ` + globalGame.pluralSpeciesName + ` will have a yellow background.
        <br>      
        You can click on a selected creature a second time to un-select it.
        <br>
        Once you are done selecting the ` + globalGame.pluralSpeciesName + `, hit the Continue button.
      </p>
      <br>
      <br>
      <div id="testing_critters_grid"></div>
      <br>
      <br>
     <button class="continuebutton" id="test_button" onclick="_s.button()">Continue</button>`
     $("#testing_critters").html(instructions);

    globalGame.socket.send("enterSlide.testing_critters.");
    render_hidden_critters_table(exp.testing_critters, 6, false);

    // Time Markers
    exp.times.timestamps.testing.start.exploration.push(Date.now());
  },
  button : function() {
    var time = Date.now();
    if (exp.times.timestamps.testing.start.submission.length < globalGame.roundNum + 1) {
      exp.times.timestamps.testing.start.submission.push(time);
    } else {
      exp.times.timestamps.testing.start.submission[globalGame.roundNum] = time;
    }

    var proceed = confirm("Have you selected all the creatures that believe that belong to the " + globalGame.speciesName + " species?\n\n If yes, click \"OK\".\n If no, click \"CANCEL\".");
    if (proceed === false) {
      return;
    }
    var time = Date.now();
    exp.times.timestamps.testing.end.exploration.push(time);
    exp.times.timestamps.testing.end.submission.push(time);
    exp.times.durations.testing.exploration.push(
      exp.times.timestamps.testing.end.exploration[globalGame.roundNum] - exp.times.timestamps.testing.start.exploration[globalGame.roundNum]
    );
    exp.times.durations.testing.submission.push(
      exp.times.timestamps.testing.end.submission[globalGame.roundNum] - exp.times.timestamps.testing.start.submission[globalGame.roundNum]
    );
    exp.times.durations.testing.total.push(
      exp.times.durations.testing.exploration[globalGame.roundNum] + exp.times.durations.testing.submission[globalGame.roundNum]
    );

    // Evaluate performance on entire test set
    var round_test_summary_stats = generate_round_test_summary_stats();
    var test_record = [];
    for (var i=0; i < exp.testing_critters.length; i++) {
      // Get Turker response
      var test_cell_id = "#testing_cell_" + i;
      var turker_label = exp.selected_test_stim.includes(test_cell_id);

      // Get stimulus information
      var stim = exp.testing_critters[i];
      var true_label = stim['belongs_to_concept'];

      // Evaluate correctness of individual creatureß
      var is_correct = (turker_label === true_label);
      if (turker_label === false && true_label === false) {
        round_test_summary_stats.correct_rejections += 1;
      } else if (turker_label=== false && true_label === true){
        round_test_summary_stats.misses += 1;
      } else if (turker_label === true && true_label === false) {
        round_test_summary_stats.false_alarms += 1;
      } else {
        round_test_summary_stats.hits += 1;
      }
      this.log_responses(test_record, i, turker_label, true_label, is_correct);
    }

    // Other summary stats
    round_test_summary_stats.score = round_test_summary_stats.hits - round_test_summary_stats.false_alarms;
    round_test_summary_stats.exploration_time = exp.times.durations.testing.exploration[globalGame.roundNum]/1000;
    round_test_summary_stats.submission_time = exp.times.durations.testing.submission[globalGame.roundNum]/1000;
    round_test_summary_stats.total_time = exp.times.durations.testing.total[globalGame.roundNum]/1000;

    exp.test_records.push({
      'trials': test_record
    });
    exp.test_summary_stats.push(round_test_summary_stats);
    _stream.apply(this); //make sure this is at the *end*, after you log your data

    globalGame.socket.emit('multipleTrialResponses', exp.test_records[globalGame.roundNum]);
    globalGame.socket.send("logScores.testCritters." + _.pairs(encodeData(exp.test_summary_stats[globalGame.roundNum])).join('.'));
    exp.go();
  },
  log_responses : function(test_record, stim_num, turker_label, true_label, is_correct){
    test_record.push({
      "stim_num" : stim_num,
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
      globalGame.socket.send("enterSlide.score_report.");
      globalGame.socket.send("sendingTestScores." + _.pairs(encodeData(exp.test_summary_stats[globalGame.roundNum])).join('.'));
    },
    button: function() {
      globalGame.socket.send("newRoundUpdate.");
      exp.go();
    }
  });

  slides.total_score_report = slide({
    name: "total_score_report",
    start: function() {
      var my_role = globalGame.my_role;
      var partner_role = my_role === "explorer" ? "student" : "explorer"
      for(var i=0; i<2; i++){
        var score_role, role_index;
        if(i==0){
          score_role="your";
          role_index=my_role;
        }
        else if(i==1){
          score_role="other";
          role_index=partner_role;
        }

        var playerScore = 0;
        var playerHits = 0;
        var playerMisses = 0;
        var playerCorrectRejections = 0;
        var playerFalseAlarms = 0;
        for (var j = 0; j < exp.test_summary_stats_combined.length; j++) {
            var roundHits = Number(exp.test_summary_stats_combined[j][role_index].hits);
            var roundMisses = Number(exp.test_summary_stats_combined[j][role_index].misses);
            var roundCorrectRejections = Number(exp.test_summary_stats_combined[j][role_index].correct_rejections);
            var roundFalseAlarms = Number(exp.test_summary_stats_combined[j][role_index].false_alarms);
            var roundScore = roundHits - roundFalseAlarms;
            var positiveRoundScore = roundScore > 0 ? roundScore : 0;
            playerHits += roundHits;
            playerMisses += roundMisses;
            playerCorrectRejections += roundCorrectRejections;
            playerFalseAlarms += roundFalseAlarms;
            playerScore += positiveRoundScore;
        }

        exp.combined_score += playerScore;
        $('#'+score_role+'_total_score').html("Total: " + playerScore);
      }
    },
    button: function() {
      exp.go();
      console.log("Combined Score: " + exp.combined_score);
    }
  })

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
      }
    });

  // Generic thanks page that collects some data
  slides.thanks = slide({
    name : "thanks",
    start : function() {
      globalGame.socket.send("enterSlide.thanks.");
      exp.data= {
        "game_id": globalGame.data.id,
        "role": globalGame.my_role,
        "round_selections": ,
        "subject_information" : subj_data,
        "time_in_minutes" : (Date.now() - globalGame.startT)/60000,
        "test_summary_stats": exp.test_summary_stats,
        "bonus": exp.combined_score * globalGame.bonusAmt,
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