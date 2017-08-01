// For slides proceed to line 95
// To add a slide to experiment structure (to ensure it shows up) proceed to line 400

var prev = null;
var block = 0;

// Allows the border of each critter to be highlighted when chosed
function mark_critter_display(el, otherEls) {
  if(prev != null){
    gray(prev);
  }
  prev = el;
  if(el.style.border=='2px solid white'){
    $('#'+el.id).css({"border":'2px solid red',
      'background-color': 'white','opacity': '1'});
    $('#'+ el.id + 'critname').css({'opacity': 1, 'font-weight': 'bold'});
    $("#"+ el.id + 'internalprop').css({'opacity': 1});
    $('#'+el.id+'internalprop').css({'opacity': 1})}

    otherEls.map(function(cell){$('#'+cell).css({"border":'2px solid white',
      'background-color': 'white'})})
    check(allCreatures.length);
}

// same as above but able to highlight multiple for the test trials
function mark_critter_test_display(el, otherEls) {
  if(el.style.border=='2px solid white'){
    $('#'+el.id).css({"border":'2px solid red',
      'background-color': 'white','opacity': '1'})
  } else {
    $('#'+el.id).css({"border":'2px solid white',
      'background-color': 'white'})
  }
}

// grays out after clicked for learning phase
function gray(el) {
   $('#'+el.id).css({"border":'2px solid white',
                    'background-color': 'white', 'opacity': 0.5});
   $('#'+el.id+'critname').css({'opacity': 0.5, 'font-weight': 'normal'});
   $('#'+ el.id+'internalprop').css({'opacity': 0.7})
}

function check(num){
  var check_all = 0;
  for(var i=0; i<num; i++) {
     if($('#cell' + i +'critname').css('opacity') != 1 || $('#cell' + i +'critname').css('font-weight') == 'bold'){
        ++check_all;
     }
  }
  if(check_all == num) {
    $("#learning_button").show();
  }
}


var ind = 0;
// Puts the critters we have in a table so we can use borders to our advantage
function create_table(rows, cols, display_type) { //rows * cols = number of exemplars
  var table = "<table id='creature_table' cellspacing='20'>";
  for(var i=0; i <rows; i++) {
    table += "<tr>";
    for(var j=0; j<cols; j++) {
      table += "<td>";
      ind = i * cols + j;
      table += "<table class ='cell' id='cell" + ind + "' style='border:2px solid white' onclick=\"mark_" + display_type +"(cell" + ind +",";
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
      "' style='max-width: 90px;max-height: 90px\'></svg></td>";
      table += "<tr>";
      table += "<td>";
      table += "<div class='critlabel' id='cell" + ind + "critlabel'>"; //critter species name + emoji
      table += "<div class='critname' id='cell" + ind + "critname' style='float:left'></div>";
      table += "<div class='critname' id='cell" + ind + "internalprop' style='float: center'></div></div>";
      table += "</td><br>";
      table += "</tr>";
      table += "</table>";
      table += "</td>";
    }
    table += "</tr>"
  }
  table += "</table>";
  $("#" + display_type).append(table);
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
      // for(var i=0; i<1000; i++){
      //    $("#waitText").fadeOut(1000);
      //    $("#waitText").fadeIn(1000);
      //  }
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
      create_table(2,6,"critter_display");

      for (var i=0; i<shuffledCritters.length; i++) {
        var scale = 0.5;
        Ecosystem.draw(
          shuffledCritters[i]["critter"], shuffledCritters[i],
          "critter"+i, scale)
      }

      for(var i=0; i<shuffledCritters.length; i++) {
       $('#cell'+i+'critname').html(shuffledCritters[i]["creatureName"]);
     }

     for(var i=0; i<shuffledCritters.length; i++) {
      $('#cell'+i+'critname').html(shuffledCritters[i]["creatureName"]);
      switch(shuffledCritters[i]["critter"]) {
        case 'bird':
        $('#internalprops_instruct').html("Click on each critter to discover whether it lays eggs.");
        if (shuffledCritters[i]["internal_prop"]) {
              $('#cell'+i+'internalprop').html("&#x1F423;"); //hatching chick

            }
            break;
            case 'bug':
            $('#internalprops_instruct').html("Click on each critter to discover whether it is poisonous.")
            if (shuffledCritters[i]["internal_prop"]) {
              $('#cell'+i+'internalprop').html("&#x2620;"); //skull & crossbones sign
            }
            break;
            case 'fish':
            $('#internalprops_instruct').html("Click on each critter to discover whether it is eaten by crocodiles.")
            if (shuffledCritters[i]["internal_prop"]) {
              $('#cell'+i+'internalprop').html("&#x1f40a;"); //crocodile
            }
            break;
            case 'tree':
            $('#internalprops_instruct').html("Click on each plant to discover whether it grows leaves.")
            if (shuffledCritters[i]["internal_prop"]) {
              $('#cell'+i+'internalprop').html("&#x2618;"); //shamrock
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
        $("#cur_instructs").append("<h2>Save the population</h2><p><br>You are trying to save the dwindling population of birds in Critter Country. Discuss with your partner which birds and bugs should be gathered in order to save the population.</p>");
        break;
        case 'tree': case 'fish':
        $("#cur_instructs").append("<h2>Protect the fish</h2><p><br>Some of the fish in Critter Country are under threat and need to find homes that can help hide them. Discuss with your partner which fish need to be saved and which underwater plants will protect them.</p>");
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
    $("#test_cond").append("<p>birds that you believe will help you and your partner save the population.<br>");
    break;
    case 'bug':
    $("#test_cond").append("<p>bugs that you can feed the birds to help you and your partner save the population.<br>");
    break;
    case 'tree': 
    $("#test_cond").append("<p>underwater plants that will help protect the fish from being eaten.<br>");
    break;
    case 'fish':
    $("#test_cond").append("<p>fish that are in danger of being eaten.<br>");
    break;
  }

    // Generates critters for test phase
    create_table(2,6,"critter_test_display");

    for (var i=0; i<shuffledCritters.length; i++) {
     var scale = 0.5;
     Ecosystem.draw(
       shuffledCritters[i]["critter"], shuffledCritters[i],
       "critter"+i, scale)
   }


   for(var i=0; i<shuffledCritters.length; i++) {
     $('#cell'+i+'critname').html(shuffledCritters[i]["creatureName"]);
   }
   
 },

 button : function() {
  var end_time = Date.now()
  this.time_spent = end_time - this.start_time;


  //log responses
  for (var i=0; i<this.num_creats; i++) {
    exp.test_trials.push({
      "block_num" : block,
      //"distribution" : exp.distribution, //fix this later
      "time_in_seconds" : this.time_spent/1000,
      "critter" : shuffledCritters[i]["critter"],
      "critter_num" : i,
      "species" : shuffledCritters[i]["creatureName"],
      "color" : shuffledCritters[i]["col1"], 
      "prop1" : shuffledCritters[i]["prop1"],
      "prop2" : shuffledCritters[i]["prop2"],
      "tar1" : shuffledCritters[i]["tar1"],
      "tar2" : shuffledCritters[i]["tar2"],
      "internal_prop" : shuffledCritters[i]["internal_prop"],
      "selected" : $('#cell' + i).css('border') == '2px solid rgb(255, 0, 0)' ? "true" : "false"      
    })
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
    // "structure_instruct",
    // "wait_room",
    // "welcome_critterLand",
    // "chatRoom",
    // "test_critters",
    // "structure_instruct",
    // "wait_room",
    // "welcome_critterLand",
    // "chatRoom",
    // "test_critters",
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
