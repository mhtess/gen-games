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
var fs = require('fs');
var jsonfile = require('jsonfile');
var path = require('path');

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
	creature: "creature",
	name: "name",
	type: "type",
	logical_form: "logical_form",
	description: "description",
	phrase: "phrase",
	props: "props",
	belongs_to_concept: "belongs_to_concept",

	// Rule Types
	conjunction: "CONJUNCTION",
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
	// [constants.red]: "#f42935",
	// [constants.yellow]: "#eec900",
	// [constants.green]: "#228b22",
	[constants.orange]: "#ff8c00",
	// [constants.purple]: "#dda0dd",
	// [constants.pink]: "#FF69B4",
	// [constants.white]: "#FFFFFF",
	[constants.black]: "#000000",
	// [constants.brown]: "#A52A2A",
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

var boolean_color_constraints = {
	[constants.flower]: [
		{
			[constants.bool]: constants.spots_present,
			[constants.color]: constants.spots_color,
		}
	],
	[constants.fish]: [],
	[constants.bug]: [
		{
			[constants.bool]: constants.antennae_present,
			[constants.color]: constants.antennae_color,
		},
		{
			[constants.bool]: constants.wings_present,
			[constants.color]: constants.bug_wings_color,
		}
	],
	[constants.bird]: [
		{
			[constants.bool]: constants.crest_present,
			[constants.color]: constants.crest_tail_color,
		},
		{
			[constants.bool]: constants.tail_present,
			[constants.color]: constants.crest_tail_color,
		}
	],
	[constants.tree]: [
		{
			[constants.bool]: constants.berries_present,
			[constants.color]: constants.berries_color,
		},
		{
			[constants.bool]: constants.leaves_present,
			[constants.color]: constants.leaves_color,
		},
	],
};

// -------------------------
// Concepts & Rule Functions
// -------------------------

function addRule(concept) {
	// Create a function that returns True / False
	// given a dictionary of critter features. 
	// True indicates that the critter fits the described concept.
	// False indicates that the critter does not fit the described concept.
	concept = _.extend({
		rule: function(creature, creature_description) {
			// Incorrect creature kind
			if (concept[constants.creature] !== creature) return false;

			// Examine properties
			for (var property in concept) {
				if (concept.hasOwnProperty(property)) {
					if (creature_description[property] !== concept[property]) return false;
				}
			}
			return true;
		}
	}, concept);
	return concept;
}

function resolveColorConstraints(creature,  d) {
	// Determine if description (d) for a given creature type is valid
	// according to boolean feature / color feature constraints.
	// If the description is valid, return the given description.
	// If it is invalid, edit the description so that it is now valid.
	var constraints = boolean_color_constraints[creature];

	if (creature !== constants.bird) {
		for (var i = 0; i < constraints.length; i++) {
			var constraint = constraints[i];
			if (d[constraint[constants.bool]] === constants.false) {
				delete d[constraint[constants.color]];
			}			
		}
	} else {
		var valid = true;
		for (var i = 0; i < constraints.length; i++) {
			var constraint = constraints[i];
			if (d[constraint[constants.bool]] === constants.false) {
				valid = valid & false;
			}
		}
		if (valid === false) {
			var constraint = constraints[0];
			delete d[constraint[constants.color]];			
		}	
	}


	return d;
}

function isValidConcept(concept) {
	// Check whether concept description is valid.
	// Returns True/False appropriately.
	var d = concept[constants.description];

	// Ensure that there are no "undefined" values
	// in object description.
	for (var property in d) {
		if (d.hasOwnProperty(property)) {
			if (typeof property === "undefined") return false;
			if (typeof d[property] === "undefined") return false;
		}
	}	

	var is_valid = true;
	var constraints = boolean_color_constraints[d[constants.creature]];
	for (var i = 0; i < constraints.length; i++) {
		var constraint = constraints[i];
		if (constraint[constants.color] in d) {
			is_valid = is_valid && (constraint[constants.bool] in d && d[constraint[constants.bool]] === constants.true);
		}
	}
	return is_valid;
}

// ------------------
// Dataset Generation
// ------------------

function genDatasets(concepts, train_proportion, dir) {
	var concept_summary = {};
	var index = 0;

	// Create dataset directories
	if (!fs.existsSync(dir)){
		fs.mkdirSync(dir);
	}
	train_dir = path.join(dir, 'train');
	test_dir = path.join(dir, 'test');
	if (!fs.existsSync(train_dir)){
		fs.mkdirSync(train_dir);
	}
	if (!fs.existsSync(test_dir)){
		fs.mkdirSync(test_dir);
	}

	// Add rule functions to each of the concepts
	for (var i = 0; i < concepts.length; i++) {
		var concept = concepts[i];
		concepts[i] = addRule(concept);
	}

	// Create dataset for each concept
	for (let c of concepts) {
		var datasets = createDataset(c, train_proportion);
		var train = train_dir + '/' + c.name + '.json';
		var test = test_dir + '/' + c.name + '.json';
		jsonfile.writeFile(train, datasets[0]);
		jsonfile.writeFile(test, datasets[1]);

		concept_summary[index] = {
			name: c.name,
			logical_form: c.logical_form,
			phrase: c.phrase,
			type: c.type,
		};
		index++;
	}
	
	// Write concept_summary
	jsonfile.writeFile(path.join(dir, 'concept_summary.json'), concept_summary);
}

