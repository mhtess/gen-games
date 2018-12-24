
//--------
// Imports
//--------
var _ = require('underscore');
var fs = require('fs');
var converter = require("color-convert");
var DeltaE = require('../node_modules/delta-e');
var mkdirp = require('mkdirp');
var sendPostRequest = require('request').post;

// ----------------
// Server Functions
// ----------------
var serveFile = function(req, res) {
    var fileName = req.params[0];
    console.log('\t :: Express :: file requested: ' + fileName);
    if(req.query.workerId) {
      console.log(" by workerID " + req.query.workerId);
    }
    return res.sendFile(fileName, {root: __base});
  };


//--------------------
// Worker ID Functions
//--------------------
var handleDuplicate = function(req, res) {
  console.log("duplicate id: blocking request");
  return res.redirect('https://rxdhawkins.me:8888/sharedUtils/duplicate.html');
};

var handleInvalidID = function(req, res) {
  console.log("invalid id: blocking request");
  return res.redirect('https://rxdhawkins.me:8888/sharedUtils/invalid.html');
};

var checkPreviousParticipant = function(workerId, callback) {
  var p = {'workerId': workerId};
  var postData = {
    dbname: '3dObjects',
    query: p,
    projection: {'_id': 1}
  };
  sendPostRequest(
    'http://localhost:4000/db/exists',
    {json: postData},
    (error, res, body) => {
      try {
	if (!error && res.statusCode === 200) {
	  console.log("success! Received data " + JSON.stringify(body));
	  callback(body);
	} else {
	  throw `${error}`;
	}
      } catch (err) {
	console.log(err);
	console.log('no database; allowing participant to continue');
	return callback(false);
      }
    }
  );
};

//----------------
// Data Processing
//----------------
var writeDataToCSV = function(game, _dataPoint) {
  var dataPoint = _.clone(_dataPoint);
  var eventType = dataPoint.eventType;

  // Omit sensitive data
  if(game.anonymizeCSV)
    dataPoint = _.omit(dataPoint, ['workerId', 'assignmentId']);

  // Establish stream to file if it doesn't already exist
  if(!_.has(game.streams, eventType))
    establishStream(game, dataPoint);

  var line = _.values(dataPoint).join('\t') + "\n";
  game.streams[eventType].write(line, err => {if(err) throw err;});
};

var writeDataToMongo = function(game, line) {
  var postData = _.extend({
    dbname: game.projectName,
    colname: game.experimentName
  }, line);
  sendPostRequest(
    'http://localhost:4000/db/insert',
    { json: postData },
    (error, res, body) => {
      if (!error && res.statusCode === 200) {
        console.log(`sent data to store`);
      } else {
	console.log(`error sending data to store: ${error} ${body}`);
      }
    }
  );
};

function encodeData(dataObj){
    // Encode real numbers  
    return _.mapObject(dataObj, function(val, key) {
      if (isNumeric(val)) {
        if (Number.isInteger(val)) {
          return val.toString()
        } else {
        return val.toString().replace(".", "&")
        }
      } else { return val }
    });
  }

var UUID = function() {
  var baseName = (Math.floor(Math.random() * 10) + '' +
        Math.floor(Math.random() * 10) + '' +
        Math.floor(Math.random() * 10) + '' +
        Math.floor(Math.random() * 10));
  var template = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
  var id = baseName + '-' + template.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
  return id;
};

var getLongFormTime = function() {
  var d = new Date();
  var day = [d.getFullYear(), (d.getMonth() + 1), d.getDate()].join('-');
  var time = [d.getHours() + 'h', d.getMinutes() + 'm', d.getSeconds() + 's'].join('-');
  return day + '-' + time;
};

