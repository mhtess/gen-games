var utils = require(__base + 'sharedUtils/sharedUtils.js');
global.window = global.document = global;

class ReferenceGameServer {
    constructor(expName, isProd) {
        this.expName = expName;
        this.isProd = isProd;
        this.core = require([__base, expName, 'game.core.js'].join('/')).game_core;
        this.player = require([__base, expName, 'game.core.js'].join('/')).game_player;
        this.customServer = require([__base, expName, 'game.server.js'].join('/'));
        this.setCustomEvents = this.customServer.setCustomEvents;

        // Track ongoing games
        this.games = {};
        this.game_count = 0;

        if (expName == 'mp-game-5') {
            // Track rule indices
            this.rule_by_round = [10, 11, 12, 13, 14];

            // Pilot 1:
            // options.possibleSpecies = ['wudsy', 'morseth', 'kwep', 'zorb', 'luzak'];
            // options.possibleSpeciesPlural = ['wudsies', 'morseths', 'kweps', 'zorbs', 'luzaks'];
            
            //   Pilot 2:
            this.possibleSpecies = ['dorb', 'jav', 'lorch', 'grink', 'thup'];
            this.possibleSpeciesPlural = ['dorbs', 'javs', 'lorchs', 'grinks', 'thups'];
        } else if (expName == 'mp-game-6') {
            // Connect to Mongo
            const mongoCreds = require(__base + 'auth.json');
            const mongoURL = `mongodb://${mongoCreds.user}:${mongoCreds.password}@localhost:27017/`;
            // const mongoURL = `mongodb://localhost:27017/`;
            utils.mongoConnectWithRetry(mongoURL, 2000, (connection) => {
                this.connection = connection;
            });

            // Load all files
            var file_path = __base + 'mp-game-6/stimuli/fifty_rules/';
            this.train_stimuli = {};
            this.test_stimuli = {};
            var concept_rule_summary = require(file_path + 'concept_summary.json');
            for (var key in concept_rule_summary) {
                if (concept_rule_summary.hasOwnProperty(key)) {
                    var name = concept_rule_summary[key]['name'];
                    this.train_stimuli[name] = require(file_path + 'train/' + name + '.json');
                    this.test_stimuli[name] = require(file_path + 'test/' + name + '.json');
                }
            }

        }
    };

    log() {
        // A simple wrapper for logging so we can toggle it, and augment it for clarity.
        console.log.apply(this,arguments);
    };

    findGame(player) {
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

                game.startTime = new Date();

                // Add game to player
                player.game = game;
                player.role = game.playerRoleNames.role2;
                player.send('s.join.' + game.players.length + '.' + player.role);

                // Notify existing players that someone new is joining
                _.map(game.get_others(player.userid), function(p){
                    p.player.instance.send( 's.add_player.' + player.userid);
                });

                // Start game
                game.server_send_update();
                if (game.experimentName === 'mp-game-6') {
                    game.newRound();
                }
            }
        }

        if(!joined_a_game) {
            // If you couldn't find a game to join, create a new one
            this.createGame(player, this.isProd);
        }
    };

    createGame (player) {
        // Instantiate the game
        var options = {
            expName: this.expName,
            server: true,
            id : utils.UUID(),
            player_instances: [{id: player.userid, player: player}],
        };
        if (this.expName === 'mp-game-5') {
            options.rule_by_round = this.rule_by_round;
            options.possibleSpecies = this.possibleSpecies;
            options.possibleSpeciesPlural = this.possibleSpeciesPlural;
        } else if (this.expName === 'mp-game-6') {
            options.train_stimuli = this.train_stimuli;
            options.test_stimuli = this.test_stimuli;
            options.connection = this.connection;
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

    endGame (gameid, userid) {
        var game = this.games[gameid];
        if(game) {
            _.map(game.get_others(userid),function(p) {
                p.player.instance.send('s.end');
            });
            delete this.games[gameid];
            this.game_count--;
            this.log('game removed. there are now ' + this.game_count + ' games' );
        } else {
            this.log('that game was not found!');
        }
    };

    onMessage (client, message) {
        // Split incoming message into constituent parts
        // and then write data to CSV / Mongo DB
        var messageParts = message.split('.');
        this.customServer.onMessage(client, message);
        if(!_.isEmpty(client.game.dataStore)) {
            this.writeData(client, messageParts[0], messageParts);
        }
    };

    writeData (client, eventType, messageParts) {
        // Writes data specified by experiment instance to csv and/or mongodb
        var output = this.customServer.dataOutput;
        var game = client.game;
        if(_.has(output, eventType)) {
        var dataPoint = _.extend(output[eventType](client, messageParts), {eventType});
        if(_.includes(game.dataStore, 'csv'))
            utils.writeDataToCSV(game, dataPoint);
        if(_.includes(game.dataStore, 'mongo'))
            utils.writeDataToMongo(game, dataPoint);
        }
    };

    multipleTrialResponses(client, data) {
        console.log("MultipleTrialResponses");
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
    };
};

module.exports = ReferenceGameServer;
