// -------
// DRAWING
// -------
var drawProgressBar = function(roundNum, numRounds, slideNum, numSlides) {
    // Change Progress Value
    $("#progress_bar").css( "width", ((roundNum * 1.0 * numSlides + slideNum) / (numRounds * numSlides)) * 100 + "%");
    
    // Make Visible
    $("#progress_component").removeClass("hidden");
}

var drawWaitingRoom = function(message, game) {
    // First clear all values and make visible
    $("#wait_room_header").empty();
    $("#wait_room_slide").removeClass("hidden");
    game.currentSlide[game.my_role] = "wait_room_slide";

    // Set blinking message
    $("#wait_room_header").append(message);  
    setInterval(function() {
        $("#wait_room_header").fadeOut(1000);
        $("#wait_room_header").fadeIn(1000);
    }, 2000);
};

var drawRoundNumber = function(roundNum, game) {
    // Draw progress bar
    drawProgressBar(roundNum, game.numRounds, 1, 8);
    
    // Set text & enable button
    $("#round_slide_header").empty();
    $("#round_slide_header").html("<br> <br>")
    $("#round_slide_header").append(
        "Entering Round " + "<b>" + parseInt(roundNum + 1) + "</b>" + " of " + game.numRounds +
        "<br> <br>" +
        "Press Continue to begin the round."
    );
    $("#round_slide_continue_button").prop("disabled", false);

    // Make visible
    game.currentSlide[game.my_role] = "round_slide";    
    $("#round_slide").removeClass("hidden");
};

var drawTrainInstructions = function(game, speciesName, pluralSpeciesName) {
    // Set instructions text and enable button
    if (game.my_role === "explorer") {
        $("#train_instructions_slide_header").html(
            `    
                <br><br>
                <h3>Instructions</h3>
                <br>
                <p>
                    You are the "Explorer", studying creatures with a ` + speciesName + ` detector.
                    <br> <br>
                    You will be shown a grid of creatures. Click on a creature to discover whether it is a ` + speciesName + `.
                    Pay close attention, as you will have to teach your partner which are ` + pluralSpeciesName + `. 
                    <br> <br>
                    Press Continue to start the game.
                    <br><br>
                </p>
            `
        );
    } else {
        $("#train_instructions_slide_header").html(
            `
                <br><br>
                <h3>Instructions</h3>
                <br>
                <p>
                    You are the "Student". Your partner is currently studying creatures with a ` + speciesName + ` detector. It will take them approximately 1 - 2 minutes to finish exploring. 
                    <br> <br>
                    Meanwhile you will be waiting in a chatroom. Once your partner is done, they will enter the chatroom. You should discuss what properties of ` + pluralSpeciesName + ` they learned during exploration. Pay close attention and ask questions, as you will be tested on your understanding of ` + pluralSpeciesName + `.
                    <br> <br>
                    During your partner's exploration period please stay at the computer and <b>DO NOT CLOSE THIS TAB</b>. Otherwise, you will be disconnected from the game and we won't be able to reward you for the hit.
                    Please keep checking the chat window, as the status will update when the other player has also entered the room.
                    <br> <br> 
                    Press Continue to join the chatroom.
                    <br> <br> 
                </p>
            `
        )
    }

    // Make visible
    game.currentSlide[game.my_role] = "train_instructions_slide";
    $("#train_instructions_slide_continue_button").prop("disabled", false);
    $("#train_instructions_slide").removeClass("hidden");
};

var drawTrainCreatures = function(game, speciesName) {
    // Clear previous
    $("#train_creatures_slide_header").empty();
    $("#train_creatures_slide_grid").empty();

    // Draw creatures
    $("#train_creatures_slide_header").html(
        `
            <p class="label_prompt">
                Click on each creature to discover whether or not it is a <strong>` + speciesName +`</strong>.
                <br>
                Study them carefully.
            </p>
        `
    );
    drawCreaturesTable(game.trialInfo.train, speciesName, 5, true, game.roundProps);

    // Make visible
    game.currentSlide[game.my_role] = "train_creatures_slide";    
    $("#train_creatures_slide_continue_button").hide();
    $("#train_creatures_slide_continue_button").prop("disabled", true);
    $("#train_creatures_slide").removeClass("hidden");
};

var drawExplorerChatInstructions = function(game, speciesName) {
    // Set instructions
    var instructions = 
    `
        <br>
        <br>
        On the next page, you will enter into a chatroom with your partner, the "student".
        <br>
        <br>
        Please discuss the properties of the ` + speciesName + ` creatures. The "student" will be advance the game out of the chatroom, once they feel like they have a good understanding of the properties of the  ` + speciesName + ` species.
        <br>
        <br>
        After the chatroom, you both will be provided a set of unseen creatures that you must classify as belonging to the  ` + speciesName + ` species or not. Your bonus will be the sum of your score and your partner's score on this task.
        <br>
        <br>
    `;
    $("#chat_instructions_slide_header").html(instructions);

    // Make visible
    game.currentSlide[game.my_role] = "chat_instructions_slide";        
    $("#chat_instructions_slide_continue_button").prop("disabled", false);
    $("#chat_instructions_slide").removeClass("hidden");
}

