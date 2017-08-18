// var converter = require("color-convert");

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

totalCritNum = 0;

// Puts the critters we have in a table so we can use borders to our advantage
function create_table(rows, cols, display_type) { //rows * cols = number of exemplars
  var table = "<table id='creature_table' cellspacing='20'>";
  totalCritNum = rows*cols;
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

  check(totalCritNum);
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



// -- added by MHT July 2017
var genColor = function(color, variance) {
  function shuffle(v) { newarray = v.slice(0);for(var j, x, i = newarray.length; i; j = parseInt(Math.random() * i), x = newarray[--i], newarray[i] = newarray[j], newarray[j] = x);return newarray;} // non-destructive.
  var n = 10; // this is the default in ecosystem.js see line 12
  if (color == null) {
    var h = [];
    //var h = .5;
    var offset = Math.random() * .99 / n;
      for (var i=0;i<n-1;i++) {
        h.push((i/n)+offset);
      }
      h = shuffle(h);
      h = h.shift();
     var s = uniformAroundMean(.99, .1);
     var v = uniformAroundMean(.99, .1);
   //var s = 100;
    //var v = 100;
    // color = converter.hsv.hex(h, s, v);
    color = Raphael.hsb2rgb(hue, saturation, value).hex;
  }
  else {
    color = myColor(color, variance);

  }

  return color;
};

var fillArray = function(n, fillVal){
  return Array(n).fill(fillVal)
}

var probToCount = function(p, n){
  return Math.round(p*n);
}

var flip = function(p){
  return p > Math.random()
};

var generateAttentionQuestion = function(){
  return this.flip(0.5) ? "tar1" : "tar2"
};

var randProp = function() {return Math.random();};
var uniform = function(a, b) { return ( (Math.random()*(b-a))+a ); }
var uniformAroundMean = function(mean, radius) {
    // var upper = Math.min(0.99, mean+radius);
    // var lower = Math.max(0.01, mean-radius);
    var upper = mean+radius;
    var lower = mean-radius;
    return uniform(lower, upper);
};

var myColor = function(mean, variance) {
    //console.log("myColor");
    var hVar;
    var sVar;
    var vVar;
    if (variance == null) {
        hVar = 0.01;
        sVar = 0.1;
        vVar = 0.1;
    } else if (variance < 1) {
        hVar = 0.1 * variance;
        sVar = 1 * variance;
        vVar = 1 * variance;
    } else {
        hVar = 0.1 * variance;
        sVar = 0.1 * variance;
        vVar = 0.1 * variance;
    }
    var c = Raphael.color(mean);
    var hue = Ecosystem.uniformAroundMean(c.h, hVar);
    var saturation = Ecosystem.uniformAroundMean(c.s, sVar);
    var value = Ecosystem.uniformAroundMean(c.v, vVar);
    var newColor = Raphael.hsb2rgb(hue, saturation, value);
    return newColor.hex;

    // when you can require('color-converter'), which I think is only possible using node
    // var c = converter.hex.hsv(mean);
    // var hue = uniformAroundMean(c[0], hVar);
    // var saturation = uniformAroundMean(c[1], sVar);
    // var value = uniformAroundMean(c[2], vVar);
    // var newColor = converter.hsv.hex(hue, saturation, value);
    // return  "#" + newColor;
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}




function score(correctAnswer, selectedAnswer){
  if(correctAnswer && selectedAnswer=='1'){
    hits++;
    return 'hit';
  }
  else if(!correctAnswer && selectedAnswer=='1'){
    falseAlarms++;
    return 'falseAlarm';
  }
  else if(correctAnswer && selectedAnswer=='0'){
    misses++;
    return 'miss';
  }
  else if(!correctAnswer && selectedAnswer=='0'){
    correctRejections++;
    return 'correctRejection';
  }
}

function scoreSingle(correctAnswer, selectedAnswer){
  if(correctAnswer && selectedAnswer=='1'){
    return 'hits';
  }
  else if(!correctAnswer && selectedAnswer=='1'){
    return 'falseAlarms';
  }
  else if(correctAnswer && selectedAnswer=='0'){
    return 'misses';
  }
  else if(!correctAnswer && selectedAnswer=='0'){
    return 'correctRejections';
  }
}

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


