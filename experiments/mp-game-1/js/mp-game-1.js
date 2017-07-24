var prev = null;

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
   $('#'+ el.id+'internalprop').css({'opacity': 0.5})

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

function make_slides(f) {
  var   slides = {};
  slides.i0 = slide({
    name : "i0",
    start: function() {
    exp.startT = Date.now();
    }
  });

  slides.instructions = slide({
    name : "instructions",
    start: function(){
      globalGame.socket.send("enterSlide.instructions.");
    },
    button : function() {
      exp.go(); //use exp.go() if and only if there is no "present" data.
    },
  });

  slides.wait_room = slide({
    name: "wait_room",
    start: function() {
      console.log('start of wait_room')
      globalGame.socket.send("enterSlide.wait_room.");
      $(".err").hide();
      $("#waitCont").hide();
      globalGame.socket.send("enterWaitRoom.");
    }
  });

  slides.welcome_critterLand = slide({
    name : "welcome_critterLand",
    crittersFromServer : "",
    start : function(stim) {
      this.start_time = Date.now()
      globalGame.socket.send("enterSlide.welcome_critterLand.");
      this.stim = stim;
      $(".critname").hide();
      $(".err").hide();
      $("#learning_button").hide();
      allCreatures = this.crittersFromServer;
      var shuffledCritters = _.shuffle(allCreatures)

      this.num_creats = allCreatures.length;

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
            $('#internalprops_instruct').html("Click on each critter to discover whether it lays eggs or not.");
            if (shuffledCritters[i]["internal_prop"]) {
              $('#cell'+i+'internalprop').html("&#x1F423;"); //hatching chick
            }
            break;
           case 'bug':
            $('#internalprops_instruct').html("Click on each critter to discover whether it is poisonous.")
            if (shuffledCritters[i]["internal_prop"]) {
              $('#cell'+i+'internalprop').html("&#x1f480"); //skull sign
            }
            break;
        }
        $('#cell'+i+'internalprop').css({'opacity': 0});

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
      }
      exp.go(); // use exp.go() if and only if there is no "present" data.

    },
  });

slides.test_instructs = slide({
  name: "test_instructs",
  start: function() {
    // switch statements based on which critters are being shown
    $('#test_cond').html("On the next slide, you will choose the ")
  },
  button : function() {
    exp.go();
  },
});

slides.test_critters = slide({
 name : "test_critters",

 crittersFromServer : "",

 start : function() {

   this.start_time = Date.now()
   globalGame.socket.send("enterSlide.test_critters.");
   $(".err").hide();
   allCreatures = this.crittersFromServer;
   var shuffledCritters = _.shuffle(allCreatures)
   console.log(allCreatures)
   this.num_creats = allCreatures.length;

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
   allCreatures = [];

   for (var i = 0; i < this.num_creats; i++) {
     $('#critter' + i).empty();
     $('#cell' + i).css({'opacity': '1'});
     $('#cell' + i).css({'border': ''});
     $('#creature_table').remove();
     prev = null;
   }

       exp.go(); // use exp.go() if and only if there is no "present" data.

     },
   });


slides.condition = slide({
  name: "condition",
  start : function() {
    globalGame.socket.send("enterSlide.condition.");
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

slides.robertPage = slide({
  name: "robertPage",
  start: function() {
    $("#chatCont").hide();
    $('#messages').empty();
    console.log('start of robert page')
    globalGame.socket.send("enterSlide.chatRoom.");
    globalGame.socket.send("enterChatRoom.");
    $(".err").hide();
    $('#waiting').show();
  }
});

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

slides.thanks = slide({
  name : "thanks",
  start : function() {
    globalGame.socket.send("enterSlide.thanks.");
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
  allCreatures = [];
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
    "instructions",
    "wait_room",
    "welcome_critterLand",
    "robertPage",
    "test_instructs",
    "test_critters",
  // "robertPage",
    // "condition",
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

  exp.data_trials = [];
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
