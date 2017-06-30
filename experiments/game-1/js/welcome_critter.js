// To use this code: before implementing, see line 36, you can alter creatureOpts to make certain types of critters, add your own creatures to the array if you please
// Currently there are 3 species and each is randomly organized on the screen 6 times

// var svg_array = [];
// for (var i=0; i<18; i++) {
// 	// imgs the variable that will get displayed on the screen
// 	// we append the names of all the images we want
// 	if (i < 6) {
// 		svg_array.push(
// 			"<svg id='wug" + i.toString() +
// 			"'></svg>");
// 	}
// 	if (i < 12 && i > 5) {
// 		svg_array.push(
// 			"<svg id='blicket" + i.toString() +
// 			"'></svg>");
// 	}
// 	if (i < 18 && i > 11) {
// 		svg_array.push(
// 			"<svg id='rambo" + i.toString() +
// 			"'></svg>");
// 	}
// }

// change id as needed
// $("#all_critters").append(_.shuffle(svg_array));

var flip = function(p){
	return p > Math.random()
}

var generateAttentionQuestion = function(){
	return flip(0.5) ? "tail" : "crest"
}

// this will generate random colors - trying to create ability to not be so random
var genColor = function(color, variance) {
	console.log(color)
	console.log(variance)
	function shuffle(v) { newarray = v.slice(0);for(var j, x, i = newarray.length; i; j = parseInt(Math.random() * i), x = newarray[--i], newarray[i] = newarray[j], newarray[j] = x);return newarray;} // non-destructive.
	var n = 10; // this is the default in ecosystem.js see line 12
	if (color == null) {
		var h = [];
		var offset = Math.random() * .99 / n;
	    for (var i=0;i<n-1;i++) {
	   		h.push((i/n)+offset);
	  	}
	  	h = shuffle(h);
	    h = h.shift();
	      console.log(h)
		var s = Ecosystem.uniformAroundMean(.99, .1);
		console.log(s)
	    var v = Ecosystem.uniformAroundMean(.99, .1);
	    console.log(v)

	    console.log(Raphael.hsb2rgb(h, s, v).hex);
		color = Raphael.hsb2rgb(h, s, v).hex;
	}
	else
		color = Ecosystem.myColor(color, variance);
	return color;
//    return Raphael.hsb2rgb(h, s, v).hex;
}

var scale = 0.5;

var creatureOpts = [
	{ creature: "bird",
		name: "wug",
		crest_col_mean: "#00ff00", 
		crest_col_var: 0.5,
		body_col_mean: "#00ff1a",
		body_col_var: 0.001,
		wing_col_mean: "#006400",
		wing_col_var: 0.3,
		height: null,
		fatness: null,
		tail: 0.5, //  approximately half of these have tails
		crest: 0.2,
		pepsin: 0.8
	},
	{ creature: "bird",
		name: "blicket",
		crest_col_mean: "#ff4500", 
		crest_col_var: 0.2,
		body_col_mean: "#ff4500",
		body_col_var: 0.001,
		wing_col_mean: "#ff4500",
		wing_col_var: 1.2,
		// crest_col: {"mean": "#ff4500"}, "var": 0.2,
		// body_col: {"mean": "#ff4500"}, "var": 0.001,
		// wing_col: {"mean": "#ff4500"}, "var": 1.2,
		// crest_col: "#ff4500",
		// body_col:  "#ff4500",
		// wing_col: "#ff4500",
		height: null,
		fatness: null,
		tail: 0,
		crest: 1,
		pepsin: 0.2,
	},
	{ creature: "bird",
		name: "rambo",
		crest_col_mean: "#ffff00", 
		crest_col_var: 0.2,
		body_col_mean: "#ffff00",
		body_col_var: 0.001,
		wing_col_mean: "#ffff00",
		wing_col_var: 1.2,
		// crest_col: null,
		// body_col: {"mean": "#ffff00"}, "var": 0.001,
		// wing_col: null,
		crest_col:"#ffff00",
		body_col:  "#ffff00",
		wing_col: "#ffff00",
		height: null,
		fatness: null,
		tail: 1,
		crest: 0.2,
		pepsin: 0
	}
]

var wugOpts = _.where(creatureOpts, {name: "wug"})[0];
var blicketOpts = _.where(creatureOpts, {name: "blicket"})[0];
var ramboOpts = _.where(creatureOpts, {name: "rambo"})[0];

var allCreatures = [];
var creatureN = 6;
var creatureTypesN = 3;
var exemplarN = creatureN/creatureTypesN;
// var wug = new Ecosystem.Genus("bird", {"col1": wugOpts.crest_col, "col2": wugOpts.body_col, "col3": wugOpts.wing_col});
var i=0;
while (i<exemplarN) {
	allCreatures.push({
		"col1": genColor(wugOpts.crest_col_mean, wugOpts.crest_col_var),
		"col2": genColor(wugOpts.body_col_mean, wugOpts.body_col_var),
		"col3": genColor(wugOpts.wing_col_mean, wugOpts.wing_col_var),
		"tar1": flip(wugOpts.tail),
		"tar2": flip(wugOpts.crest),
		"creatureName": "wug",
		"query": "question",
		"stimID": i,
		"pepsin": flip(wugOpts.pepsin),
		"attentionCheck": generateAttentionQuestion()
	})
  i++;
}
// since draw is called with no other arguments, the features of these fish will be random
// however, they will share a similar color due to taking from the same sample
// var blicket = new Ecosystem.Genus("bird", {"col1": blicketOpts.crest_col, "col2": blicketOpts.body_col});

while (i<2*exemplarN) {
	allCreatures.push({
		"col1": genColor(blicketOpts.crest_col_mean, wugOpts.crest_col_var),
		"col2": genColor(blicketOpts.body_col_mean, wugOpts.body_col_var),
		"col3": genColor(blicketOpts.wing_col_mean, wugOpts.wing_col_var),
		"tar1": flip(blicketOpts.tail),
		"tar2": flip(blicketOpts.crest),
		"creatureName": "blicket",
		"query": "question",
		"stimID": i,
		"pepsin": flip(blicketOpts.pepsin),
		"attentionCheck": generateAttentionQuestion()
	})
 	i++
}

// var rambo = new Ecosystem.Genus("bird", {"col2": ramboOpts.body_col});
while (i<3*exemplarN) {
	allCreatures.push({
		"col1": genColor(ramboOpts.crest_col_mean, wugOpts.crest_col_var),
		"col2": genColor(ramboOpts.body_col_mean, wugOpts.body_col_var),
		"col3": genColor(ramboOpts.wing_col_mean, wugOpts.wing_col_var),
		"tar1": flip(ramboOpts.tail),
		"tar2": flip(ramboOpts.crest),
		"creatureName": "rambo",
		"query": "question",
		"stimID": i,
		"pepsin": flip(ramboOpts.pepsin),
		"attentionCheck": generateAttentionQuestion()
	})
	i++;
	// rambo.draw("rambo"+i, {tar1:ramboOpts.tail}, scale);
}
