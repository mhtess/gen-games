// --------------------------------------------------------------------
// draw.creatures.js
// Author: Sahil Chopra
// Date: December 21, 2018
// Goal: Helper functions utilized in drawing creatures for 
//       multiplayer game 6.
// --------------------------------------------------------------------

function drawCreaturesTable(creatures, speciesName, numCols, train, roundProps) {
    // Draw a table of creatures in a grid of numCols columns
    var numRows = Math.ceil(creatures.length / numCols);
    var table = "<table class='creatures_table'>";
    var creatureInd = 0;

    for(var i = 0; i < numRows; i++) {
        table += "<tr>";
        for(var j = 0; j < numCols; j++) {
            if (creatureInd >= creatures.length) break;
            if (train === true){
                table += "<td class='train_creature_cell' id='train_cell_" + creatureInd + "'\">";
            } else {
                table += "<td class='test_creature_cell' id='test_cell_" + creatureInd + "'\">";
            }
            if (train === true) {
                table += "<svg class='creature_svg' id='train_creature_" + creatureInd + "'>" +
                    "</svg></td>";       
            } else {
                table += "<svg class='creature_svg' id='test_creature_" + creatureInd + "'>" +
                "</svg></td>";         
            }
            creatureInd += 1;
        }
        table += "</tr>";
    }
    table += "</table>";
  
    // Append table to appropriate table
    if (train === true) {
        $("#train_creatures_slide_grid").append(table);
    } else {
        $("#test_creatures_slide_grid").append(table);
    }

    // Draw the creatures
    for (var i = 0; i < creatures.length; i++) {
        var scale = 0.75;
        var c = creatures[i];
        if (train === true) {
            var cell_id = "#train_cell_" + i;
            $(cell_id).attr("belongs_to_concept", c.belongs_to_concept);
        }
        if (train) drawTrainCreature(c, speciesName, i, creatures.length, scale, roundProps);
        else drawTestCreature(c, i, scale, roundProps);
    }
  }
  
  function drawTrainCreature(stim, speciesName, creatureInd, num_creatures, scale, roundProps){
    // Draw Creature
    var id = "train_creature_" + creatureInd;
    Ecosystem.draw(stim.creature, stim.props, id, scale);
  
    // Construct Label
    var label = "";
    if (stim.belongs_to_concept) {  
        label = "<div class='species-label' id='train_cell_" + creatureInd + "_label'>" + speciesName + "</div>";
    } else {
        label = "<div class='species-label' id='train_cell_" + creatureInd + "_label'> </div>";
    }
    $(label).insertAfter("#" + id);
  
    // Add Click Handlers to Creature's Table Cell
    $("#train_cell_" + creatureInd).click(function(event) {
        var event_id = event.target.id;
        var creature_id_prefix = "train_creature_";
        var cell_id_prefix = "train_cell_";
        var id = "#train_cell_" + creatureInd;

        // Visualize Changes (Post-Click)
        darken(id);
        showSpeciesIndicator(id, speciesName);
  
        if (!roundProps.selected_train_stim.includes(id)) {
            // Clicked Creature Not Previously Selected
            roundProps.selected_train_stim.push(id);
            if (roundProps.selected_train_stim.length === num_creatures) {
                // Show "Continue" button -- exploration complete
                $("#train_creatures_slide_continue_button").prop("disabled", false);
                $("#train_creatures_slide_continue_button").show();

                alert(
                    "Exploration Complete! " +
                     "Please take a moment to review your findings before continuing to the chatroom."
                );
            }
        }
    });
  }
  
function drawTestCreature(stim, creatureInd, scale, roundProps){
    // Draw Creature
    var id = "test_creature_" + creatureInd;
    Ecosystem.draw(stim.creature, stim.props, id, scale);
  
    // Add Click Handlers to Creature's Table Cell
    $("#test_cell_" + creatureInd).click(function(event) {
        var id = "#test_cell_" + creatureInd;
        if (roundProps.selected_test_stim.includes(id)) {
            // Remove Previously Marked Creature
            unmarkAsSpecies(id);
            roundProps.selected_test_stim.splice(
                roundProps.selected_test_stim.indexOf(id),
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
  
function showSpeciesIndicator(id, speciesName) {
    var labelID = id + "_label";
    $(labelID).css("visibility", "visible");
  
    if ($(id).attr("belongs_to_concept") === "true")
        $(id).css({"border":"2px dashed black"});
}
  
function markAsSpecies(id) {
    $(id).css({"background-color":"yellow"});
}
  
function unmarkAsSpecies(id) {
    $(id).css({"background-color":"transparent"});
}