var drawChatRoom = function(game) {
    // Clear
    $("#messages").empty();

    // Default disabled
    $("#chat_room_side_continue_button").prop("disabled", true);

    // Make button visible only if user is the student
    if (game.my_role === "student") {
        $("#chatCont").show();
    } else {
        $("#chatCont").hide();       
    }
    $("#chat_room_slide").removeClass("hidden");
    game.currentSlide[game.my_role] = "chat_room_slide";            
};

var drawTestInstructions = function(game, speciesName) {
    var instructions = `
        <br><br>
        <h3>Quiz</h3>
        <br>
        You will be presented a grid. Click on the creatures you believe belong to the  ` + speciesName + ` species.  Press Continue to start the quiz.
        <br> <br>
    `;
    $("#test_instructions_slide_header").html(instructions);
    $("#test_instructions_slide_continue_button").prop("disabled", false);
    $("#test_instructions_slide").removeClass("hidden");
    game.currentSlide[game.my_role] = "test_instructions_slide";                
};

var drawTestCreatures = function(game, speciesName, pluralSpeciesName) {
    // Clear previous
    $("#test_creatures_slide_header").empty();
    $("#test_creatures_slide_grid").empty();

    var instructions = `
        <p class="label_prompt"> Click on the creatures that you believe are members of the <strong>` + speciesName + `</strong> species.
        <br>
        Creatures that you have selected as ` + pluralSpeciesName + ` will have a yellow background.
        <br>      
        You can click on a selected creature a second time to un-select it.
        <br>
        Once you are done selecting the ` + pluralSpeciesName + `, hit the Continue button.
        </p>
    `
   $("#test_creatures_slide_header").html(instructions);

   drawCreaturesTable(game.trialInfo.test, speciesName, 5, false, game.roundProps);
   
    // Make visible
    $("#test_creatures_slide_continue_button").prop("disabled", false);
    $("#test_creatures_slide").removeClass("hidden");
    game.currentSlide[game.my_role] = "test_creatures_slide";    
};

var drawRoundScoreReport = function(game) {
    $("#round_score_report_continue_button").prop("disabled", false);
    $("#round_score_report_slide").removeClass("hidden");
    game.currentSlide[game.my_role] = "round_score_report_slide";        
};

var drawTotalScoreReport = function(game) {
    $("#total_score_report_continue_button").prop("disabled", false);
    $("#total_score_report_slide").removeClass("hidden");
    game.currentSlide[game.my_role] = "total_score_report_slide";            
};

var drawSubjInfo = function(game) {
    $("#subj_info").removeClass("hidden");
};

var drawThanks = function(game) {
    $("#thanks").removeClass("hidden");
    game.currentSlide[game.my_role] = "thanks";    
}

// -------
// CLEAR
// -------
var clearProgressBar =  function(game) {
    $("#progress_component").addClass("hidden");
}

var clearWaitingRoom = function() {
    $("#wait_room_slide").addClass("hidden");
};

var clearRoundNumber = function() {
    $("#round_slide").addClass("hidden");
    $("#round_slide_continue_button").prop("disabled", true);
};

var clearTrainInstructions = function() {
    $("#train_instructions_slide").addClass("hidden");
    $("#train_instructions_slide_continue_button").prop("disabled", true);
};

var clearTrainCreatures = function() {
    $("#train_creatures_slide").addClass("hidden");
    $("#train_creatures_slide_continue_button").prop("disabled", true);
};

var clearExplorerChatInstructions = function() {
    $("#chat_instructions_slide").addClass("hidden");    
    $("#chat_instructions_slide_continue_button").prop("disabled", true);
};

var clearChatRoom = function() {
    $("#chat_room_slide").addClass("hidden");
    $("#chat_room_slide_continue_button").prop("disabled", true);
};

var clearTestInstructions = function() {
    $("#test_instructions_slide").addClass("hidden");
    $("#test_instructions_slide_continue_button").prop("disabled", true);
};

var clearTestCreatures = function() {
    $("#test_creatures_slide").addClass("hidden");
    $("#test_creatures_slide_continue_button").prop("disabled", true);
};

var clearRoundScoreReport = function() {
    $("#round_score_report_slide").addClass("hidden");
    $("#round_score_report_continue_button").prop("disabled", true);
};

var clearTotalScoreReport = function() {
    $("#total_score_report_slide").addClass("hidden");
    $("#total_score_report_continue_button").prop("disabled", true);
};

var clearSubjInfo = function() {
    $("#subj_info").addClass("hidden");
};
