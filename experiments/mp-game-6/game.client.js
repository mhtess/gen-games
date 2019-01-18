//   Copyright (c) 2012 Sven "FuzzYspo0N" Bergström,
//                 2013 Robert XD Hawkins
//   Written by : http://underscorediscovery.com
//   Written for : http://buildnewgames.com/real-time-multiplayer/
//   Modified for collective behavior experiments on Amazon Mechanical Turk
//   MIT Licensed.

// ----------------
// GLOBAL VARIABLES
// ----------------
var globalGame = {},
    enterScoreReport = 0,
    timeout = 1000 * 60 * 15 // 15 minutes,
    timeoutIndex = 0,
    originalTitle = document.title,
    flashConnected = false;

// ----------------
// EVENT HANDLERS
// ---------------
// Procedure for creating a new player, upon joining a globalGame
var client_onjoingame = function(num_players, role) {
  console.log("Inside client_onjoingame");

  // Set player role
  globalGame.my_role = role;
  globalGame.get_player(globalGame.my_id).role = globalGame.my_role;

  // Create player
  _.map(_.range(num_players - 1), function(i){
    globalGame.players.unshift({id: null, player: new game_player(globalGame)});
  });

  // Set 15 minute timeout only for first player...
  if(num_players == 1) {
    this.timeoutID = setTimeout(function() {
      if(_.size(this.urlParams()) == 4) {
        this.submitted = true;
        window.opener.turk.submit(this.data, true);
        window.close();
     } else {
       console.log("would have submitted the following :");
       console.log(this.data);
     }
   }, timeout);
  }
};

// Procedure for handling updates from server.
// Note: data holds the server's copy of variables.
var client_onserverupdate_received = function(data){
    if(data.players) {
        _.map(_.zip(data.players, globalGame.players),function(z){
            z[1].id = z[0].id;
        });
    }

    console.log(data);

    // Copy game parameters to local globalGame
    globalGame.start_time = data.gs;
    globalGame.players_threshold = data.pt;
    globalGame.player_count = data.pc;
    globalGame.roundNum = data.roundNum;
    globalGame.numRounds = data.numRounds;
    globalGame.trialInfo = data.trialInfo;
    globalGame.isProd = data.isProd;
    globalGame.id = data.id;

    // update data object on first round, don't overwrite (FIXME)
    if(!_.has(globalGame, 'data')) {
        globalGame.data = data.dataObj;
    }
};

// Procedure for parsing messages from server.
var client_onMessage = function(data) {
  var commands = data.split('.');
  var command = commands[0];
  var subcommand = commands[1] || null;
  var commanddata = commands[2] || null;

  switch(command) {
    case 's': //server message
    switch(subcommand) {
      
      case 'end' : // Redirect to exit survey only if it is not the last round
        if(globalGame.roundNum < globalGame.numRounds || globalGame.numRounds == null) {
            $("#" + globalGame.currentSlide[globalGame.my_role]).addClass("hidden");
            clearProgressBar();
            onDisconnect();
            console.log("received end message...");
        }
        break;

      case 'alert' : // Not in database, so you can't play...
        alert('You did not enter an ID');
        window.location.replace('http://nodejs.org'); break;
      
      case 'join' : // Game join request
        var num_players = commanddata;
        client_onjoingame(num_players, commands[3]); break;
      
      case 'add_player' : // New player joined... Need to add them to our list.
        console.log("adding player" + commanddata);
        console.log("cancelling timeout");
        clearTimeout(globalGame.timeoutID);
        globalGame.players.push({id: commanddata, player: new game_player(globalGame)}); break;
    }
  }
};


