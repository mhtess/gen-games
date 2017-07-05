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
	return flip(0.5) ? "tar1" : "tar2"//"tail" : "crest"
}

// this will generate random colors - trying to create ability to not be so random
var genColor = function(color, variance) {
	// console.log(color)
	// console.log(variance)
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
	      // console.log(h)
		var s = Ecosystem.uniformAroundMean(.99, .1);
		// console.log(s)
	    var v = Ecosystem.uniformAroundMean(.99, .1);
	    // console.log(v)
			//
	    // console.log(Raphael.hsb2rgb(h, s, v).hex);
		color = Raphael.hsb2rgb(h, s, v).hex;
	}
	else
		color = Ecosystem.myColor(color, variance);
	return color;
//    return Raphael.hsb2rgb(h, s, v).hex;
}

var scale = 0.5;

// this is the only thing one has to change 
var creatureOpts = [
	{ creature: "bird",
		name: "wug",
		col1_mean: "#00ff00", //col1 = crest
		col1_var: 0.5,
		col2_mean: "#00ff1a", //col2 = body
		col2_var: 0.001,
		col3_mean: "#006400", //col3 = wing
		col3_var: 0.3,
	    col4_mean: null,
	    col4_var: null,
	    col5_mean: null,
	    col5_var: null,
		prop1: null, //height
		prop2: null, //fatness
		tar1: 0.5, // tails, approximately half of these have tails
		tar2: 0.2, //crest
		internal_prop: 0.8 //pepsin
	},
	{ creature: "bird",
		name: "blicket",
		col1_mean: "#ff4500", //col1 = crest
		col1_var: 0.2,
		col2_mean: "#ff4500", //col2 = body
		col2_var: 0.001,
		col3_mean: null,//"#ff4500", //col3 = wing
		col3_var: null,//1.2,
    	col4_mean: null,
	    col4_var: null,
	    col5_mean: null,
	    col5_var: null,
		prop1: null, //height
		prop2: null, //fatness
		tar1: 0, // tails
		tar1: 1, //crest
		internal_prop: 0.2, //pepsin
	},
	{ creature: "bird",
		name: "rambo",
		col1_mean: "#ffff00", //col1 = crest
		col1_var: 0.2,
		col2_mean: "#ffff00", //col2 = body
		col2_var: 0.001,
		col3_mean: "#ffff00", //col3 = wing
		col3_var: 1.2,
	    col4_mean: null,
	    col4_var: null,
	    col5_mean: null,
	    col5_var: null,
		prop1: null, //height
		prop2: null, //fatness
		tar1: 1, // tails
		tar1: 0.2, //crest
		internal_prop: 0 //pepsin
	}
]

var wugOpts = _.where(creatureOpts, {name: "wug"})[0];
var blicketOpts = _.where(creatureOpts, {name: "blicket"})[0];
var ramboOpts = _.where(creatureOpts, {name: "rambo"})[0];

var allCreatures = [];
var creatureN = 6;
var creatureTypesN = 3;
var exemplarN = creatureN/creatureTypesN;

var i=0;
while (i<exemplarN) {
	allCreatures.push({
		"col1": genColor(wugOpts.col1_mean, wugOpts.col1_var),
		"col2": genColor(wugOpts.col2_mean, wugOpts.col2_var),
		"col3": wugOpts.col3_mean == null ? null : genColor(wugOpts.col3_mean, wugOpts.col3_var),
    	"col4" : wugOpts.col4_mean == null ? null : genColor(wugOpts.col4_mean, wugOpts.col4_var),
    	"col5" : wugOpts.col5_mean == null ? null : genColor(wugOpts.col5_mean, wugOpts.col5_var),
		"prop1": wugOpts.prop1 == null ? Ecosystem.randProp() : wugOpts.prop1,
		"prop2": wugOpts.prop2 == null ? Ecosystem.randProp() : wugOpts.prop2,
		"tar1": flip(wugOpts.tar1),
		"tar2": flip(wugOpts.tar2),
		"creatureName": "wug",
		"critter" : wugOpts.creature,
		"query": "question",
		"stimID": i,
		"internal_prop": flip(wugOpts.internal_prop),
		"attentionCheck": generateAttentionQuestion()
	})
  i++;
}
// since draw is called with no other arguments, the features of these fish will be random
// however, they will share a similar color due to taking from the same sample
// var blicket = new Ecosystem.Genus("bird", {"col1": blicketOpts.crest_col, "col2": blicketOpts.body_col});

