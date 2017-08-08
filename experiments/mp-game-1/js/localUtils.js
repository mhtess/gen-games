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
    $('#'+ el.id + 'critname').css({'opacity': 1, 'font-weight': 'bold', 'font-size': '14px'});
    $("#"+ el.id + 'internalprop').css({'opacity': 1});
    $('#'+el.id+'internalprop').css({'opacity': 1})}
    $('#'+el.id).attr("data-selected","1")

    otherEls.map(function(cell){$('#'+cell).css({"border":'2px solid white',
      'background-color': 'white'})})
    check(allCreatures.length);
}

// same as above but able to highlight multiple for the test trials
function mark_critter_test_display(el, otherEls) {
  if(el.style.border=='2px solid white'){
    $('#'+el.id).css({"border":'2px solid red',
      'background-color': 'white','opacity': '1'});
    $('#'+el.id).attr("data-selected",'1')
  } else {
    $('#'+el.id).css({"border":'2px solid white',
      'background-color': 'white'});
    $('#'+el.id).attr("data-selected",'0')
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
     if($('#cell' + i).attr("data-selected")=='1'){
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
      table += "<table class ='cell' id='cell" + ind + "' data-selected='0' style='border:2px solid white' onclick=\"mark_" + display_type +"(cell" + ind +",";
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
