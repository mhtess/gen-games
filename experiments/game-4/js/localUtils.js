
var prev = null;
var ind = 0;
var cell_border_unclicked = '2px solid white';
var critname_fontweight_unclicked = 'normal';
var all_opacity_clicked = 1;
var cell_border_clicked = '2px solid red';
var critname_fontweight_unclicked = 'bold';
var cell_opacity_gray = '0.5';
var symbol_opacity_gray = '0.7';

//record score
var hits = 0;
var falseAlarms = 0;
var misses = 0;
var correctRejections = 0;

// Allows the border of each critter to be highlighted when chosed
function mark_critter_display(el) {
  if(prev != null){
    gray(prev);
  }
  prev = el;
  $('#'+el.id).css({"border":cell_border_clicked,
    'opacity': all_opacity_clicked});
  $('#'+ el.id + 'critname').css({'opacity': all_opacity_clicked, 'font-weight': critname_fontweight_unclicked});
  $('#'+el.id+'internalprop').css({'opacity': all_opacity_clicked});
  $('#'+el.id).attr("data-selected",'1'); //keeps track of whether cell was clicked at all in a given round, used in check function

  check(allCreatures.length);
}

// same as above but able to highlight multiple for the test trials
function mark_critter_test_display(el) {
  if($('#' + el.id).attr("data-selected")=='0'){
    $('#'+el.id).css({"border": cell_border_clicked,
      'opacity': all_opacity_clicked});
    $('#'+el.id).attr("data-selected",'1')
  } else {
    $('#'+el.id).css({"border": cell_border_unclicked});
    $('#'+el.id).attr("data-selected",'0')
  }
}

// grays out after clicked for learning phase
function gray(el) {
   $('#'+el.id).css({"border": cell_border_unclicked,
                    'opacity': cell_opacity_gray});
   $('#'+el.id+'critname').css({'opacity': cell_opacity_gray, 'font-weight': critname_fontweight_unclicked});
   $('#'+ el.id+'internalprop').css({'opacity': symbol_opacity_gray})
}

// checks if all cells were clicked in order to show learning continue button, used in learning trial
function check(num){
  var check_all = 0;
  for(var i=0; i<num; i++) {
     if($('#cell' + i).attr("data-selected")=='1'){
      ++check_all;
     }
  }
  if(check_all == num) {
    $("#learning_button").show();
  }
}



// Puts the critters we have in a table so we can use borders to our advantage
function create_table(rows, cols, display_type) { //rows * cols = number of exemplars
  var table = "<table id='creature_table' cellspacing='20'>";
  for(var i=0; i <rows; i++) {
    table += "<tr>";
    for(var j=0; j<cols; j++) {
      table += "<td>";
      ind = i * cols + j;
      table += "<table class ='cell' id='cell" + ind + "' data-selected='0' style='border:" + cell_border_unclicked + "' onclick=\"mark_" + display_type +"(cell" + ind +",";
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
      table += "<div class='critname' id='cell" + ind + "critname' style='float:center'></div>";
      table += "<td><div class='critname' id='cell" + ind + "internalprop' style='float: left'></div></td></div>";
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

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

// encode real numbers
function encodeData(dataObj){
  return _.mapObject(dataObj, function(val, key) {
      val.toString().replace(".", "&")
    })
}

// function score(correctAnswer, selectedAnswer){
//   if(correctAnswer && selectedAnswer=='1'){
//     hits++;
//     return 'hit';
//   }
//   else if(!correctAnswer && selectedAnswer=='1'){
//     falseAlarms++;
//     return 'falseAlarm';
//   }
//   else if(correctAnswer && selectedAnswer=='0'){
//     misses++;
//     return 'miss';
//   }
//   else if(!correctAnswer && selectedAnswer=='0'){
//     correctRejections++;
//     return 'correctRejection';
//   }
// }

// function scoreSingle(correctAnswer, selectedAnswer){
//   if(correctAnswer && selectedAnswer=='1'){
//     return 'hits';
//   }
//   else if(!correctAnswer && selectedAnswer=='1'){
//     return 'falseAlarms';
//   }
//   else if(correctAnswer && selectedAnswer=='0'){
//     return 'misses';
//   }
//   else if(!correctAnswer && selectedAnswer=='0'){
//     return 'correctRejections';
//   }
// }

// function calculateScore(){
//   return {
//     "hits" : hits,
//     "falseAlarms" : falseAlarms,
//     "misses" : misses,
//     "correctRejections" : correctRejections
//   }
// }

// function calculate_end_game_bonus(){
//     console.log(this.testScores)
//     console.log(this.bonusAmt)
//     var correctSelect = 0;
//     for(var i=0; i<this.numRounds; i++){
//       for (var j=0; j<2; j++){
//         var role_index = j == 0 ? "playerA" : "playerB";
//         correctSelect += this.testScores[role_index][i].hits + this.testScores[role_index][i].correctRejections;
//       }
//     }
//     var reward = correctSelect * this.bonusAmt;
//     console.log("reward is " + reward);
//     return reward;
    
//   }


