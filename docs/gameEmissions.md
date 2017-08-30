##### Event
- Trigger
  - Command

## Emanates from `mp-game.js` file

1. **Update `gc.currentSlide`**
- When either user enters a new slide there is a `.send`
  - In each of the `start` fn’s on important slides
  - e.g. `globalGame.socket.send("enterSlide.instructions.")`

2. ##### Collect data to the `logTrain` key in the `dataOutput` object
- After all the critters are generated and the player clicks to complete the learning slide
  - `globalGame.socket.send("logTrain.learnCritters." + {data})`

3. ##### Collect data to the `logTest` key in the `dataOutput` object
- After a player selects the critters in the test phase and hits continue
  - `globalGame.socket.send("logTest.testCritters." + {data})`

4. ##### Server: add the total score to `gc.testScores` for that player
    ##### Client: create the score reports for the players
- Has total scores for current player and is sent after test phase is finished
  - `globalGame.socket.send("sendingTestScores." + globalGame.my_role + "." + {data})`

5. ##### Collect data to the `logScores` key in the `dataOutput` object
- After all the individual critter scores from the test phase are done being sent
  - `globalGame.socket.send("logScores.score_report." + _.pairs(blockScores).join('.'));`

6. ##### Server: show wait message until both are in the chatroom
  ##### Client: Allow message sending when both players have sent `enterSlide.chatRoom`; the waiting message is hidden
- When a player enters the chatroom
  - `globalGame.socket.send("enterChatRoom.");`

7. ##### Server: ensure what happens below happens for both players
    ##### Client: calculates the total reward and console.logs it
- When player moves to subject info screen
  - `globalGame.socket.send("calculatingReward.")`

8. ##### Collect data to the `logSubjInfo` key in the `dataOutput` object
- When a player hits submit on their subject info survey
  - `globalGame.socket.send("logSubjInfo.subjInfo." + _.pairs(encodeData(exp.subj_data)).join('.'));`

## Only between server and client js files
9. ##### Server: Move to the next slide and collect data to packet
    ##### Client: update `crittersFromServer` and `roundNum`
- When playerB clicks the chatroom continue button
  - `p.player.instance.emit("exitChatRoom", dataPacket)`

10. ##### Clear chatboxes, update round number
- When playerB clicks the chatroom continue button
  - `p.player.instance.emit('newRoundUpdate', {user: client.userid});`

11. ##### Put "other player is typing" on other's chatbox
- When a player is typing into the chatbox
  - `p.player.instance.emit( 'playerTyping', {typing: message_parts[1]});`

12. ##### Server: only allow the message to be sent if both players are in the room
- When a player sends a message
  - `p.player.instance.emit( 'chatMessage', {user: client.userid, msg: msg});});`

13. ##### Client only: ensure one player can’t type into the chatroom; show wait message
- Only one player is in the chatroom
  - `target.instance.emit("chatWait", {})`

14. ##### Client only: show “Connected” in the tab of the player who got to the wait room first; move both players to the next slide
- When both players are in the wait room
  - `p.player.instance.emit("enterWaitRoom", {})`

15. ##### Update `roundNum` and the data packet
- When playerB continues out of the chatroom
  - `globalGame.socket.send("clickedObj.");`