var establishStream = function(game, dataPoint) {
  var startTime = getLongFormTime();
  var dirPath = ['..', 'data', game.expName, dataPoint.eventType].join('/');
  var fileName = startTime + "-" + game.id + ".csv";
  var filePath = [dirPath, fileName].join('/');

  // Create path if it doesn't already exist
  mkdirp.sync(dirPath, err => {if (err) console.error(err);});

  // Write header
  var header = _.keys(dataPoint).join('\t') + '\n';
  fs.writeFile(filePath, header, err => {if(err) console.error(err);});

  // Create stream
  var stream = fs.createWriteStream(filePath, {'flags' : 'a'});
  game.streams[dataPoint.eventType] = stream;
};

var getObjectLocHeader = function() {
  return _.map(_.range(1,5), function(i) {
    return _.map(['Name', 'SketcherLoc', 'ViewerLoc'], function(v) {
      return 'object' + i + v;
    }).join('\t');
  }).join('\t');
};

//----------------
// Color Functions
//----------------
var hsl2lab = function(hsl) {
  return converter.hsl.lab(hsl);
};

var colorDiff = function(color1, color2) {
    var subLAB = _.object(['L', 'A', 'B'], hsl2lab(color1));
    var tarLAB = _.object(['L', 'A', 'B'], hsl2lab(color2));
    var diff = Math.round(DeltaE.getDeltaE00(subLAB, tarLAB));
    return diff;
  };
  

var randomColor = function (options) {
  var h = ~~(Math.random() * 360);
  var s = ~~(Math.random() * 100);
  var l = _.has(options, 'fixedL') ? 50 : ~~(Math.random() * 100) ;
  return [h, s, l];
};

var myColor = function(mean, variance) {
    //console.log("myColor");
    var hVar;
    var sVar;
    var vVar;
    if (variance == null) {
        hVar = 0.01;
        sVar = 0.1;
        vVar = 0.1;
    } else if (variance < 1) {
        hVar = 0.1 * variance;
        sVar = 1 * variance;
        vVar = 1 * variance;
    } else {
        hVar = 0.1 * variance;
        sVar = 0.1 * variance;
        vVar = 0.1 * variance;
    }
    //console.log("input: mean=" + mean + ", variance=" + variance);
    var c = converter.hex.hsv(mean);
    //console.log(c);
    var hue = uniformAroundMean(c[0], hVar);
    //console.log("hue: " + c[0] + ", " + hVar);
    var saturation = uniformAroundMean(c[1], sVar);
    //console.log("saturation: " + c[1] + ", " + sVar);
    var value = uniformAroundMean(c[2], vVar);
    //console.log("value: " + c[2] + ", " + vVar);
    //console.log(hue + ", " + saturation + ", " + value);
    var newColor = converter.hsv.hex(hue, saturation, value);
    //console.log(newColor);


    return  "#" + newColor;
}

var genColor = function(color, variance) {
	function shuffle(v) { newarray = v.slice(0);for(var j, x, i = newarray.length; i; j = parseInt(Math.random() * i), x = newarray[--i], newarray[i] = newarray[j], newarray[j] = x);return newarray;} // non-destructive.
	var n = 10; // this is the default in ecosystem.js see line 12
	if (color == null) {
		var h = [];
    //var h = .5;
		var offset = Math.random() * .99 / n;
	    for (var i=0;i<n-1;i++) {
	   		h.push((i/n)+offset);
	  	}
	  	h = shuffle(h);
	    h = h.shift();
		 var s = uniformAroundMean(.99, .1);
	   var v = uniformAroundMean(.99, .1);
   //var s = 100;
    //var v = 100;
		color = converter.hsv.hex(h, s, v);

	}
	else {
		color = myColor(color, variance);

  }

	return color;
};

//----------------
// Array Functions
//----------------
const flatten = arr => arr.reduce(
  (acc, val) => acc.concat(
    Array.isArray(val) ? flatten(val) : val
  ),
  []
);

function fillArr(value, len) { //changed name from fillArray to fillArr
  var arr = [];
  for (var i = 0; i < len; i++) {
    arr.push(value);
  }
  return arr;
}

function fillArray(value, len) {
  var arr = [];
  for (var i = 0; i < len; i++) {
    arr.push(value);
  }
  return arr;
}

