//--------
// Globals
// -------
var visible,
    isConnected = false;

//----------------------
// Connection to Server
// ---------------------
var onConnect = function(data) {
    console.log("on connect")
    isConnected = true;
    //The server responded that we are now in a game. Remember who we are
    this.my_id = data.id;
    this.players[0].id = this.my_id;
    this.urlParams = function() {
        var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) {
            return decodeURIComponent(s.replace(pl, " "));
        },
        query  = location.search.substring(1);
    
        var urlParams = {};
        while ((match = search.exec(query))) {
            urlParams[decode(match[1])] = decode(match[2]);
        }
        return urlParams;
    };
};


var onDisconnect = function(data) {
    if (isConnected) {
        // Redirect to exit survey
        console.log("Other user has exited the game.");
        var email = globalGame.email ? globalGame.email : "";

        var failMsg = [
            "<h3>Oops! It looks like your partner lost their connection!</h3>",
            "<p> Completing this survey will submit your HIT so you will still receive full ",
            "compensation.</p> <p>If you experience any problems, please email us (",
            email, ")</p>"].join("");

        if (globalGame.experimentName === 'mp-game-6') {
            if (globalGame.roundNum != globalGame.numRounds - 1) {
                $("#subj_info").prepend(failMsg);
                $("#subj_info").removeClass("hidden");
            }
        } else {
            if(globalGame.roundNum != globalGame.numRounds) {
                $("#subj_info").prepend(failMsg);
                $("#thanks").hide();            
            } 
        }
    }
    isConnected = false;
};


var sharedSetup = function(game) {
    // Associates callback functions corresponding to different socket messages
    game.socket = io.connect({reconnection: false});

    $("#chatbox").on("input", function() {
        // Tell server when client is typing...
        console.log("typing...");
        if($("#chatbox").val() != "" && !globalGame.sentTyping) {
            game.socket.send("playerTyping.true");
            globalGame.typingStartTime = Date.now();
            globalGame.sentTyping = true;
        } else if($("#chatbox").val() == "") {
            game.socket.send("playerTyping.false");
            globalGame.sentTyping = false;
        }
    });

    $("form").submit(function(){
        // Tell server when client submits a message from the chatbox
        var rawMsg = $("#chatbox").val();
        var timeElapsed = Date.now() - globalGame.typingStartTime;
        var msg = ["chatMessage", rawMsg.replace(/\./g, "~~~"), timeElapsed].join(".");
        if($("#chatbox").val() != "") {
            game.socket.send(msg);
            globalGame.sentTyping = false;
            $("#chatbox").val("");
        }
        return false;
    });

    game.socket.on("playerTyping", function(data){
        // Received message indicating that the other player is typing
        // so add a "player typing" message to this client's
        // chatbox
        if(data.typing == "true") {
            $("#messages")
                .append("<span class=\"typing-msg\">Other player is typing...</span>")
                .stop(true,true)
                .animate({
                    scrollTop: $("#messages").prop("scrollHeight")
                }, 800);
        } else {
            $(".typing-msg").remove();
        }
    });

    game.socket.on("chatMessage", function(data){
        // Received a message from the other player
        var otherRole = (
            globalGame.my_role === game.playerRoleNames.role1 ?
            game.playerRoleNames.role2 : game.playerRoleNames.role1
        );
        var source = data.user === globalGame.my_id ? "You" : "player " + otherRole;
        if (source !== "You"){
            // To bar responses until speaker has uttered at least one message
            globalGame.messageSent = true;
        }

        // Visualize new message (color, text, etc.)
        var col = source === "You" ? "#f47777" : "#c66f6f";
        $(".typing-msg").remove();
        $("#messages")
            .append($("<li style=\"padding: 5px 10px; background: " + col + "\">")
            .text(source + ": " + data.msg))
            .stop(true,true)
            .animate({
                scrollTop: $("#messages").prop("scrollHeight")
            }, 800);
    });


    // Initializing Game Properties
    game.startTime = Date.now();

    // When we connect, we are not "connected" until we have an id
    // and are placed in a game by the server. The server sends us a message for that.
    game.socket.on("connect", function(){}.bind(game));

    // Sent when we are disconnected (network, server down, etc)
    game.socket.on("disconnect", onDisconnect.bind(game));

    // Sent each tick of the server simulation. This is our authoritative update
    game.socket.on("onserverupdate", client_onserverupdate_received.bind(game));

    // Handle when we connect to the server, showing state and storing id's.
    game.socket.on("onconnected", onConnect.bind(game));

    // On message from the server, we parse the commands and send it to the handlers
    game.socket.on("message", client_onMessage.bind(game));

};


