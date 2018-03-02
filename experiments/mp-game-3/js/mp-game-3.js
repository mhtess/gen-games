// --------------------------------------------------------------------
// Multiplayer Game 3: Multiplayer Concept Learning
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
  exp.data_trials = [];
  exp.structure = [
    "wait_room",
    "learning_instructions",
    "learning_critters",
    "chat_instructions",
    "chatRoom",
    "test_instructions",
    "test_critters",
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
    crittersFromServer : "",
    start : function(stim) {
      globalGame.socket.send("enterSlide.learning_critters.");

      // TODO: Write Critter Display Code (take this from game-5)
      this.start_time = Date.now()
      this.stim = stim;
    },
    button: function() {
      var end_time = Date.now()
      this.time_spent = end_time - this.start_time;

      // TODO: Replace with code for submitting data to
      // server for Game-3.
      for (var i = 0; i < this.num_creats; i++) {
        var dataToSend = _.extend(this.shuffledCritters[i], {
          "block_num" : exp.block,
          "time_in_ms" : this.time_spent,
          "block": "learnCritters",
          "critter_num" : i,
        })
        globalGame.socket.send("logTrain.learnCritters." + _.pairs(encodeData(dataToSend)).join('.'));
        exp.data_trials.push(dataToSend);

        $('#critter' + i).empty();
        $('#cell' + i).css({'opacity': '1'});
        $('#cell' + i).css({'border': ''});
        $('#creature_table').remove();
        prev = null;
      }

      this.shuffledCritters = [];
      exp.go()
    },
  });

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

  // Test instructions slide
  slides.test_instructions = slide({
    name : "test_instructions",
    start : function() {
      globalGame.socket.send("enterSlide.test_critters.");
    },
    button : function() {
      exp.go()
    }
  });



  // Generates critters that the partner learned about and tests the user
  slides.test_critters = slide({
  name : "test_critters",

  crittersFromServer : "",
  selfOrPartner : "",
  start : function() {

    this.start_time = Date.now()
    $(".err").hide();

    this.shuffledCritters = _.shuffle(this.crittersFromServer)
    this.num_creats = this.shuffledCritters.length;
    this.creat_type = this.shuffledCritters[0]["genus"];

    $('#chooseCrit').html(
      "Click on the " +
      this.shuffledCritters[0]["categoryPluralLabel"]
    );

      // Generates critters for test phase
      globalGame.presentRows = 2;
        globalGame.presentCols = globalGame.testN/globalGame.presentRows;
      create_table(globalGame.presentRows,globalGame.presentCols,"critter_test_display");

      for (var i=0; i<this.shuffledCritters.length; i++) {
      var scale = 0.5;
      Ecosystem.draw(
        this.shuffledCritters[i]["genus"], this.shuffledCritters[i],
        "critter"+i, scale)
    }

    $(".critname").hide();

  },

  button : function() {
    var end_time = Date.now()
    this.time_spent = end_time - this.start_time;

    var blockScores = {
      hit:0, miss:0, falseAlarm: 0, correctRejection: 0
    }

    //log responses
    for (var i=0; i<this.num_creats; i++) {

      var isLabeled = this.shuffledCritters[i].labeled;
      var selectedAnswer = $('#cell' + i).attr("data-selected");

      blockScores[scoreSingle(isLabeled, selectedAnswer)]++

      var dataToSend = _.extend(this.shuffledCritters[i], {
        "block_num" : exp.block,
        "block_type": "testCritters",
        "tested_on": this.selfOrPartner,
        "time_in_ms" : this.time_spent,
        "critter_num" : i,
        "isLabeled" : isLabeled ? 1 : 0,
        "selected" : selectedAnswer,
        "categorizedResponse" : scoreSingle(isLabeled, selectedAnswer)
      })

      globalGame.socket.send("logTest.testCritters." + _.pairs(encodeData(dataToSend)).join('.'));
      exp.data_trials.push(dataToSend);

    }

    globalGame.socket.send("sendingTestScores." + globalGame.my_role + "." + _.pairs(blockScores).join('.'));
    globalGame.socket.send("logScores.score_report." + _.pairs(blockScores).join('.'));

    // empties the critter arrays so they can be repopulated without overlap
    this.shuffledCritters = [];

    // resets table
    for (var i = 0; i < this.num_creats; i++) {
      $('#critter' + i).empty();
      $('#cell' + i).css({'opacity': '1'});
      $('#cell' + i).css({'border': ''});
      $('#creature_table').remove();
      prev = null;
    }

    exp.block++;
    exp.go(); // use exp.go() if and only if there is no "present" data.

    }
  });

  slides.score_report = slide({
    name: "score_report",
    // start: function() {

    // },
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