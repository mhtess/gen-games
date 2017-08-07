// To add a slide to experiment structure (to ensure it shows up) proceed to line 337


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
      globalGame.socket.send("enterSlide.instructions.");
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
      globalGame.socket.send("enterSlide.wait_room.");
      $(".err").hide();
      $("#waitCont").hide();
      globalGame.socket.send("enterWaitRoom.");
      var blinking_wait = setInterval(function() {
        $("#waitText").fadeOut(1000);
        $("#waitText").fadeIn(1000);
        if($("#welcome").is(':visible')){ //if it goes to next slide
          clearInterval(blinking_wait);
        }
      }, 2000);
    }
  });

  slides.structure_instruct = slide({
    name: "structure_instruct",
    button : function() {
      exp.go();
    }
  })


  // This is the learning slide in which users will uncover information about the critters
  slides.welcome_critterLand = slide({
    name : "welcome_critterLand",
    crittersFromServer : "",
    start : function(stim) {
      // The hide / show is so we can put more specific (to which critter they see) instructions
      $("#cur_instructs").hide();
      $("#instru_button").hide();
      $("#welcome").show();
      $("#meeting").show();
      $("#internalprops_instruct").show();
      $("#critter_display").show();
      $("#learning_button").show();
      this.start_time = Date.now()
      globalGame.socket.send("enterSlide.welcome_critterLand.");
      this.stim = stim;
      $(".critname").hide();
      $(".err").hide();
      $("#learning_button").hide();
      allCreatures = this.crittersFromServer;
      shuffledCritters = _.shuffle(allCreatures)

      this.num_creats = allCreatures.length;
      this.creat_type = shuffledCritters[0]["critter"];

      // This generates all the critters
      create_table(globalGame.presentRows,globalGame.presentCols,"critter_display");

      for (var i=0; i<shuffledCritters.length; i++) {
        var scale = 0.5;
        Ecosystem.draw(
          shuffledCritters[i]["critter"], shuffledCritters[i],
          "critter"+i, scale)

        $('#cell'+i+'critname').html(shuffledCritters[i]["creatureName"]);

        switch(shuffledCritters[i]["critter"]) {
          case 'bird':
          $('#internalprops_instruct').html(globalGame.critter_instructions["bird"]["internal_prop_instruct"]);
          if (shuffledCritters[i]["internal_prop"]) {
            $('#cell'+i+'internalprop').html(globalGame.critter_instructions["bird"]["internal_prop_symbol"]);
          }
          break;
          case 'bug':
          $('#internalprops_instruct').html(globalGame.critter_instructions["bug"]["internal_prop_instruct"])
          if (shuffledCritters[i]["internal_prop"]) {
            $('#cell'+i+'internalprop').html(globalGame.critter_instructions["bug"]["internal_prop_symbol"]);
          }
          break;
          case 'fish':
          $('#internalprops_instruct').html(globalGame.critter_instructions["fish"]["internal_prop_instruct"])
          if (shuffledCritters[i]["internal_prop"]) {
            $('#cell'+i+'internalprop').html(globalGame.critter_instructions["fish"]["internal_prop_symbol"]);
          }
          break;
          case 'tree':
          $('#internalprops_instruct').html(globalGame.critter_instructions["tree"]["internal_prop_instruct"])
          if (shuffledCritters[i]["internal_prop"]) {
            $('#cell'+i+'internalprop').html(globalGame.critter_instructions["tree"]["internal_prop_symbol"]);
          }
          break;
        }
        $('#cell'+i+'internalprop').css({'opacity': 0});

      }

    },

    // This button refers to the button seen in welcome critter page, not on the page with instructions for it
    button : function() {
      var end_time = Date.now()
      this.time_spent = end_time - this.start_time;
      allCreatures = [];
      shuffledCritters = [];

      for (var i = 0; i < this.num_creats; i++) {
        $('#critter' + i).empty();
        $('#cell' + i).css({'opacity': '1'});
        $('#cell' + i).css({'border': ''});
        $('#creature_table').remove();
        prev = null;
      }

      // Hide / show allows for specific instructions
      $("#welcome").hide();
      $("#meeting").hide();
      $("#internalprops_instruct").hide();
      $("#critter_display").hide();
      $("#learning_button").hide();
      $("#cur_instructs").show();
      $("#instru_button").show();
      switch (this.creat_type) {
        case 'bird': case 'bug':
        $("#cur_instructs").append(globalGame.task_welcome_critter["bird_bug"]);
        break;
        case 'tree': case 'fish':
        $("#cur_instructs").append(globalGame.task_welcome_critter["tree_fish"]);
        break;
      }
    },
  });

