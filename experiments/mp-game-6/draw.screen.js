// -------
// DRAWING
// -------
var drawProgressBar = function(roundNum, numRounds) {
    // Change Progress Value
    $("#progress_bar").css( "width", (roundNum * 1.0 / numRounds) * 100 + "%");
    
    // Make Visible
    $("#progress_component").removeClass("hidden");
}

var drawWaitingRoom = function(message) {
    // First clear all values and make visible
    $("#wait_room_header").empty();
    $("#wait_room_slide").removeClass("hidden");

    // Set blinking message
    $("#wait_room_header").append(message);  
    setInterval(function() {
        $("#wait_room_header").fadeOut(1000);
        $("#wait_room_header").fadeIn(1000);
    }, 2000);
};

var drawRoundNumber = function(roundNum, game) {
    // Draw progress bar
    drawProgressBar(roundNum, game.numRounds);
    
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
    $("#train_instructions_slide_continue_button").prop("disabled", false);
    $("#train_instructions_slide").removeClass("hidden");
};

var drawTrainCreatures = function(game, speciesName) {
    $("#train_creatures_slide_header").html(
        `
            <p class="label_prompt">
                Click on each one to discover whether or not it is a <strong>` + speciesName +`</strong>.
                <br>
                Study them carefully.
            </p>
        `
    );

    // Draw creatures
    drawCreaturesTable(game.trialInfo.train, "wud", 5, true, game.roundProps);

    // Make visible
    $("#train_creatures_slide_continue_button").hide();
    $("#train_instructions_slide_continue_button").prop("disabled", true);
    $("#train_creatures_slide").removeClass("hidden");
};

var drawChatInstructions = function(game) {
    var instructions = `<p class="label_prompt">
        Click on each one to discover whether or not it is a <strong>` + speciesName +`</strong>.
        <br>
        Study them carefully.
        </p>
    `
  $("#training_critters").html(instructions);
}

var drawChatRoom = function(game) {

};

var drawTestInstructions = function(game) {

};

var drawTestCreatures = function(game) {

};

var drawRoundScoreReport = function(game) {

};

var drawTotalScoreReport = function(game) {

};

var drawSubjInfo = function(game) {

};

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

};

var clearChatInstructions = function() {

};

var clearChatRoom = function() {

};

var clearTestInstructions = function() {

};

var clearTestCreatures = function() {

};

var clearRoundScoreReport = function() {

};

var clearTotalScoreReport = function() {

};

var clearSubjInfo = function() {

};