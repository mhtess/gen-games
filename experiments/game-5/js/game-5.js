// ---------------------------------------
// Game 5 Code
// See Readme for Experiment Description
// ---------------------------------------

// --------------------------
// Slide Creation & Rendering
// --------------------------

function render_prev_sets(prev_sets, one_table) {
  if (one_table) {
    $("#prev_sets").append(`<H4>Previous Examples: </H4>`);
    var all_items = [];
      for (var i = 0; i < prev_sets.length; i++) {
        all_items = all_items.concat(prev_sets[i]);
      } 
      render_prev_set(1, all_items, 6);
  } else {
     for (var i = 0; i < prev_sets.length; i++) {
        $("#prev_sets").append(`<H4>Example: ${i+1} </H4>`);
        render_prev_set(i, prev_sets[i], prev_sets[i].length);
      }  
  }

}

function mark(id) {
  $('#' + id).parent().css({"border":'2px solid black'});
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function render_prev_set(set_num, set, table_width) {
  var rows = Math.ceil(set.length / table_width);
  var cols = table_width;

  var table = "<table>";
  var ind = 0;
  for(var i=0; i <rows; i++) {
    table += "<tr>";
    for(var j=0; j<cols; j++) {
      table += "<td>";
      if (ind >= set.length) break;
      table += "<table class ='cell' id='cell" + ind + "'\">";

      table += "<td>";
      table += "<svg id='" + "set" + set_num + "_critter" + ind +
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
  $("#prev_sets").append(table);

  for (var i = 0 ; i < set.length; i++) {
    var scale = 0.5;
    var stim = set[i];
    var id = "set" + set_num + "_critter" + i;
    Ecosystem.draw(
      stim.critter, stim.props,
      id, scale
    );
    if (stim.belongs_to_concept) {
      mark(id);
    }
  }
}

function render_curr_set(set) {
  var rows = 1;
  var cols = set.length;

  var table = "<table>";
  for(var i=0; i <rows; i++) {
    table += "<tr>";
    for(var j=0; j<cols; j++) {
      table += "<td>";
      var ind = i * cols + j;
      table += "<table class ='cell' id='cell" + ind + "'\">";

      table += "<td>";  
      table += "<svg id='critter" + ind +
        "' style='max-width:150px;max-height:150px\'></svg>";

      table += "<br><br><form id='critter_form" + ind + "' class='critter_label_form'>";
      table += "<input type='radio' name='belongs_to_concept' id='t' value=true> <label for='t'>Yes</label>";
      table += "<input type='radio' name='belongs_to_concept' id='f' value=false> <label for='f'>No</label>";   
      table += "</form></td>";

      table += "<tr>";
      table += "<div class='critname' id='cell" + ind + "critname'></div></tr>";
      table += "</table>";
      table += "</td>";
      
    }
    table += "</tr>"
  }
  table += "</table>";
  $("#curr_set").append(table);

  for (var i = 0 ; i < cols; i++) {
    var scale = 0.5;
    var stim = set[i];
    var id = "critter" + i;
    Ecosystem.draw(
      stim.critter, stim.props,
      id, scale
    );
  }
}

function make_slides(exp) {
  var slides = {};

  slides.i0 = slide({
     name : "i0",
     start: function() {
      exp.startT = Date.now();
     }
  });

  slides.instructions = slide({
    name : "instructions",
    button : function() {
      exp.go(); // use exp.go() if and only if there is no "present" data.
    },
  });

  slides.concept = slide({
    name: "concept",
    present: exp.allCreatures[exp.concept_number],
    trial_num: 0,
    start: function() {
      this.prev_sets = []
    },

    present_handle : function(stim) {
      // hide + disable stuff
      $(".err").hide();
      $("#prev_sets").empty();
      $("#curr_set").empty();
      $('#continueButton').prop('disabled', false);

      // Render slide
      $(".set_number").text("Item " + String(this.trial_num + 1) + " of " + String(exp.num_trials));
      render_prev_sets(this.prev_sets, true);
      render_curr_set(stim);
      this.stim = stim;

      // Time Markers
      this.start_time = Date.now()
      this.trial_num++;
      this.prev_sets.push(stim);
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
        var i = 0;
        $(".critter_label_form").each(function () {
            var turker_label = $("input[type=radio]:checked", this).val() == "true";
            if (turker_label != stim[i]['belongs_to_concept']) correct_answer = false;
            i +=1 ;
        });


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
    },

    log_responses : function(){
      var labels = [];
      $(".critter_label_form").each(function () {
          labels.push($('input[name=belongs_to_concept]:checked', this).val() === "true");
      });
      exp.trials.push({
          "concept_number" : exp.concept_number,
          "trial_num" : this.trial_num,
          "time_in_seconds" : this.time_spent/1000,
          "labels": labels,
        });
    }
  });

  slides.concept_explanation = slide({
    name : "concept_explanation",
    button : function() {
      console.log($("#concept").val());
      if (!$("#concept_text").val()) {
        alert("Please enter your description of the wudsy species");
      } else {
        exp.go(); // use exp.go() if and only if there is no "present" data.
      }
    },
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
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.thanks = slide({
    name : "thanks",
    start : function() {
      exp.data= {
          "trials" : exp.trials,
          "system" : exp.system,
          "question": exp.question,
          "distribution": JSON.stringify(exp.distribution),          
          "subject_information" : exp.subj_data,
          "time_in_minutes" : (Date.now() - exp.startT)/60000
      };
      setTimeout(function() {turk.submit(exp.data);}, 1000);
    }
  });

  return slides;
}

// -----------------
// Initialize Game
// -----------------
function init() {
  // Ensure that a Turker cannot play the game more than once
  var checkDuplicateTurker = function(){
       var ut_id = "sc-gengame5-20180120";
       if (UTWorkerLimitReached(ut_id)) {
         $('.slide').empty();
         repeatWorker = true;
         alert("You have already completed the maximum number of HITs allowed by this requester. Please click 'Return HIT' to avoid any impact on your approval rating.");
       }
  };
  checkDuplicateTurker();

  // General system information for the player
  exp.system = {
      Browser : BrowserDetect.browser,
      OS : BrowserDetect.OS,
      screenH: screen.height,
      screenUH: exp.height,
      screenW: screen.width,
      screenUW: exp.width
    };

  // Define trials
  exp.trials = [];

  // Expriment slide structure
  exp.structure=[
    "i0",
    "instructions",
    "concept",
    "concept_explanation",
    'subj_info',
    'thanks'
  ];


  // Load critters for the game
  exp.allCreatures = {
    1: easy_rule_data, // Easy Concept Critter Sets
    2: medium_rule_data, // Medium Concept Critter Sets
    3: hard_rule_data, // Hard Concept Critter Sets
  }
  exp.concept_number = 1;
  exp.num_trials = exp.allCreatures[exp.concept_number].length;

  // Generate the slides for the game
  exp.slides = make_slides(exp);
  $('.slide').hide(); //hide everything


  // Make sure turkers have accepted HIT or that user is not on MTurk Page
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
