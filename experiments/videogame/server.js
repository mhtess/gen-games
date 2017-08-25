var express = require('express')
var app = express()
var fs = require('fs')
var vm = require('vm')
var moment = require('moment')

vm.runInThisContext(fs.readFileSync(__dirname + '/config.js'))
var use_db = configs.use_db
var time_to_play = configs.play_time
var exit_survey_url = configs.exit_survey_url

var getTimestamp = function(){
	var date = moment().format().slice(0, 10)
	var time = moment().format().slice(11, 19)
	return date + ' ' + time
}

try {
	var https = require('https')
	var port = configs.https_port
	var privateKey = fs.readFileSync(configs.private_key)
	var certificate = fs.readFileSync(configs.certificate)
	var credentials = {key: privateKey, cert: certificate}
	var server = https.createServer(credentials, app)
	var io = require('socket.io').listen(server)
} catch(err){
	console.log("HTTPS failed to launch -- falling back to HTTP")
	var http = require('http')
	var port = configs.http_port
	var server = http.createServer(app)
	var io = require('socket.io').listen(server)
}

if(use_db){
	var mysql = require('mysql')
	var database = require(__dirname + '/js/database')
	var connection = mysql.createConnection({
		host		: configs.mysql_host,
		user		: configs.mysql_user,
		password	: configs.mysql_password,
		database	: configs.mysql_password
	})
}

app.use(express.static(__dirname));

app.get(/^(.+)$/, function(req, res){ 
     console.log('static file request : ' + req.params);
     console.log("ACCESS: " + req.params[0])
     res.sendFile(__dirname + req.params[0])
 });

//namespace for assigning experiment parameters
var expnsp = io.of('/experiment-nsp')
expnsp.on('connection', function(socket){

	var assignCondition = function(){
		//code for determining the condition of the experiment
		var condition = 'a' //
		socket.emit('condition', condition)
	}

	assignCondition()
})

var gamensp = io.of('/game-nsp')
gamensp.on('connection', function(socket){
	
	var hs = socket.handshake
	var query = require('url').parse(socket.handshake.headers.referer, true).query
	var condition = (query.condition) ? query.condition : 'a' //try to pull condition from url, if fail --> default to 'a'
	var user = (query.workerId) ? query.workerId : 'undefinedID'

	var inventory = {
		pocket: 'empty',
		apples: 0,
		fishes: 0
	}

	console.log("Connection from user: " + user + ".")

	if(use_db){
		database.addPlayer(user, condition)
	}

	//function for updating database
	var updateDB = function(action){
		if(use_db){
			database.updatePlayer(user, condition, action, inventory.pocket, inventory.apples, inventory.fishes)
		}
	}

	//counts down until time_to_play has run out
	var timer = function(seconds){
		setTimeout(function(){
			if (seconds >= 1){
				timer(seconds - 1)
			}else{
				var destination = '/exitsurvey.html'
				socket.emit('redirect', destination)
				console.log("redirecting " + user)
			}
		}, 1000)
	}

	timer(time_to_play)

	socket.on('action', function(action){
		if(action == 'get apple'){
			inventory.apples += 1
		}else if(action == 'shoot apple'){
			inventory.apples -= 1
		}else if(action == 'get rock'){
			inventory.pocket = 'rock'
		}else if(action == 'shoot rock'){
			inventory.pocket = 'empty'
		}

		if(use_db){
			updateDB(action)
		}
	});

	var exportCSV = function(){
		//function for exporting CSVs goes here
	}

	socket.on('discconect', function(){
		exportCSV()
	})
})

server.listen(port, function(){
	console.log("Game server listening port " + port + ".")
	if(use_db){
		console.log("Logging results in mysql database.")
	}
})
