// To add a slide to experiment structure (to ensure it shows up) proceed to line 337

var roleDictionary = {
  playerA: "Player A",
  playerB: "Player B"
}

// All slides must have a slides.slide_name function in this function
function make_slides(f) {
  var   slides = {};

  // Information page - legal and about the experiment
  slides.i0 = slide({
    name : "i0",
    start: function() {
    exp.startT = Date.now();
    }
  });

  // Instructions slide for the experiment
  slides.instructions = slide({
    name : "instructions",
    start: function(){
      exp.socket.send("enterSlide.instructions.");
    },
    button : function() {
      exp.go(); //use exp.go() if and only if there is no "present" data.
    },
  });

  // This slide will be seen by one of the players while until the other player reaches the same screen
  slides.wait_room = slide({
    name: "wait_room",
    start: function() {
      console.log('start of wait_room')
      $("#waitText").empty();

      exp.socket.send("enterSlide.wait_room.");
      exp.socket.send("enterWaitRoom.");

      $(".err").hide();
      if(exp.block == 0)
        $("#waitText").append("Waiting for another player to connect...")
      else
        $("#waitText").append("Waiting for your partner to catch up...")
      $("#waitCont").hide();

      var blinking_wait = setInterval(function() {
        $("#waitText").fadeOut(1000);
        $("#waitText").fadeIn(1000);
        if($("#welcome").is(':visible')){ //if it goes to next slide
          clearInterval(blinking_wait);
        }
      }, 2000);
    }
  });

  // This is the learning slide in which users will uncover information about the critters
  slides.learning_critters = slide({
    name : "learning_critters",
    crittersFromServer : "",
    start : function(stim) {

      // The hide / show is so we can put more specific (to which critter they see) instructions
      // Note: do we need all these show() statements?
      $("#welcome").show();
      $("#meeting").show();
      $("#internalprops_instruct").show();
      $("#critter_display").show();
      $("#learning_button").hide();
      this.start_time = Date.now()
      this.stim = stim;

      $(".critname").hide();
      $(".err").hide();

      allCreatures = this.crittersFromServer;
      shuffledCritters = _.shuffle(allCreatures)

      this.num_creats = allCreatures.length;
      this.creat_type = shuffledCritters[0]["critter"];

      // This generates all the critters
      create_table(exp.presentRows,exp.presentCols,"critter_display");

      for (var i=0; i<shuffledCritters.length; i++) {
        var scale = 0.5;
        Ecosystem.draw(
          shuffledCritters[i]["critter"], shuffledCritters[i],
          "critter"+i, scale)

        $('#cell'+i+'critname').html(shuffledCritters[i]["creatureName"]);

        $('#internalprops_instruct').html(
          "Click on each one to discover whether <strong>" +
          exp.critter_instructions[shuffledCritters[i]["critter"]]["internal_prop_instruct"] +
          "</strong>"
        );

        if (shuffledCritters[i]["internal_prop"]) {
          $('#cell'+i+'internalprop').html(exp.critter_instructions[shuffledCritters[i]["critter"]]["internal_prop_symbol"]);
        }

        $('#cell'+i+'internalprop').css({'opacity': 0});

      }

    },

    // This button refers to the button seen in welcome critter page, not on the page with instructions for it
    button : function() {
      var end_time = Date.now()
      this.time_spent = end_time - this.start_time;

      // clears table
      for (var i = 0; i < this.num_creats; i++) {
        var dataToSend = {
          "block_num" : exp.block,
          //"distribution" : exp.distribution, //fix this later
          "time_in_ms" : this.time_spent,
          "block": "learnCritters",
          "critter" : shuffledCritters[i]["critter"],
          "critter_num" : i,
          "species" : shuffledCritters[i]["creatureName"],
          "color" : shuffledCritters[i]["col1"],
          "prop1" : shuffledCritters[i]["prop1"],
          "prop2" : shuffledCritters[i]["prop2"],
          "tar1" : shuffledCritters[i]["tar1"],
          "tar2" : shuffledCritters[i]["tar2"],
          "tar3" : shuffledCritters[i]["tar3"],
          "internal_prop" : shuffledCritters[i]["internal_prop"]
        }
        exp.socket.send("logTrain.learnCritters." + _.pairs(encodeData(dataToSend)).join('.'));
        exp.data_trials.push(dataToSend);

        $('#critter' + i).empty();
        $('#cell' + i).css({'opacity': '1'});
        $('#cell' + i).css({'border': ''});
        $('#creature_table').remove();
        prev = null;
      }

      allCreatures = [];
      shuffledCritters = [];
      exp.go()

    },
  });

slides.learning_instructions = slide({
  name : "learning_instructions",
  start : function() {
    // send signal to server to send stimuli
    exp.socket.send("enterSlide.learning_instructions.");


    this.creat_type = exp.slides.learning_critters.crittersFromServer
[0]["critter"];

    switch (this.creat_type) {
      case 'bird': case 'bug':
      $("#learning_instructs").html(exp.task_welcome_critter["bird_bug"]);
      break;
      case 'tree': case 'fish':
      $("#learning_instructs").html(exp.task_welcome_critter["tree_fish"]);
      break;
    }
  },
  button : function() {
    exp.go()
  }
});

slides.test_instructions = slide({
  name : "test_instructions",
  start : function() {
    // send signal to server to send stimuli
    exp.socket.send("enterSlide.test_critters.");

    this.creat_type = exp.slides.test_critters.crittersFromServer
[0]["critter"];
  $('#test_instructs').html(
    "<br>On the next slide, select the " +
    exp.critter_instructions[this.creat_type]["test_instruct"]
  );

  },
  button : function() {
    exp.go()
  }
});

slides.chat_instructions = slide({
  name : "chat_instructions",
  start : function() {
    $('#chat_instructs').html("On the next page, you will enter into a chatroom with your partner. " +
    " After 45 seconds, a continue button will appear for Player B, which, when clicked, will advance the game for both players. " +
    "You are " +  roleDictionary[exp.my_role] + ".")
  },
  button : function() {
    exp.go()
  }
});

// Generates critters that the partner learned about and tests the user
slides.test_critters = slide({
 name : "test_critters",

 crittersFromServer : "",

 start : function() {

   this.start_time = Date.now()
   $(".err").hide();
   allCreatures = this.crittersFromServer;
   shuffledCritters = _.shuffle(allCreatures)
   this.num_creats = allCreatures.length;
   this.creat_type = shuffledCritters[0]["critter"];

   $('#chooseCrit').html(
     "Click on the " +
     exp.critter_instructions[this.creat_type]["test_instruct"]
   );

    // Generates critters for test phase
    create_table(exp.presentRows,exp.presentCols,"critter_test_display");

    for (var i=0; i<shuffledCritters.length; i++) {
     var scale = 0.5;
     Ecosystem.draw(
       shuffledCritters[i]["critter"], shuffledCritters[i],
       "critter"+i, scale)
     $('#cell'+i+'critname').html(shuffledCritters[i]["creatureName"]);
   }

 },

 button : function() {
  var end_time = Date.now()
  this.time_spent = end_time - this.start_time;

  var blockScores = {
    hits:0, misses:0, falseAlarms: 0, correctRejections: 0
  }
  for (i = 0; i < shuffledCritters.length; i++){
    var correctAnswer = shuffledCritters[i].internal_prop;
    var selectedAnswer = $('#cell' + i).attr("data-selected");
    blockScores[scoreSingle(correctAnswer, selectedAnswer)]++
  }

  //log responses
  for (var i=0; i<this.num_creats; i++) {
    var correctAnswer = shuffledCritters[i]["internal_prop"];
    var selectedAnswer = $('#cell' + i).attr("data-selected");
    var dataToSend = {
      "block_num" : exp.block,
      "block_type": "testCritters",
      //"distribution" : exp.distribution, //fix this later
      "time_in_ms" : this.time_spent,
      "critter" : shuffledCritters[i]["critter"],
      "critter_num" : i,
      "species" : shuffledCritters[i]["creatureName"],
      "color" : shuffledCritters[i]["col1"],
      "prop1" : shuffledCritters[i]["prop1"],
      "prop2" : shuffledCritters[i]["prop2"],
      "tar1" : shuffledCritters[i]["tar1"],
      "tar2" : shuffledCritters[i]["tar2"],
      "tar3" : shuffledCritters[i]["tar3"],
      "internal_prop" : correctAnswer,
      "selected" : selectedAnswer,
      "full_globalColor0_p" : shuffledCritters[i]["critter_full_info"].globalColors[0]["p"].toString(),
      "full_globalColor0_color_mean" : shuffledCritters[i]["critter_full_info"].globalColors[0]["props"]["color_mean"],
      "full_globalColor0_color_var" : shuffledCritters[i]["critter_full_info"].globalColors[0]["props"]["color_var"],
      "full_globalColor1_p" : shuffledCritters[i]["critter_full_info"].globalColors[1]["p"],
      "full_globalColor1_color_mean" : shuffledCritters[i]["critter_full_info"].globalColors[1]["props"]["color_mean"],
      "full_globalColor1_color_var" : shuffledCritters[i]["critter_full_info"].globalColors[1]["props"]["color_var"],
      "full_prop1" : shuffledCritters[i]["critter_full_info"]["prop1"],
      "full_prop2" : shuffledCritters[i]["critter_full_info"]["prop2"],
      "full_tar1" : shuffledCritters[i]["critter_full_info"]["tar1"],
      "full_tar2" : shuffledCritters[i]["critter_full_info"]["tar2"],
      "full_internal_prop" : shuffledCritters[i]["critter_full_info"]["internal_prop"],
      "score" : score(correctAnswer, selectedAnswer)
    }

    exp.socket.send("logTest.testCritters." + _.pairs(encodeData(dataToSend)).join('.'));
    exp.data_trials.push(dataToSend);

  }

  exp.socket.send("sendingTestScores." + exp.my_role + "." + _.pairs(blockScores).join('.'));
  exp.socket.send("logScores.score_report." + _.pairs(blockScores).join('.'));

  // empties the critter arrays so they can be repopulated without overlap
  allCreatures = [];
  shuffledCritters = [];

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
    exp.socket.send("enterSlide.chatRoom.");
    exp.socket.send("enterChatRoom.");
    $(".err").hide();
    $('#waiting').show();
  }
});

// Collects demographic information from users
slides.subj_info =  slide({
  name : "subj_info",
  start: function(){
    $('#humanResult').hide();
    exp.socket.send("calculatingReward.")
    //console.log("reward: " + exp.calculate_end_game_bonus());

  },
  submit : function(e){
      //if (e.preventDefault) e.preventDefault(); // I don't know what this means.
      exp.socket.send("enterSlide.subj_info.");
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

      exp.socket.send("logSubjInfo.subjInfo." + _.pairs(encodeData(exp.subj_data)).join('.'));

      exp.go();
    } //use exp.go() if and only if there is no "present" data.
  });

// Generic thanks page that collects some data
slides.thanks = slide({
  name : "thanks",
  start : function() {
    exp.socket.send("enterSlide.thanks.");

    exp.data= {
      "trials" : exp.data_trials,
      "system" : exp.system,
      "condition" : exp.condition,
      "subject_information" : exp.subj_data,
      "time_in_minutes" : (Date.now() - exp.startT)/60000
    };
    setTimeout(function(){
      if(_.size(exp.urlParams) == 4) {
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

/// init ///
function init() {
  exp.trials = [];
  allCreatures = [];
  shuffledCritters = [];
  exp.condition = _.sample(["CONDITION 1", "condition 2"]); //can randomize between subject conditions here
  exp.system = {
    Browser : BrowserDetect.browser,
    OS : BrowserDetect.OS,
    screenH: screen.height,
    screenUH: exp.height,
    screenW: screen.width,
    screenUW: exp.width
  };
  exp.block = 0;

  // learning - chat - test rounds
  var roundGenerator = function(num) {
    array1 = ["wait_room", "score_report", "learning_instructions", "learning_critters", "chat_instructions", "chatRoom", "test_instructions", "test_critters"]
    while (num != 1) {
      array1.push.apply(array1, array1);
      num --;
    }
    // SHOULD THIS BE array1?
    array.splice(1, 1); // deletes the first score report
    console.log("generate")
    return array1
  }

  // blocks of the experiment:
  exp.structure=[

    "wait_room",
    "learning_instructions",
    "learning_critters",
    "chat_instructions",
    "chatRoom",
    "test_instructions",
    "test_critters",
    "wait_room",
    "score_report",

    "learning_instructions",
    "learning_critters",
    "chatRoom",
    "test_instructions",
    "test_critters",
    "wait_room",
    "score_report",

    "learning_instructions",
    "learning_critters",
    "chatRoom",
    "test_instructions",
    "test_critters",
    "wait_room",
    "score_report",

    "learning_instructions",
    "learning_critters",
    "chatRoom",
    "test_instructions",
    "test_critters",
    "wait_room",
    "score_report",

    "subj_info",
    'thanks',
    ]

  // var start_exp = [];//"i0", "instructions"]
  // // change this as you please - plus find way to make one exp.numRounds
  // var middle_exp = roundGenerator(1)
  // var end_exp = ['wait_room', 'score_report', 'subj_info','thanks']
  // start_exp.push.apply(start_exp, middle_exp)
  // start_exp.pop();
  // start_exp.push.apply(start_exp, end_exp)
  // exp.structure = start_exp

  //exp.data_trials = [];
  //make corresponding slides:
  exp.slides = make_slides(exp);
  exp.data_trials = [];

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
  });
  exp.go(); //show first slide
}