while (i<2*exemplarN) {
	allCreatures.push({
		"col1": genColor(blicketOpts.col1_mean, blicketOpts.col1_var),
		"col2": genColor(blicketOpts.col2_mean, blicketOpts.col2_var),
		"col3": genColor(blicketOpts.col3_mean, blicketOpts.col3_var),
    	"col4" : blicketOpts.col4_mean == null ? null : genColor(blicketOpts.col4_mean, blicketOpts.col4_var),
    	"col5" : blicketOpts.col5_mean == null ? null : genColor(blicketOpts.col5_mean, blicketOpts.col5_var),
		"prop1": blicketOpts.prop1 == null ? Ecosystem.randProp() : blicketOpts.prop1,
		"prop2": blicketOpts.prop2 == null ? Ecosystem.randProp() : blicketOpts.prop2,
		"tar1": flip(blicketOpts.tar1),
		"tar2": flip(blicketOpts.tar2),
		"creatureName": "blicket",
		"critter" : blicketOpts.creature,
		"query": "question",
		"stimID": i,
		"internal_prop": flip(blicketOpts.internal_prop),
		"attentionCheck": generateAttentionQuestion()
	})
 	i++
}

// var rambo = new Ecosystem.Genus("bird", {"col2": ramboOpts.body_col});
while (i<3*exemplarN) {
	allCreatures.push({
		"col1": genColor(ramboOpts.col1_mean, ramboOpts.col1_var),
		"col2": genColor(ramboOpts.col2_mean, ramboOpts.col2_var),
		"col3": genColor(ramboOpts.col3_mean, ramboOpts.col3_var),
   		"col4" : ramboOpts.col4_mean == null ? null : genColor(ramboOpts.col4_mean, ramboOpts.col4_var),
    	"col5" : ramboOpts.col5_mean == null ? null : genColor(ramboOpts.col5_mean, ramboOpts.col5_var),
		"prop1": ramboOpts.prop1 == null ? Ecosystem.randProp() : ramboOpts.prop1,
		"prop2": ramboOpts.prop2 == null ? Ecosystem.randProp() : ramboOpts.prop2,
		"tar1": flip(ramboOpts.tar1),
		"tar2": flip(ramboOpts.tar2),
		"creatureName": "rambo",
		"critter" : ramboOpts.creature,
		"query": "question",
		"stimID": i,
		"internal_prop": flip(ramboOpts.internal_prop),
		"attentionCheck": generateAttentionQuestion()
	})
	i++;
}

var critFeatures = [
	{ creature: "bird",
		col1: "crest",
		col2: "body",
		col3: "wing",
    	col4: null,
   		col5: null,
		prop1: "height",
		prop2: "fatness",
		tar1: "tail", //  approximately half of these have tails
		tar2: "crest",
		internal_prop: "pepsin"
	},
	{ creature: "fish",
		col1: "body",
		col2: "fins",
		col3: null,
    	col4: null,
   		col5: null,
		prop1: "bodysize (short->tall)",
		prop2: "tailsize",
		tar1: "fangs", //  approximately half of these have tails
		tar2: "whiskers",
		internal_prop: "--"
	},
	{ creature: "bug",
		col1: "legs",
		col2: "head",
		col3: "body",
    	col4: "antennae",
   		col5: "wings",
		prop1: "headsize(small->wide)",
		prop2: "bodysize(narrow->fat)",
		tar1: "antennae", //  approximately half of these have tails
		tar2: "wings",
		internal_prop: "--"
	},
  { creature: "flower",
		col1: "stem",
		col2: "spots",
		col3: "petals",
    	col4: "center",
   		col5: null,
		prop1: "centersize",
		prop2: "petallength",
		tar1: "thorns", //  approximately half of these have tails
		tar2: "spots",
		internal_prop: "--"
	},
  { creature: "tree",
		col1: "berries",
		col2: "leaves",
		col3: "trunk",
    	col4: null,
   		col5: null,
		prop1: null,
		prop2: null,
		tar1: "berries", //  approximately half of these have tails
		tar2: "leaves",
		internal_prop: "--"
	}
]
