// -------------------------------------------------------
// Generate Critters for Multiplayer Concept Learning Game
// -------------------------------------------------------
// Here we generate flowers, fish, bugs, birds, and trees
// using Erin's Dominica-Bennett's stimuli generation package.
// -------------------------------------------------------

// -------
// IMPORTS
// -------
var _ = require('lodash');
var jsonfile = require('jsonfile');

// ----------
// CONSTANTS
// ----------
var constants = {
	// Flower
	flower: "flower",
	stem_color: "stem_color",
	spots_color: "spots_color",
	petals_color: "petals_color",
	center_color: "center_color",
	center_size: "center_size",
	petal_length: "petal_length",
	thorns_present: "thorns_present",
	spots_present: "spots_present",

	// Fish
	fish: "fish",
	body_color: "body_color",
	fins_color: "fins_color",
	body_size: "body_size",
	tail_size: "tail_size",
	fangs_present: "fangs_present",
	whiskers_present: "whiskers_present",

	// Bug
	bug: "bug",
	legs_color: "legs_color",
	head_color: "head_color",
	antennae_color: "antennae_color",
	bug_wings_color: "bug_wings_color",
	head_size: "head_size",
	antennae_present: "antennae_present",
	wings_present: "wings_present",

	// Bird
	bird: "bird",
	crest_tail_color: "crest_tail_color",
	bird_wing_color: "bird_wing_color",
	height: "height",
	fatness: "fatness",
	tail_present: "tail_present",
	crest_present: "crest_present",

	// Tree
	tree: "tree",
	berries_color: "berries_color",
	leaves_color: "leaves_color",
	trunk_color: "trunk_color",
	berries_present: "berries_present",
	leaves_present: "leaves_present",
	trunk_present: "trunk_present",

	// Property Names
	col1: "col1",
	col2: "col2",
	col3: "col3",
	col4: "col4",
	col5: "col5",
	prop1: "prop1",
	prop2: "prop2",
	tar1: "tar1",
	tar2: "tar2",

	// Property Types
	color: "color",
	size: "size",
	bool: "bool",

	// Colors
	blue: "blue",
	red: "red",
	yellow: "yellow",
	green: "green",
	orange: "orange",
	purple: "purple",
	pink: "pink",
	white: "white",
	black: "black",
	brown: "brown",
	
	// Sizes
	small: "small",
	large: "large",

	// Boolean
	true: "true",
	false: "false",

	// Misc
	name: "name",
	type: "type",
}


// --------------------------------------
// Creature Properties (Global Variables)
// --------------------------------------
var creature_dict = {
	[constants.flower]: {
		[constants.stem_color]: {
			[constants.name]: constants.col1,
			[constants.type]: constants.color,
		},
		[constants.spots_color]: {
			[constants.name]: constants.col2,
			[constants.type]: constants.color,
		},
		[constants.petals_color]: {
			[constants.name]: constants.col3,
			[constants.type]: constants.color,
		},
		[constants.center_color]: {
			[constants.name]: constants.col4,
			[constants.type]: constants.color,
		},
		[constants.center_size]: {
			[constants.name]: constants.prop1,
			[constants.type]: constants.size,
		},
		[constants.petal_length]: {
			[constants.name]: constants.prop2,
			[constants.type]: constants.size,
		},
		[constants.thorns_present]: {
			[constants.name]: constants.tar1,
			[constants.type]: constants.bool,			
		},
		[constants.spots_present]: {
			[constants.name]: constants.tar2,
			[constants.type]: constants.bool,			
		},
	},

	[constants.fish]: {
		[constants.body_color]: {
			[constants.name]: constants.col1,
			[constants.type]: constants.color,
		},
		[constants.fins_color]: {
			[constants.name]: constants.col2,
			[constants.type]: constants.color,
		},
		[constants.body_size]: {
			[constants.name]: constants.prop1,
			[constants.type]: constants.size,
		},
		[constants.tail_size]: {
			[constants.name]: constants.prop2,
			[constants.type]: constants.size,
		},
		[constants.fangs_present]: {
			[constants.name]: constants.tar1,
			[constants.type]: constants.bool,			
		},
		[constants.whiskers_present]: {
			[constants.name]: constants.tar2,
			[constants.type]: constants.bool,			
		},
	},

	[constants.bug]: {
		[constants.legs_color]: {
			[constants.name]: constants.col1,
			[constants.type]: constants.color,
		},
		[constants.head_color]: {
			[constants.name]: constants.col2,
			[constants.type]: constants.color,
		},
		[constants.body_color]: {
			[constants.name]: constants.col3,
			[constants.type]: constants.color,
		},
		[constants.antennae_color]: {
			[constants.name]: constants.col4,
			[constants.type]: constants.color,
		},
		[constants.bug_wings_color]: {
			[constants.name]: constants.col5,
			[constants.type]: constants.color,
		},
		[constants.head_size]: {
			[constants.name]: constants.prop1,
			[constants.type]: constants.size,
		},
		[constants.body_size]: {
			[constants.name]: constants.prop2,
			[constants.type]: constants.size,
		},
		[constants.antennae_present]: {
			[constants.name]: constants.tar1,
			[constants.type]: constants.bool,			
		},
		[constants.wings_present]: {
			[constants.name]: constants.tar2,
			[constants.type]: constants.bool,			
		},
	},

	[constants.bird]: {
		[constants.crest_tail_color]: {
			[constants.name]: constants.col1,
			[constants.type]: constants.color,
		},
		[constants.body_color]: {
			[constants.name]: constants.col2,
			[constants.type]: constants.color,
		},
		[constants.bird_wing_color]: {
			[constants.name]: constants.col3,
			[constants.type]: constants.color,
		},
		[constants.height]: {
			[constants.name]: constants.prop1,
			[constants.type]: constants.size,
		},
		[constants.fatness]: {
			[constants.name]: constants.prop2,
			[constants.type]: constants.size,
		},
		[constants.tail_present]: {
			[constants.name]: constants.tar1,
			[constants.type]: constants.bool,			
		},
		[constants.crest_present]: {
			[constants.name]: constants.tar2,
			[constants.type]: constants.bool,			
		},
	},

	[constants.tree]: {
		[constants.berries_color]: {
			[constants.name]: constants.col1,
			[constants.type]: constants.color,
		},
		[constants.leaves_color]: {
			[constants.name]: constants.col2,
			[constants.type]: constants.color,
		},
		[constants.trunk_color]: {
			[constants.name]: constants.col3,
			[constants.type]: constants.color,
		},
		[constants.berries_present]: {
			[constants.name]: constants.tar1,
			[constants.type]: constants.bool,			
		},
		[constants.leaves_present]: {
			[constants.name]: constants.tar2,
			[constants.type]: constants.bool,			
		},
	},
};