window.onload = function(){
    // When loading the page, we store references to our
    // drawing canvases, and initiate a game instance.
    console.log("window on load entered ...")
    globalGame = new game_core({server: false});
    sharedSetup(globalGame);
    customSetup(globalGame);
    globalGame.submitted = false;
};


function dropdownTip(data){
    // This gets called when someone selects something in the menu during the exit survey...
    // collects data from drop-down menus and submits using mmturkey
    var commands = data.split("::");

    switch(commands[0]) {
        case "human" :
            $("#humanResult").show();
            globalGame.data.subject_information = _.extend(globalGame.data.subject_information,
                                    {"thinksHuman" : commands[1]}); break;
    case "language" :
        globalGame.data.subject_information = _.extend(globalGame.data.subject_information,
                                {"nativeEnglish" : commands[1]}); break;
    case "partner" :
        globalGame.data.subject_information = _.extend(globalGame.data.subject_information,
                                {"ratePartner" : commands[1]}); break;
    case "confused" :
        globalGame.data.subject_information = _.extend(globalGame.data.subject_information,
                                {"confused" : commands[1]}); break;
    case "submit" :
        globalGame.data.subject_information = _.extend(
            globalGame.data.subject_information,
            {
                "comments" : $("#comments").val(),
                "strategy" : $("#strategy").val(),
                "role" : globalGame.my_role,
                "totalLength" : Date.now() - globalGame.startTime
            });
            globalGame.submitted = true;
            console.log("data is...");
            console.log(globalGame.data);
            if(_.size(globalGame.urlParams) == 4) {
                window.opener.turk.submit(globalGame.data, true);
                window.close();
            } else {
                console.log("would have submitted the following :")
                console.log(globalGame.data);
            }
            break;
    }
}

// Automatically registers whether user has switched tabs...
(
    function() {
        document.hidden = hidden = "hidden";

        // Standards:
        if (hidden in document)
            document.addEventListener("visibilitychange", onchange);
        else if ((hidden = "mozHidden") in document)
            document.addEventListener("mozvisibilitychange", onchange);
        else if ((hidden = "webkitHidden") in document)
            document.addEventListener("webkitvisibilitychange", onchange);
        else if ((hidden = "msHidden") in document)
            document.addEventListener("msvisibilitychange", onchange);
        else if ("onfocusin" in document)
            // IE 9 and lower:
            document.onfocusin = document.onfocusout = onchange;
        else
            window.onpageshow = window.onpagehide = window.onfocus = window.onblur = onchange;
    }
)();

function onchange (evt) {
    var v = "visible",
        h = "hidden",
        evtMap = {
            focus: v,
            focusin: v,
            pageshow: v,
            blur: h,
            focusout: h,
            pagehide:h
        };

    evt = evt || window.event;
    if (evt.type in evtMap)
        document.body.className = evtMap[evt.type];
    else
        document.body.className = evt.target.hidden ? "hidden" : "visible";

    visible = document.body.className;
    globalGame.socket.send("h." + document.body.className);
}

(
    function () {
        var original = document.title;
        var timeout;

        window.flashTitle = function (newMsg, howManyTimes) {
            function step() {
                document.title = (document.title == original) ? newMsg : original;
                if (visible === "hidden")
                    timeout = setTimeout(step, 500);
                else
                    document.title = original;
            }
            cancelFlashTitle(timeout);
            step();
        }

        window.cancelFlashTitle = function (timeout) {
            clearTimeout(timeout);
            document.title = original;
        }
    }
());