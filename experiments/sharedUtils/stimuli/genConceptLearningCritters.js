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
    frill_present: "frill_present",
    frill_color: "frill_color",

	// Fish
	fish: "fish",
	body_color: "body_color",
	fins_color: "fins_color",
	body_size: "body_size",
	tail_size: "tail_size",
	fangs_present: "fangs_present",
    whiskers_present: "whiskers_present",
    stripes_present: "stripes_present",
    stripes_color: "stripes_color",

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
    trunk_width: "trunk_width",
    trunk_height: "trunk_height",

	// Property Names
	col1: "col1",
	col2: "col2",
	col3: "col3",
	col4: "col4",
    col5: "col5",
    col6: "col6",
	prop1: "prop1",
    prop2: "prop2",
	tar1: "tar1",
    tar2: "tar2",
    tar3: "tar3",

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
    standard: "standard",

	// Boolean
	true: "true",
	false: "false",

    // Misc
    rule: "rule",
	creature: "creature",
	name: "name",
	type: "type",
	logical_form: "logical_form",
	description: "description",
	phrase: "phrase",
	props: "props",
	belongs_to_concept: "belongs_to_concept",

    // Rule Types
    single_feature: "SINGLE_FEATURE",
    conjunction: "CONJUNCTION",
    disjunction: "DISJUNCTION",
    conjunction_conjunction: "CONJUNCTION_CONJUNCTION",
    disjunction_disjunction: "DISJUNCTION_DISJUNCTION",
    conjunction_disjunction: "CONJUNCTION_DISJUNCTION",
    disjunction_conjunction: "DISJUNCTION_CONJUNCTION",
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
		[constants.frill_color]: {
			[constants.name]: constants.col5,
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
		[constants.frill_present]: {
			[constants.name]: constants.tar3,
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
		[constants.stripes_present]: {
			[constants.name]: constants.tar3,
			[constants.type]: constants.bool,			
        },
		[constants.stripes_color]: {
			[constants.name]: constants.col3,
			[constants.type]: constants.color,			
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
        [constants.trunk_width]: {
            [constants.name]: constants.prop1,
            [constants.type]: constants.size,
        },
        [constants.trunk_height]: {
            [constants.name]: constants.prop2,
            [constants.type]: constants.size,
        }
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

var creature_to_colors_dict = {
    [constants.flower]: [constants.orange, constants.purple, constants.white],
    [constants.bug]: [constants.orange, constants.purple, constants.white],
    [constants.bird]: [constants.orange, constants.purple, constants.white],
    [constants.fish]: [constants.orange, constants.purple, constants.white],
    [constants.tree]: [constants.orange, constants.purple, constants.white, constants.green, constants.blue, constants.red],
};

var size_dict = {
    [constants.standard]: Math.log(1.0),
	// [constants.small]: Math.log(1.0),
	// [constants.large]: Math.log(2.0),
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
        },
		{
			[constants.bool]: constants.frill_present,
			[constants.color]: constants.frill_color,
		}
	],
	[constants.fish]: [
        {
            [constants.bool]: constants.stripes_present,
            [constants.color]: constants.stripes_color,
        }
    ],
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

function genDatasets(concepts, num_train, num_test, dir, min_num_pos) {
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

    // Create dataset for each concept
    console.log("Creating dataset for the following concepts: ");
	for (let c of concepts) {
        console.log(c[constants.phrase]);
		var datasets = createDataset(c, num_train, num_test, min_num_pos);
		var train = train_dir + '/' + c.name + '.json';
        var test = test_dir + '/' + c.name + '.json';
        
        var num_positive_train_creatures = _.filter(datasets[0], function(x) {return x.belongs_to_concept}).length;
        var num_positive_test_creatures = _.filter(datasets[1], function(x) {return x.belongs_to_concept}).length;
        // console.log("# Positive Train Creatures:  " + num_positive_train_creatures + " # of Positive Test Creatures: " + num_positive_test_creatures);

		jsonfile.writeFile(train, datasets[0]);
		jsonfile.writeFile(test, datasets[1]);

		concept_summary[index] = {
            kind: c.description.creature,
			name: c.name,
			logical_form: c.logical_form,
			phrase: c.phrase,
			type: c.type,
            num_train: datasets[0].length,
			num_test: datasets[1].length,
            p_train_belongs_to_concept: (_.filter(datasets[0], function(x) {return x.belongs_to_concept}).length * 1.0) / datasets[0].length,
			p_test_belongs_to_concept: (_.filter(datasets[1], function(x) {return x.belongs_to_concept}).length * 1.0)/ datasets[1].length,            
            num_train_belongs_to_concept: num_positive_train_creatures,
            num_test_belongs_to_concept: num_positive_test_creatures,
		};
		index++;
	}
	
	// Write concept_summary
	jsonfile.writeFile(path.join(dir, 'concept_summary.json'), concept_summary);
}

function createDataset(concept, num_train, num_test, min_num_pos) {
	// Define dataset of some number of sets of critters.
	// ---------
	var creature = concept[constants.description][constants.creature];
	var creature_descriptions = enumerateCreatureDescriptions(creature);
	var rule_func = function(creature_description) {
        var rule = concept[constants.rule];
		return rule(creature, creature_description, concept[constants.description]);
	}
	var creatures_belongs_to_concept = _.map(creature_descriptions, rule_func);
	var stimuli = [];
	for (var i = 0; i < creature_descriptions.length; i++) {
		stimuli.push(createCreature(creature, creature_descriptions[i], creatures_belongs_to_concept[i]));
    }
    
    var num_positive_stimuli = _.filter(stimuli, function(x) {return x.belongs_to_concept}).length;
    stimuli = _.sortBy(stimuli, [function(x) {return !x.belongs_to_concept}]);

    var positive_stimuli = _.shuffle(_.slice(stimuli, 0, num_positive_stimuli));
    var negative_stimuli = _.slice(stimuli, num_positive_stimuli);
    var train_stimuli = _.slice(positive_stimuli, 0, min_num_pos);
    var test_stimuli = _.slice(positive_stimuli, min_num_pos, min_num_pos * 2);

    // Ensure that we have min number of "positive" stimuli
    for (var i = 0; i < min_num_pos; i++) {
        if (train_stimuli[i].belongs_to_concept === false) {
            throw ("Not enough training stimuli that belong to desired class");
        }
    }
    for (var i = 0; i < min_num_pos; i++) {
        if (test_stimuli[i].belongs_to_concept === false) {
            throw ("Not enough test stimuli that belong to desired class");
        }
    }

    var remaining_stimuli = _.shuffle(_.concat(
        _.slice(positive_stimuli, min_num_pos * 2),
        negative_stimuli
    ));

    var remaining_num_train = num_train - min_num_pos;
    var remaining_num_test = num_test - min_num_pos;
    var train_stimuli = _.concat(
        train_stimuli,
        _.slice(remaining_stimuli, 0, remaining_num_train)
    );
    var test_stimuli = _.concat(
        test_stimuli,
        _.slice(remaining_stimuli, remaining_num_train, remaining_num_train + remaining_num_test)
    );

    // Shuffle Stimuli
    train_stimuli = _.shuffle(train_stimuli);
    test_stimuli = _.shuffle(test_stimuli);
	return [train_stimuli, test_stimuli, stimuli];
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
        
        // Possible values are different for different creatures
        var possible_vals = undefined;
        if (new_property_type === constants.color) {
            possible_vals = creature_to_colors_dict[creature];
        } else {
            possible_vals = Object.keys(property_type_to_dict[new_property_type]);
        }

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

function createConjunctiveRule() {
	// Create a function that returns True / False
	// given a dictionary of creature features. 
	// True indicates that the creature fits the described concept.
    // False indicates that the creature does not fit the described concept.
    
    return function(creature_type, creature_description, concept_description) {
        if (concept_description[constants.creature] !== creature_type) return false;
 
        // Examine properties
        for (var property in concept_description) {
            if (concept_description.hasOwnProperty(property)) {
                if (property === constants.creature) continue;
                if (creature_description[property] !== concept_description[property]) return false;
            }
        }
        return true;
    }
}


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
    createDataset: createDataset,
    genDatasets: genDatasets,
    createConjunctiveRule, createConjunctiveRule,
}