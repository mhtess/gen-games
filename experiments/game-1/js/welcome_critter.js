// To use this code: before implementing, see line 36, you can alter creatureOpts to make certain types of critters, add your own creatures to the array if you please
// Currently there are 3 species and each is randomly organized on the screen 6 times

var svg_array = [];
for (var i=0; i<18; i++) {
	// imgs the variable that will get displayed on the screen
	// we append the names of all the images we want
	if (var i < 6) {
		svg_array.push(
			"<svg id='wug" + i.toString() +
			"'></svg>");
	}
	if (var i < 12) {
		svg_array.push(
			"<svg id='blicket" + i.toString() +
			"'></svg>");
	}
	if (var i < 18) {
		svg_array.push(
			"<svg id='rambo" + i.toString() +
			"'></svg>");
	}
}

// change id as needed
$("#all_critters").append(_.shuffle(svg_array));
var scale = 0.5;

var creatureOpts = [
	{ creature: "bird",
		name: "wug",
		crest_col: {"mean": "#00ff00"}, "var": 0.2,
		body_col: {"mean": "#00ff1a"}, "var": 0.001,
		wing_col: {"mean": "#006400"}, "var": 0.3,
		height: null,
		fatness: null,
		tail: 0.5, //  approximately half of these have tails
		crest: 0.2
	},
	{ creature: "bird",
		name: "blicket",
		crest_col: {"mean": "#ff4500"}, "var": 0.2,
		body_col: {"mean": "#ff4500"}, "var": 0.001,
		wing_col: {"mean": "#ff4500"}, "var": 1.2,
		height: null,
		fatness: null,
		tail: 0,
		crest: 1
	},
	{ creature: "bird",
		name: "rambo",
		crest_col: null,
		body_col: {"mean": "#ffff00"}, "var": 0.001,
		wing_col: null,
		height: null,
		fatness: null,
		tail: 1,
		crest: null
	}
]

var wugOpts = _.where(creatureOpts, {name: "wug"})[0];
var blicketOpts = _.where(creatureOpts, {name: "blicket"})[0];
var ramboOpts = _.where(creatureOpts, {name: "rambo"})[0];

var wug = new Ecosystem.Genus("bird", {"col1": wugOpts.crest_col, "col2": wugOpts.body_col, "col3": wugOpts.wing_col});

for (var i=0; i<6; i++) {
	wug.draw("wug"+i, {}, scale);
}
// since draw is called with no other arguments, the features of these fish will be random
// however, they will share a similar color due to taking from the same sample
var blicket = new Ecosystem.Genus("bird", {"col1": blicketOpts.crest_col, "col2": blicketOpts.body_col});
for (var i=6; i<12; i++) {
	blicket.draw("blicket"+i, {tar1:blicketOpts.tail, tar:blicketOpts.crest}, scale);
}

var rambo = new Ecosystem.Genus("bird", {"col2": ramboOpts.body_col});
for (var i=12; i<18; i++) {
	rambo.draw("rambo"+i, {tar1:rambo.tail}, scale);
}
}