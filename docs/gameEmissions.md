##### Event
- Trigger
  - Command

## Emanates from `mp-game.js` file

1. `globalGame.socket.send("enterSlide.instructions.")`
- When either user enters a new slide there is a `.send`
  - In `start` fn’s on important slides
  - in `game.server.js`: `onMessage()`
    - Update `gc.currentSlide` for current role
    
2. `p.player.instance.emit("enterWaitRoom", {})`
- When both players are in the wait room
  - in `slides.wait_room` in `start()`
  - in `game.server.js`: `onMessage()`
    - For each player: `p.player.instance.emit("enterWaitRoom", {})`
  - in `game.client.js`: `customSetup(game)`
    - Show “Connected” in the tab of the player who got to the wait room first; move both players to the next slide

3. `globalGame.socket.send("logTrain.learnCritters." + {data})` 
- After all the critters are generated and the player clicks to complete the learning slide
  - in `slides.learning_critters` on `button()` call
  - in `game.server.js`: `dataOutput`
    - Organize and flatten data
    - Collect data to the `logTrain` key in the `dataOutput` object

4. `globalGame.socket.send("logTest.testCritters." + {data})` 
- After a player selects the critters in the test phase and hits continue
  - in `slides.test_critters` on `button()` call
  - in `game.server.js`: `dataOutput`
    - Organize and flatten data
    - Collect data to the `logTest` key in the `dataOutput` object

5. `globalGame.socket.send("sendingTestScores." + globalGame.my_role + "." + {data})`
  - in `slides.test_critters`, on `button()` call
  - in `game.server.js`: `onMessage()`
    - Push `{data}` to `gc.testScores` for that player
    - For each player: `p.player.instance.emit("sendingTestScores", gc.testScores)`
  - in `game.client.js`: `game.socket.on('sendingTestScores', fn)`
    - if this is the second time this is called (because the slower player has completed test):
      - Compute each player's score for that round (e.g., hits + correct rejections)
      - Display each player's score in client's html

6. `globalGame.socket.send("logScores.score_report." + _.pairs(blockScores).join('.'));` 
- After all the individual critter scores from the test phase are done being sent
  - in `slides.test_critters` on `button()` call
  - in `game.server.js`: `dataOutput`
    - Organize and flatten data
    - Collect data to the `logScores` key in the `dataOutput` object

7. `globalGame.socket.send("enterChatRoom.");`
   Client: 
- When a player enters the chatroom
  - in `slides.chatRoom` on `start()`
  - in `game.server.js`: `onMessage()`
    - Emit `chatWait` until both are in the chatroom (see #13)
  - in `game.client.js`: `customSetup(game)`
    - Allow message sending when both players have sent `enterSlide.chatRoom`; 
    - Hide the waiting message

8. `globalGame.socket.send("calculatingReward.")`
- When player moves to subject info screen
  - in `slides.subj_info` on `start()`
  - in `game.server.js`: `onMessage()`
    - For each player: `p.player.instance.emit("calculatingReward",{})`
  - in `game.client.js`: `customSetup(game)`
    - Calculate the total reward and console.log it

9. `globalGame.socket.send("logSubjInfo.subjInfo." + _.pairs(encodeData(exp.subj_data)).join('.'));` 
- When a player hits submit on their subject info survey
  - in `slides.subj_info` on `submit(e)`
  - in `game.server.js`: `dataOutput`
    - Organize and flatten data
    - Collect data to the `logSubjInfo` key in the `dataOutput` object

## Only between server and client js files
10. `p.player.instance.emit("exitChatRoom", dataPacket)`
- When playerB clicks the chatroom continue button
  - in `game.server.js`: `onMessage()`
    - in `clickedObj` (chat continue)
      - For each player: `p.player.instance.emit("exitChatRoom", dataPacket)`
        - Move to the next slide and collect data to packet
  - in `game.client.js`: `customSetup(game)`
    - update critters from server for the upcoming test critters and next learning critters; and update `roundNum`

11. `p.player.instance.emit('newRoundUpdate', {user: client.userid});` 
- When playerB clicks the chatroom continue button
  - in `game.server.js`: `onMessage()`
    - in `clickedObj` (chat continue)
      - For each player: `p.player.instance.emit('newRoundUpdate', {user: client.userid});`
  - in `game.client.js`: `customSetup(game)`
    - Clear chatboxes, update round number

12. `p.player.instance.emit( 'playerTyping', {typing: message_parts[1]});` 
- When a player is typing into the chatbox
  - in `game.server.js`: `onMessage()`
    - Put "other player is typing" on other's chatbox

13. `p.player.instance.emit( 'chatMessage', {user: client.userid, msg: msg});});` 
- When a player sends a message
  - in `game.server.js`: `onMessage()`
    - Only allow the message to be sent if both players are in the room

14. `target.instance.emit("chatWait", {})`
- Only one player is in the chatroom
  - in `game.client.js`: `customSetup(game)`
    - Ensure one player can’t type into the chatroom; show wait message

15. `globalGame.socket.send("clickedObj.");` 
- When playerB continues out of the chatroom
  - in `game.client.js`: `buttonClickListener(evt)`
    - Update `roundNum` and the data packet