// Generates critters that the partner learned about and tests the user
slides.test_critters = slide({
 name : "test_critters",

 crittersFromServer : "",

 start : function() {

   this.start_time = Date.now()
   globalGame.socket.send("enterSlide.test_critters.");
   //globalGame.socket.send("enterTests.");
   $(".err").hide();
   allCreatures = this.crittersFromServer;
   shuffledCritters = _.shuffle(allCreatures)
   //console.log(allCreatures)
   this.num_creats = allCreatures.length;
   this.creat_type = shuffledCritters[0]["critter"];

   // Creating a specific instructions view
   $("#collect").hide();
   $("#chooseCrit").hide();
   $("#critter_test_display").hide();
   $("#test_button").hide();
   $("#next_button").show();
   $('#test_cond').show();

   $('#test_cond').html("<br>On the next slide, you will choose the ");
   switch (this.creat_type) {
    case 'bird':
    $("#test_cond").append(globalGame.critter_instructions["bird"]["test_instruct"]);
    break;
    case 'bug':
    $("#test_cond").append(globalGame.critter_instructions["bug"]["test_instruct"]);
    break;
    case 'fish':
    $("#test_cond").append(globalGame.critter_instructions["fish"]["test_instruct"]);
    break;
    case 'tree':
    $("#test_cond").append(globalGame.critter_instructions["tree"]["test_instruct"]);
    break;
  }

    // Generates critters for test phase
    create_table(globalGame.presentRows,globalGame.presentCols,"critter_test_display");

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


  //log responses
  for (var i=0; i<this.num_creats; i++) {
    var dataToSend = {
      "block_num" : block,
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
      "internal_prop" : shuffledCritters[i]["internal_prop"],
      "selected" : $('#cell' + i).attr("data-selected")
    }
    globalGame.socket.send("logResponse.testCritters." + _.pairs(dataToSend).join('.'));

  }

  allCreatures = [];
  shuffledCritters = [];

  for (var i = 0; i < this.num_creats; i++) {
     $('#critter' + i).empty();
     $('#cell' + i).css({'opacity': '1'});
     $('#cell' + i).css({'border': ''});
     $('#creature_table').remove();
     prev = null;
  }

  block++;
  exp.go(); // use exp.go() if and only if there is no "present" data.

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
  submit : function(e){
      //if (e.preventDefault) e.preventDefault(); // I don't know what this means.
      globalGame.socket.send("enterSlide.subj_info.");
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

// Generic thanks page that collects some data
slides.thanks = slide({
  name : "thanks",
  start : function() {
    globalGame.socket.send("enterSlide.thanks.");
    exp.data= {
      //"trials" : exp.data_trials,
      "test_trials" : exp.test_trials,
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
  exp.test_trials = [];
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

  // learning - chat - test rounds
  var numRounds = function(num) {
    array1 = ["wait_room", "welcome_critterLand", "chatRoom", "test_critters"]
    while (num != 0) {
      array1.push.apply(array1, array1);
      num --;
    }
    return array1
  }

  //blocks of the experiment:
  exp.structure=[
    "i0",
    "instructions",
    "wait_room",
    "welcome_critterLand",
    "chatRoom",
    "test_critters",
    "structure_instruct",
    "wait_room",
    "welcome_critterLand",
    "chatRoom",
    "test_critters",
    "structure_instruct",
    "wait_room",
    "welcome_critterLand",
    "chatRoom",
    "test_critters",
    "structure_instruct",
    "wait_room",
    "welcome_critterLand",
    "chatRoom",
    "test_critters",
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

  //exp.data_trials = [];
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
  });
  exp.go(); //show first slide
}
