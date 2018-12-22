// --------------------------------------------------------------------
// draw.creatures.js
// Author: Sahil Chopra
// Date: December 21, 2018
// Goal: Helper functions utilized in drawing creatures for 
//       multiplayer game 6.
// --------------------------------------------------------------------

function drawCreaturesTable(creatures, numCols, train, roundProps) {
    // Draw a table of creatures in a grid of numCols columns
    var numRows = Math.ceil(creatures.length / numCols);
    var table = "<table>";
    var creatureInd = 0;

    for(var i = 0; i < numRows; i++) {
        table += "<tr>";
        for(var j = 0; j < cols; j++) {
            table += "<td>";
            if (creatureInd >= creatures.length) break;
            if (train === true){
                table += "<table class='train_creature_cell' id='train_cell_" + creatureInd + "'\">";
            } else {
                table += "<table class='test_creature_cell' id='test_cell" + creatureInd + "'\">";
            }
            table += "<td>";
            if (train === true) {
                table += "<svg class='creature_svg' id='train_creature" + creatureInd + "'>" +
                    "</svg></td>";       
            } else {
                table += "<svg class='creature_svg' id='test_creature" + creatureInd + "'>" +
                "</svg></td>";         
            }
            table += "<tr>";
            table += "</table>";
            table += "</td>";
            creatureInd += 1;
        }
      table += "</tr>";
    }
    table += "</table>";
  
    // Draw the creatures
    for (var i = 0; i < creatures.length; i++) {
        var scale = 0.5;
        var c = creatures[i];
        if (train) drawTrainCreature(c, i, scale, roundProps);
        else drawTestCreature(c, i, scale, roundProps);
    }

    // Append table to appropriate table
    if (train === true) {
        $("#train_creatures_grid").append(table);
    } else {
        $("#test_creatures_grid").append(table);
    }

  }
  
  function drawTrainCreature(stim, creatureInd, scale, roundProps){
    // Draw Creature
    var id = "train_creature" + creatureInd;
    Ecosystem.draw(stim.critter, stim.props, id, scale);
  
    // Construct Label
    var label = "";
    if (stim.belongs_to_concept) {  
        label = "<div class='species-label' id='train_cell_" + creatureInd + "_label'>" + globalGame.speciesName + "</div>";
    } else {
        label = "<div class='species-label' id='train_cell_" + creatureInd + "_label'> </div>";
    }
    $(label).insertAfter("#" + id);
  
    // Add Click Handlers to Creature's Table Cell
    $("#train_cell_" + creatureInd).click(function(event) {
        var event_id = event.target.id;
        var critter_id_prefix = "train_creature";
        var cell_id_prefix = "train_cell_";
        var id = "";
  
        if (event_id.creatureIndexOf(critter_id_prefix) >= 0 )
            id = "#train_cell_" + event_id.substring(critter_id_prefix.length);
        else
            id = "#" + $(event.target).parents(".cell")[0].id;
  
        // Visualize Changes (Post-Click)
        darken(id);
        showSpeciesIndicator(id);
  
        if (!roundProps.selected_train_stim.includes(id)) {
            // Clicked Creature Not Previously Selected
            roundProps.selected_train_stim.push(id);
    
            if (roundProps.selected_train_stim.length == roundProps.train_creatures.length) {
                // Show "Continue" button -- exploration complete
                $("#train_creatures_button").css("visibility", "visible");
                $("#train_creatures_button").prop("disabled", false);

                alert("Exploration Complete! Please take a moment to review your findings \
                        before continuing to the chatroom.");

                var time = Date.now();
                roundProps.times.timestamps.train.end.exploration.push(time);
                roundProps.times.timestamps.train.start.submission.push(time);
            }
        }
    });
  }
  
function drawTestCreature(stim, creatureInd, scale, roundProps){
    // Draw Creature
    var id = "test_creature" + creatureInd;
    Ecosystem.draw(stim.critter, stim.props, id, scale);
  
    // Add Click Handlers to Creature's Table Cell
    $("#test_cell" + creatureInd).click(function(event) {
        var id = "#" + $(event.target).parents(".cell")[0].id;
        if (roundProps.selected_test_stim.includes(id)) {
            // Remove Previously Marked Creature
            unmarkAsSpecies(id);
            roundProps.selected_test_stim = roundProps.selected_test_stim.slice(
                roundProps.selected_test_stim.creatureIndexOf(id),
                1
            );
        } else {
            // Mark Creature
            markAsSpecies(id);
            roundProps.selected_test_stim.push(id);
        }
    });
}
  
function darken(id) {
    $(id).css({"opacity": 1.0});
}
  
function showSpeciesIndicator(id) {
    var labelID = id + "_label";
    $(labelID).css("visibility", "visible");
  
    if ($(id).text().creatureIndexOf(globalGame.speciesName) >= 0)
        $(id).css({"border":"2px dashed black"});
}
  
function markAsSpecies(id) {
    $(id).css({"background-color":"yellow"});
}
  
function unmarkAsSpecies(id) {
    $(id).css({"background-color":"transparent"});
}