//-----------------
// Shape Generation
//-----------------
var randomRect = function(options) {
    // returns an object with x, y, w, h fields
    if (_.isEmpty(options)) {
        throw "Error, must provide options to randomRect!";
    }

    var wRange = _.range(options.wMin, options.wMax);
    var hRange = _.range(options.hMin, options.hMax);

    var rect = randomPoint(options);
    rect.h = _.sample(wRange),
    rect.w = _.sample(hRange)

    if (!checkInBounds(rect, options)) {
        return this.randomRect(options);
    }
    return rect;
}

var randomCircle = function(options) {
  if (_.isEmpty(options)) {
    throw "Error, must provide options to randomCircle!";
  }

  //TODO, better error checking
  var dRange = _.range(options.dMin, options.dMax);
  if (_.isEmpty(dRange)) dRange = [options.dMin]; //hacky for now

  var circle = randomPoint(options);
  circle.d = _.sample(dRange);

  if (!checkInBounds(circle, options)) {
    return this.randomCircle(options);
  }

  return circle;
}

var randomPoint = function(options) {

  var xRange = _.range(options.xMin, options.xMax);
  var yRange = _.range(options.yMin, options.yMax);

  return {
    x: _.sample(xRange),
    y: _.sample(yRange)
  }
}

var randomSpline = function () {
    var numPoints = 4;
    return _.sample(_.range(50, 250), 2 * numPoints);
};

var getObjectLocHeaderArray = function() {
    arr =  _.map(_.range(1,5), function(i) {
      return _.map(['Name', 'SketcherLoc', 'ViewerLoc'], function(v) {
        return 'object' + i + v;
      });
    });
    return flatten(arr);
  };

var checkInBounds = function(object, options) {
  return (object.x + (object.w || object.d) < options.width) &&
         (object.y + (object.h || object.d) < options.height);
};

//----------------
// Misc Functions
//----------------
var vec = function extractEntries(dict,key) {
    // extracts all the values of the javascript dictionary by key
    vec = []
    for (i=0; i<dict.length; i++) {
        vec.push(dict[i][key]);
    }
    return vec;
}

var vec = function matchingValue(dict,key,value) {
    // finds matches to specific value given key
    vec = []
    for (i=0; i<dict.length; i++) {
        if (dict[i][key]==value) {
            vec.push(dict[i]);
        }
    }
    return vec;
}

var dict = function addEntry(dict,key,value) {
    // add entry to dictionary object
    for (i=0; i<dict.length; i++) {
        dict[i][key] = value;
    }
    return dict;
}

var series = function makeSeries(lb,ub) {
    // make integer series from lb (lower) to ub (upper)
    series = new Array();
    if (ub<=lb) {
        throw new Error("Upper bound should be greater than lower bound!");
    }
    for (var i = lb; i<(ub+1); i++) {
        series = series.concat(i);
    }
    return series;
}

//----------------------
// Prob & Math Functions
//----------------------

var probToCount = function(p, n){
  return Math.round(p*n);
}

var flip = function(p){
	return p > Math.random()
};

var generateAttentionQuestion = function(){
	return this.flip(0.5) ? "tar1" : "tar2"
};

var randProp = function() {
    return Math.random();
};

var uniform = function(a, b) {
    return ( (Math.random()*(b-a))+a );
};

var uniformAroundMean = function(mean, radius) {
    var upper = mean+radius;
    var lower = mean-radius;
    return uniform(lower, upper);
};

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

module.exports = {
    UUID,
    checkPreviousParticipant,
    serveFile,
    handleDuplicate,
    handleInvalidID,
    getLongFormTime,
    establishStream,
    getObjectLocHeader,
    writeDataToCSV,
    writeDataToMongo,
    hsl2lab,
    fillArray,
    randomColor,
    randomRect,
    randomCircle,
    randomPoint,
    randomSpline,
    colorDiff,
    randProp,
    genColor,
    flip,
    generateAttentionQuestion,
    isNumeric,
    encodeData,
};