function createDataset(concept, train_proportion) {
	// Define dataset of some number of sets of critters.
	// ---------
	var creature = concept[constants.description][constants.creature];
	var creature_descriptions = enumerateCreatureDescriptions(creature);
	var creature_belongs_to_concept = _.map(creature_descriptions, concept.rule);
	var stimuli = [];
	for (var i = 0; i < creature_descriptions.length; i++) {
		stimuli.push(createCreature(creature, creature_descriptions[i], creature_belongs_to_concept[i]));
	}
	stimuli = _.shuffle(stimuli);
	var test_idx = _.round(train_proportion * stimuli.length);
	var train_stimuli = _.slice(stimuli, 0, test_idx);
	var test_stimuli = _.slice(stimuli, test_idx);
	return [train_stimuli, test_stimuli];
}

function enumerateCreatureDescriptions(creature) {
	var creature_descriptor = creature_dict[creature];
	var unfinished_creature_descriptions = [{}];
	var completed_creature_descriptions = [];

	function isCompleteDescription(creature_description) {
		for (var property in creature_descriptor) {
			if (creature_descriptor.hasOwnProperty(property)) {
				if (!(property in creature_description)) {
					return false;
				}
			}
		}
		return true;
	}

	while(unfinished_creature_descriptions.length > 0) {
		var cur_creature_description = unfinished_creature_descriptions.shift();
		var new_property = "";
		
		// Identify property to enumerate for exemplar
		for (var property in creature_descriptor) {
			if (creature_descriptor.hasOwnProperty(property)) {
				if (!(property in cur_creature_description)) {
					new_property = property;
					break;
				}
			}
		}

		// Enqueue variants of object
		var new_property_descriptor = creature_dict[creature][new_property];
		var new_property_type = new_property_descriptor[constants.type];
		var possible_vals = Object.keys(property_type_to_dict[new_property_type]);
		for (var i = 0; i < possible_vals.length; i++) {
			var modified_cur_creature_description = Object.assign({}, cur_creature_description);
			modified_cur_creature_description[new_property] = possible_vals[i];

			if (isCompleteDescription(modified_cur_creature_description)) {
				completed_creature_descriptions.push(modified_cur_creature_description);
			} else {
				unfinished_creature_descriptions.push(modified_cur_creature_description);
			}
		}
	}

	function clean_description(description) {
		return resolveColorConstraints(creature, description);
	}

	var cleaned_creature_descriptions = _.filter(completed_creature_descriptions, clean_description);
	var final_creature_descriptions = _.uniqWith(cleaned_creature_descriptions, _.isEqual);
	return final_creature_descriptions;
}

function createCreature(creature, creature_description, belongs_to_concept) {
	// Construct a critter based on the provided properties.
	// Determine whether the critter belongs to the concept 
	// by applying the rule function to constructed critter.

	if (creature !== constants.flower &&
		creature !== constants.fish &&
		creature !== constants.bug &&
		creature !== constants.bird &&
		creature !== constants.tree
	) {
		throw "Invalid creature type!";
	}

	var creatureJSON =  {
		[constants.creature]: creature,
		[constants.props]: {},
		[constants.description]: creature_description,
		[constants.belongs_to_concept]: belongs_to_concept,
	};

	// Convert english langauge properties
	// to descriptors for the stimuli pacakge
	for (var property in creature_description) {
		if (creature_description.hasOwnProperty(property)) {
			var property_text_val = creature_description[property];
			var property_descriptor = creature_dict[creature][property];
			var property_name = property_descriptor[constants.name];
			var property_type = property_descriptor[constants.type];
			creatureJSON[constants.props][property_name] = property_type_to_dict[property_type][property_text_val];
		}
	}	

	return creatureJSON;
}


// ----
// TEST
// ----

var testStimuliGeneration = function() {
	var test_concepts = [
		{
			[constants.name]: 'flowers_thorns_green_spots',
			[constants.phrase]: 'Flowers with thorns and green spots',
			[constants.logical_form]: 'flowers AND thorns AND spots AND green spots',
			[constants.type]: constants.conjunction,
			[constants.description]: {
				[constants.creature]: constants.flower,
				[constants.thorns_present]: constants.true,
				[constants.spots_present]: constants.true,
				[constants.spots_color]: constants.green,
			},
		},
		{
			[constants.name]: 'fat_blue_birds',
			[constants.phrase]: 'Fat Blue Birds',
			[constants.logical_form]: 'birds AND fat AND blue body',
			[constants.type]: constants.conjunction,
			[constants.description]: {
				[constants.creature]: constants.bird,
				[constants.fatness]: constants.large,
				[constants.body_color]: constants.blue,
			},
		},
	];

	genDatasets(test_concepts, 0.80, './test_dataset');

}

testStimuliGeneration();
// console.log(
// 	createCreature(
// 		"bug", {
// 		[constants.legs_color]: constants.pink,
// 		[constants.head_color]: constants.black,
// 		[constants.body_color]: constants.green,
// 		[constants.antennae_color]: constants.red,
// 		[constants.bug_wings_color]: constants.yellow,
// 		[constants.head_size]: constants.small,
// 		[constants.body_size]: constants.small,
// 		[constants.antennae_present]: constants.true,
// 		[constants.wings_present]: constants.false,
// 	}, 
// 	true)
// );
// console.log(
// 	resolveColorConstraints("bug", {
// 		[constants.legs_color]: constants.pink,
// 		[constants.head_color]: constants.black,
// 		[constants.body_color]: constants.green,
// 		[constants.antennae_color]: constants.red,
// 		[constants.bug_wings_color]: constants.yellow,
// 		[constants.head_size]: constants.small,
// 		[constants.body_size]: constants.small,
// 		[constants.antennae_present]: constants.true,
// 		[constants.wings_present]: constants.false,
// 	})
// );
// console.log(enumerateCreatureDescriptions(constants.flower).length);


module.exports = {
	constants: constants,
    createDatset: createDataset,
	genDatasets: genDatasets,
}