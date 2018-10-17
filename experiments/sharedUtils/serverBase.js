var utils = require(__base + 'sharedUtils/sharedUtils.js');
global.window = global.document = global;

class ReferenceGameServer {
  constructor(expName) {
    this.expName = expName;
    this.core = require([__base, expName, 'game.core.js'].join('/')).game_core;
    this.player = require([__base, expName, 'game.core.js'].join('/')).game_player;
    this.customServer = require([__base, expName, 'game.server.js'].join('/'));
    this.setCustomEvents = this.customServer.setCustomEvents;

    // Track ongoing games
    this.games = {};
    this.game_count = 0;

    if (this.expName === 'mp-game-5') {
      this.numGamesPerRule = {
        "0": 2,
        "1": 2,
        "2": 2,
        "3": 2,
        "4": 2,
        "5": 2,
        "6": 2,
        "7": 2,
        "8": 2,
        "9": 2,
      }
    }
  }

  startGame (game) {
      game.newRound();
  }

  writeData (client, eventType, message_parts) {
    // Writes data specified by experiment instance to csv and/or mongodb
    var output = this.customServer.dataOutput;
    var game = client.game;
    if(_.has(output, eventType)) {
      var dataPoint = _.extend(output[eventType](client, message_parts), {eventType});
      if(_.includes(game.dataStore, 'csv'))
	      utils.writeDataToCSV(game, dataPoint);
      if(_.includes(game.dataStore, 'mongo'))
	      utils.writeDataToMongo(game, dataPoint);
    }
  }

  onMessage (client, message) {
    var message_parts = message.split('.');
    this.customServer.onMessage(client, message);
    if(!_.isEmpty(client.game.dataStore)) {
      this.writeData(client, message_parts[0], message_parts);
    }
  }

  multipleTrialResponses(client, data) {
    if (this.customServer.multipleTrialResponses !== undefined) {
      // Wrapping in condtional to prevent crashing in older
      // games that did not implement this interface.
      var output = this.customServer.multipleTrialResponses(client, data);
      var sharedInfo = output['info'];
      var trials = output['trials'];
      var game = client.game;

      if(!_.isEmpty(client.game.dataStore)) {
        trials.forEach(function(trial) {
          var dataPoint = _.extend(trial, {'eventType': 'logTest'}, sharedInfo);
          if(_.includes(game.dataStore, 'csv'))
            utils.writeDataToCSV(game, dataPoint);
          if(_.includes(game.dataStore, 'mongo'))
            utils.writeDataToMongo(game, dataPoint);
        });
      }
    }
  }

  findGame (player) {
    this.log('looking for a game. We have : ' + this.game_count);
    var joined_a_game = false;
    for (var gameid in this.games) {
      var game = this.games[gameid];
      if(game.player_count < game.players_threshold) {
      	// End search
        joined_a_game = true;

        // Add player to game
        game.player_count++;
        game.players.push({
          id: player.userid,
          instance: player,
          player: new this.player(game, player)
        });

        // Add game to player
        player.game = game;
        player.role = game.playerRoleNames.role2;
        player.send('s.join.' + game.players.length + '.' + player.role);

        // notify existing players that someone new is joining
        _.map(game.get_others(player.userid), function(p){
          p.player.instance.send( 's.add_player.' + player.userid);
        });

        // Start game
        this.startGame(game);
      }
    }

    // If you couldn't find a game to join, create a new one
    if(!joined_a_game) {
      this.createGame(player);
    }
  };

  // Will run when first player connects
  createGame (player) {
    // Create a new game instance
    console.log("Creating a Game!!!")

    var options = {
      expName: this.expName,
      server: true,
      id : utils.UUID(),
      player_instances: [{id: player.userid, player: player}],
      player_count: 1
    };

    if (this.expName === 'mp-game-3' || this.expName === 'mp-game-5') {
      for (const rule_idx of Object.keys(this.numGamesPerRule)) {
        if (this.numGamesPerRule[rule_idx] !== 0) {
          options.rule_idx = parseInt(rule_idx);
          this.numGamesPerRule[rule_idx] -= 1;
          break;
        }
      }
    }

    var game = new this.core(options);

    // Assign a role to the player
    player.game = game;
    player.role = game.playerRoleNames.role1;
    player.send('s.join.' + game.players.length + '.' + player.role);
    this.log('player ' + player.userid + ' created a game with id ' + player.game.id);

    // Add game to collection
    this.games[game.id] = game;
    this.game_count++;
    game.server_send_update();
    return game;
  };

  // we are requesting to kill a game in progress.
  // This gets called if someone disconnects
  endGame (gameid, userid) {
    var thegame = this.games[gameid];

    if(thegame) {
      // TODO: Figure out how to refactor this as a method override
      // so that this not break gameplay in other games, as this is shared code.

      // Continue game, if one player disconnected by finishing the game
      if ((thegame.currentSlide.explorer == 'thanks' && thegame.currentSlide.student != 'thanks') ||
          (thegame.currentSlide.explorer != 'thanks' && thegame.currentSlide.student == 'thanks')
        ){
        this.log("One player disconnected, after finishing the game.");
      } else { // Kill the game if one player disconnected without completing the game
        _.map(thegame.get_others(userid),function(p) {
          p.player.instance.send('s.end');
        });
        delete this.games[gameid];
        this.game_count--;
        this.log('game removed. there are now ' + this.game_count + ' games' );
        if (this.expName === 'mp-game-3' && (thegame.currentSlide.explorer !== 'thanks' || thegame.currentSlide.student !== 'thanks')) {
          this.numGamesPerRule[thegame.rule_idx] += 1;
          this.log('failed to complete a game with rule ' + thegame.rule_idx + " ; incrementing the count for this game type");
          this.log(this.numGamesPerRule);
        }
      }
    } else {
      this.log('that game was not found!');
    }
  };

  // A simple wrapper for logging so we can toggle it, and augment it for clarity.
  log () {
    console.log.apply(this,arguments);
  };
};

module.exports = ReferenceGameServer;