var customSetup = function(globalGame) {
    // customSetup is automatically triggered by window.on_load()
    // in the shared clientBase.js code

    // Initial setup -- draw the waiting room.
    drawWaitingRoom("Waiting for another player to join the game ...", globalGame);
    globalGame.socket.send("enterSlide.wait_room_slide.")

    // --------------
    // Click Handlers
    // --------------

    $("#round_slide_continue_button").click(function(){
        clearRoundNumber();
        drawProgressBar(globalGame.roundNum, globalGame.numRounds, 2, 8);
        globalGame.socket.send("enterSlide.train_instructions_slide.");
        drawTrainInstructions(globalGame, globalGame.trialInfo.speciesName, globalGame.trialInfo.pluralSpeciesName);
    });

    $("#train_instructions_slide_continue_button").click(function() {
        clearTrainInstructions();
        if (globalGame.my_role === "explorer") {
            drawProgressBar(globalGame.roundNum, globalGame.numRounds, 3, 8);
            globalGame.socket.send("enterSlide.train_creatures_slide.");
            drawTrainCreatures(globalGame, globalGame.trialInfo.speciesName);    

            // Start Time
            globalGame.roundProps[globalGame.my_role]['times']['train']['start'] = new Date();

        } else {
            globalGame.socket.send("enterSlide.chat_room_slide."); 
            drawProgressBar(globalGame.roundNum, globalGame.numRounds, 5, 8); 
            globalGame.socket.send("enterChatRoom.");
            drawChatRoom(globalGame);
        }
    });

    $("#train_creatures_slide_continue_button").click(function(){
        // End Time
        globalGame.roundProps[globalGame.my_role]['times']['train']['end'] = new Date();
        globalGame.roundProps[globalGame.my_role]['duration']['train'] = (
            globalGame.roundProps[globalGame.my_role]['times']['train']['end'] -
            globalGame.roundProps[globalGame.my_role]['times']['train']['start']
        ) / 1000.0;

        clearTrainCreatures();
        drawProgressBar(globalGame.roundNum, globalGame.numRounds, 4, 8);
        globalGame.socket.send("enterSlide.chat_instructions_slide.");           
        drawExplorerChatInstructions(globalGame, globalGame.trialInfo.speciesName);
    });

    $("#chat_instructions_slide_continue_button").click(function(){
        clearExplorerChatInstructions();
        drawProgressBar(globalGame.roundNum, globalGame.numRounds, 5, 8);
        globalGame.socket.send("enterSlide.chat_room_slide.");
        globalGame.socket.send("enterChatRoom.");
        drawChatRoom(globalGame);

        // Start Time
        globalGame.roundProps[globalGame.my_role]['times']['chat']['start'] = new Date();
    });

    $("#chat_room_slide_continue_button").click(function(){
        drawProgressBar(globalGame.roundNum, globalGame.numRounds, 6, 8);
        globalGame.socket.send("proceedToTestInstructions.");
    });

    $("#test_instructions_slide_continue_button").click(function(){
        clearTestInstructions();
        drawProgressBar(globalGame.roundNum, globalGame.numRounds, 7, 8);
        globalGame.socket.send("enterSlide.test_creatures_slide.");
        drawTestCreatures(globalGame, globalGame.trialInfo.speciesName, globalGame.trialInfo.pluralSpeciesName);

        // Start Time
        globalGame.roundProps[globalGame.my_role]['times']['test']['start'] = new Date(); 
    });

    $("#test_creatures_slide_continue_button").click(function() {
        // Prompt turker whether they are ready to proceed
        var proceed = confirm(
            "Have you selected all the creatures that believe that belong to the species?\n\n" +
            "If yes, click \"OK\".\n If no, click \"CANCEL\"."
        );
        if (proceed === false) {
          return;
        }

        // End Time
        globalGame.roundProps[globalGame.my_role]['times']['test']['end'] = new Date();
        globalGame.roundProps[globalGame.my_role]['duration']['test'] = (
            globalGame.roundProps[globalGame.my_role]['times']['test']['end'] -
            globalGame.roundProps[globalGame.my_role]['times']['test']['start']
        ) / 1000.0;

        // Summary of of times
        roundTimes = {
            'train': -1,
            'test': globalGame.roundProps[globalGame.my_role]['duration']['test'],
            'chat': globalGame.roundProps[globalGame.my_role]['duration']['chat'],
        };

        if (globalGame.my_role === "explorer") {
            roundTimes.train = globalGame.roundProps[globalGame.my_role]['duration']['train'];
        }

        // Measure performance & log selections 
        var roundSelections = [];
        var roundSummary = {
            hits: 0,
            misses: 0,
            correct_rejections: 0,
            false_alarms: 0,
            score: 0,
        }
        for (var i = 0; i < globalGame.trialInfo.test.length; i++) {
            var stim = globalGame.trialInfo.test[i];
            var true_label = stim.belongs_to_concept;
            var turker_label = globalGame.roundProps.selected_test_stim.includes("#test_cell_" + i);
            var is_correct = (turker_label === true_label);

            // Track turker's choice
            roundSelections.push({
                "stim_num" : i,
                "turker_label": turker_label,
                "true_label": true_label,
                "is_correct": is_correct,
            });

            // Update round summary
            if (turker_label === false && true_label === false) {
                roundSummary.correct_rejections++;
            } else if (turker_label === false && true_label === true){
                roundSummary.misses++;
            } else if (turker_label === true && true_label === false) {
                roundSummary.false_alarms++;
            } else {
                roundSummary.hits++;
            }
        }
        var playerScore = roundSummary.hits - roundSummary.false_alarms;
        roundSummary.score = playerScore > 0 ? playerScore : 0;

        // local copy of scores
        globalGame.roundSelections.push(roundSelections);
        globalGame.roundSummaries.push(roundSummary);

        // Transmit performance info to server
        var roundTimesJSON = _.toPairs(encodeData(roundTimes)).join('.');
        globalGame.socket.send("logTimes.Complete." + roundTimesJSON);
        console.log(roundTimesJSON);        

        var roundSelectionsObj= {
            "trials": roundSelections,
        }
        globalGame.socket.emit("multipleTrialResponses", roundSelectionsObj);
        
        var roundSummaryJSON = _.toPairs(encodeData(roundSummary)).join('.');
        globalGame.socket.send("logScores.TestCreatures." + roundSummaryJSON);
        globalGame.socket.send("sendingTestScores." + roundSummaryJSON);

        // Enter wait room until other user has completed quiz/test
        clearTestCreatures();
        globalGame.socket.send("enterSlide.wait_room_slide.")
        drawProgressBar(globalGame.roundNum, globalGame.numRounds, 8, 8);
        drawWaitingRoom("Waiting for the your partner to catch up ...", globalGame);
    });

    $("#round_score_report_continue_button").click(function(){
        clearRoundScoreReport();
        globalGame.socket.send("enterSlide.wait_room_slide.");
        globalGame.socket.send("newRoundUpdate.");
        drawWaitingRoom("Waiting for your partner to catch up", globalGame);
    });

    $("#total_score_report_continue_button").click(function(){
        clearTotalScoreReport();
        globalGame.socket.send("enterSlide.subj_info");
        drawSubjInfo();
    });

    $("#subj_info_button").click(function(){
        // Submit info
        var subjData = {
            nativeEnglish : $("#nativeEnglish").val(),
            enjoyment : $("#enjoyment").val(),
            assess : $('#assess').val(),
            age : $("#age").val(),
            gender : $("#gender").val(),
            education : $("#education").val(),
            comments : $("#comments").val(),
            problems: $("#problems").val(),
            fairprice: $("#fairprice").val(),
            strategy: $("#strategy").val(),
            humanPartner: $("#human").val(),
            likePartner: $("#likePartner").val()
        };
        globalGame.socket.send("logSubjInfo.subjInfo." + _.toPairs(encodeData(subjData)).join('.'));

        // Move to thanks slide
        onDisconnect();
        globalGame.socket.send("enterSlide.thanks");
        clearSubjInfo();
        drawThanks(globalGame);

        var finalData = {
            "game_id": globalGame.id,
            "role": globalGame.my_role,
            "round_selections": globalGame.roundSelections,
            "subject_information" : subjData,
            "time_in_minutes" : (Date.now() - globalGame.startTime)/60000,
            "round_summaries": globalGame.roundSummaries,
            "bonus": globalGame.totalScore * globalGame.bonusAmt,
        }

        if(_.size(globalGame.urlParams()) == 4) {
            window.opener.turk.submit(finalData, true);
            window.close();
        } else {
            console.log("would have submitted the following :")
            console.log(finalData);
        }
        
    });

    // ---------------
    // Socket Handlers
    // ---------------

    globalGame.socket.on('newRoundUpdate', function(data){
        clearWaitingRoom();
        globalGame.socket.send("enterSlide.round_slide.") 
        drawRoundNumber(data, globalGame);

        // local
        globalGame.roundProps = {
            selected_train_stim: [],
            selected_test_stim: [],
            explorer: {
                "duration": {},
                "times": {
                    "train": {},
                    "test": {},
                    "chat": {},
                },
            },
            student: {
                "duration": {},
                "times": {
                    "train": {},
                    "test": {},
                    "chat": {},
                },
            }
        };
    });

    // One player has not yet made it to the chatroom, so sending messages is impossible
    globalGame.socket.on('chatWait', function(data){
        $('#chatbox').attr("disabled", "disabled");

        // Pretty Animation (Fade In / Out)
        globalGame.blinking_wait = setInterval(function() {
            $("#chat_room_slide_status").fadeOut(1000);
            $("#chat_room_slide_status").fadeIn(1000);
        });
        $("#chat_room_slide_status").show();
    });

    // Both players are now in the chatroom, so they may send messages
    // the waiting message is therefore now hidden
    globalGame.socket.on("enterChatRoom", function(data){
        console.log("enterChatRoom")
        flashConnected = true;

        $("#chatbox").removeAttr("disabled");
        $("#chat_room_slide_status").show();
        $("#chat_room_slide_status").html("<div id='chat_room_slide_status'><p style='color:green;'>Chatroom has connected with your partner!  <br>You may begin messaging!</p></div>");
    
        newMsg = "Connected!"
        function step() {
            document.title = (document.title == originalTitle) ? newMsg : originalTitle;
            if (flashConnected === true) {
                timeoutIndex = setTimeout(step, 500);
            } else {
                document.title = originalTitle;
            }
        };
        step();

        if(globalGame.my_role === "student") {
            $("#chat_room_slide_continue_button").prop("disabled", false);
            // Start Time
            globalGame.roundProps[globalGame.my_role]['times']['chat']['start'] = new Date();
        }
    });

    globalGame.socket.on('exitChatRoom', function(data) {
        // End Time
        globalGame.roundProps[globalGame.my_role]['times']['chat']['end'] = new Date();
        globalGame.roundProps[globalGame.my_role]['duration']['chat'] = (
            globalGame.roundProps[globalGame.my_role]['times']['chat']['end'] -
            globalGame.roundProps[globalGame.my_role]['times']['chat']['start']
        ) / 1000.0;

        flashConnected = false;
        clearChatRoom();
        globalGame.socket.send("enterSlide.test_instructions_slide.")  
        drawTestInstructions(globalGame);
    });

    // Creates the score reports for the players
    globalGame.socket.on('sendingTestScores', function(data){
        enterScoreReport++;
        // only works when both players have reached this, then it generates scores for both players
        if(enterScoreReport % 2 == 0){ //hacky way to handle error thrown when only one player finishes the test
            globalGame.socket.send("enterSlide.round_score_report_slide.");
            var my_role = globalGame.my_role;
            var partner_role = my_role === "explorer" ? "student" : "explorer"
            for(var i=0; i<2; i++){
                var score_role, role_index;
                if(i==0){
                    score_role="your";
                    role_index=my_role;
                } else if(i==1){
                    score_role="other";
                    role_index=partner_role;
                }

                var hits = Number(data[role_index][globalGame.roundNum].hits);
                var misses = Number(data[role_index][globalGame.roundNum].misses);
                var correctRejections = Number(data[role_index][globalGame.roundNum].correct_rejections);
                var falseAlarms = Number(data[role_index][globalGame.roundNum].false_alarms);
                var playerScore =  hits - falseAlarms;
                var positiveScore = playerScore > 0 ? playerScore : 0;
                $('#'+score_role+'_score').html(positiveScore);
                $('#'+score_role+'_hits').html("Correctly selected: " + hits+ " out of " + (hits + misses));
                $('#'+score_role+'_falseAlarms').html("Selected incorrectly: " + falseAlarms + " out of "+ (falseAlarms + correctRejections));
                $('#'+score_role+'_score').html("Round score: " + positiveScore);
            }

            clearWaitingRoom();
            drawRoundScoreReport(globalGame);
        }
    });

    globalGame.socket.on('totalScoreUpdate', function(data){
        clearWaitingRoom();
        globalGame.totalScore = data;
        globalGame.socket.send("enterSlide.total_score_report_slide.");
        $("#total_score").html(data);
        drawTotalScoreReport(globalGame);
    });
};

function encodeData(dataObj){
    var isNumeric = function(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    // Encode real numbers  
    return _.mapValues(dataObj, function(val, key) {
        if (isNumeric(val)) {
            if (Number.isInteger(val)) {
                return val.toString();
            } else {
                return val.toString().replace(".", "&");
            }
        } else {
            return val;
        }
    });
  }