var color_dict = {
	[constants.blue]: "#5da5db",
	[constants.red]: "#f42935",
	[constants.yellow]: "#eec900",
	[constants.green]: "#228b22",
	[constants.orange]: "#ff8c00",
	[constants.purple]: "#dda0dd",
	[constants.pink]: "#FF69B4",
	[constants.white]: "#FFFFFF",
	[constants.black]: "#000000",
	[constants.brown]: "#A52A2A",
};

var size_dict = {
	[constants.small]: Math.log(1.0),
	[constants.large]: Math.log(4.0),
};

var bool_dict = {
	[constants.true]: true,
	[constants.false]: false,
};

var property_type_to_dict = {
	[constants.color]: color_dict,
	[constants.size]: size_dict,
	[constants.bool]: bool_dict,
};

// ------------------
// Dataset Generation
// ------------------
function createDatset(rule, training_set_size) {
	// Define dataset of some number of sets of critters.
	// ---------
	// rule: function that evaluatse to T/F
	//		 according to whether the critter belongs to a specific concept
	// training_set_size: Training set size. 

	return [training_stimuli, test_stimuli];
}

function createCritter(critter_properties, rule) {
	// Construct a critter based on the provided properties.
	// Determine whether the critter belongs to the concept 
	// by applying the rule function to constructed critter.
}

function createRuleFunc(concept_description) {
	// Create a function that returns True / False
	// given a dictionary of critter features. 
	// True indicates that the critter fits the described concept.
	// False indicates that the critter does not fit the described concept.
}


// ------------------
// Data File Creation
// ------------------
function saveDatasetToFile(dataset, filepath) {
	jsonfile.writeFile(filepath, dataset, function(err) {
		console.log(err);
	})
}

// ------------------
// Data File Creation
// ------------------
function genDatasets(rules, NUM_TRAIN) {
	// Rules is a list of rule objects. Example included below.
	// rule = {
	// 		name: "body_color_orange",
	// 		func: function(critter, color_dict, prop1_dict) {
	// 			return critter["props"]["col1"] === color_dict["orange"];
	// 		},
	// 		type: SINGLE_FEAT,
	// }

	var rule_summary = {};
	var index = 0;
	for (let r of rules) {
		var r_data = createDatset(r.func, NUM_TRAIN);
		var training_data_fn = './training_data_' + r.name + '.json';
		var test_data_fn = './test_data_' + r.name + '.json';
		saveDatasetToFile(r_data[0], training_data_fn);
		saveDatasetToFile(r_data[1], test_data_fn);

		rule_summary[index] = {
			name: r.name,
			type: r.type,
		}
		index++;
	}
	jsonfile.writeFile("./rule_summary.json", rule_summary, function(err) {
		console.log(err);
	});
}

// ----
// TEST
// ----

var testStimuliGeneration = function() {
	var test_rules = [
		{
			'name': 'Flowers with thorns and green spots',
			'logical_form': 'flowers AND thorns AND spots AND green spots',
			'type': 'CONJUNCTION',
			'description': {
				'creature': 'flower',
				'thorns_present': true,
				'spots_present': true,
				'spots': 'green',
			},
		},
		{
			'name': 'Fat Blue Birds',
			'logical_form': 'birds AND fat AND blue body',
			'type': 'CONJUNCTION',
			'description': {
				'creature': 'bird',
				'fatness': 'large',
				'body': 'blue',
			},
		}
	];
}


module.exports = {
	constants: constants,
    createDatset: createDatset,
	saveDatasetToFile: saveDatasetToFile,
	genDatasets: genDatasets,
}