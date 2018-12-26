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
	// [constants.blue]: "#5da5db",
	// [constants.red]: "#f42935",
	// [constants.yellow]: "#eec900",
	// [constants.green]: "#228b22",
	[constants.orange]: "#ff8c00",
	[constants.purple]: "#dda0dd",
	// [constants.pink]: "#FF69B4",
	[constants.white]: "#FFFFFF",
	// [constants.black]: "#000000",
	// [constants.brown]: "#A52A2A",
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

	// Create dataset for each concept
	for (let c of concepts) {
        console.log("Creating dataset for concept: " + c[constants.phrase]);
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
			num_train: datasets[0].length,
			p_train_belongs_to_concept: (_.filter(datasets[0], function(x) {return x.belongs_to_concept}).length * 1.0) / datasets[0].length,
			num_test: datasets[1].length,
			p_test_belongs_to_concept: (_.filter(datasets[1], function(x) {return x.belongs_to_concept}).length * 1.0)/ datasets[1].length,
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
	var rule_func = function(creature_description) {
        var rule = concept[constants.rule];
		return rule(creature, creature_description, concept[constants.description]);
	}
	var creatures_belongs_to_concept = _.map(creature_descriptions, rule_func);
	var stimuli = [];
	for (var i = 0; i < creature_descriptions.length; i++) {
		stimuli.push(createCreature(creature, creature_descriptions[i], creatures_belongs_to_concept[i]));
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
			[constants.name]: 'flowers_orange_stems',
			[constants.phrase]: 'Flowers with orange stems',
			[constants.logical_form]: 'flowers and orange stems',
			[constants.type]: constants.single_feature,
			[constants.description]: {
				[constants.creature]: constants.flower,
				[constants.stem_color]: constants.orange,
            },
            [constants.rule]: function(creature_type, creature_description, concept_description) {
                if (concept_description[constants.creature] !== creature_type) return false;
                return (
                    creature_description[constants.stem_color] === concept_description[constants.stem_color]
                )
            },
        },
		{
			[constants.name]: 'flowers_with_thorns',
			[constants.phrase]: 'Flowers with thorns',
			[constants.logical_form]: 'flowers and thorns',
			[constants.type]: constants.single_feature,
			[constants.description]: {
				[constants.creature]: constants.flower,
				[constants.thorns_present]: constants.true,
            },
            [constants.rule]: function(creature_type, creature_description, concept_description) {
                if (concept_description[constants.creature] !== creature_type) return false;
                return (
                    creature_description[constants.thorns_present] === concept_description[constants.thorns_present]
                )
            },
        },
		{
			[constants.name]: 'flowers_with_purple_spots',
			[constants.phrase]: 'Flowers with purple spots',
			[constants.logical_form]: 'flowers and purple spots',
			[constants.type]: constants.single_feature,
			[constants.description]: {
				[constants.creature]: constants.flower,
                [constants.spots_present]: constants.true,
                [constants.spots_color]: constants.purple,
            },
            [constants.rule]: function(creature_type, creature_description, concept_description) {
                if (concept_description[constants.creature] !== creature_type) return false;
                return (
                    creature_description[constants.spots_present] === concept_description[constants.spots_present] &&
                    creature_description[constants.spots_color] === concept_description[constants.spots_color]
                )
            },
        },
		{
			[constants.name]: 'flowers_with_white_centers',
			[constants.phrase]: 'Flowers with white centers',
			[constants.logical_form]: 'flowers and white centers',
			[constants.type]: constants.single_feature,
			[constants.description]: {
				[constants.creature]: constants.flower,
                [constants.center_color]: constants.white,
            },
            [constants.rule]: function(creature_type, creature_description, concept_description) {
                if (concept_description[constants.creature] !== creature_type) return false;
                return (
                    creature_description[constants.center_color] === concept_description[constants.center_color]
                )
            },
        },
		{
			[constants.name]: 'fish_with_white_fins',
			[constants.phrase]: 'Fish white fins',
			[constants.logical_form]: 'fish and white fins',
			[constants.type]: constants.single_feature,
			[constants.description]: {
				[constants.creature]: constants.fish,
                [constants.fins_color]: constants.white,
            },
            [constants.rule]: function(creature_type, creature_description, concept_description) {
                if (concept_description[constants.creature] !== creature_type) return false;
                return (
                    creature_description[constants.fins_color] === concept_description[constants.fins_color]
                )
            },
        },
		{
			[constants.name]: 'fish_with_fangs',
			[constants.phrase]: 'Fish with white fangs',
			[constants.logical_form]: 'fish and fangs',
			[constants.type]: constants.single_feature,
			[constants.description]: {
				[constants.creature]: constants.fish,
                [constants.fangs_present]: constants.true,
            },
            [constants.rule]: function(creature_type, creature_description, concept_description) {
                if (concept_description[constants.creature] !== creature_type) return false;
                return (
                    creature_description[constants.fangs_present] === concept_description[constants.fangs_present]
                )
            },
        },
		{
			[constants.name]: 'fish_with_whiskers',
			[constants.phrase]: 'Fish with whiskers',
			[constants.logical_form]: 'fish and whiskers',
			[constants.type]: constants.single_feature,
			[constants.description]: {
				[constants.creature]: constants.fish,
                [constants.whiskers_present]: constants.true,
            },
            [constants.rule]: function(creature_type, creature_description, concept_description) {
                if (concept_description[constants.creature] !== creature_type) return false;
                return (
                    creature_description[constants.whiskers_present] === concept_description[constants.whiskers_present]
                )
            },
        },
		{
			[constants.name]: 'fish_with_purple_fins',
			[constants.phrase]: 'Fish with purple fins',
			[constants.logical_form]: 'fish and purple fins',
			[constants.type]: constants.single_feature,
			[constants.description]: {
				[constants.creature]: constants.fish,
                [constants.fins_color]: constants.purple,
            },
            [constants.rule]: function(creature_type, creature_description, concept_description) {
                if (concept_description[constants.creature] !== creature_type) return false;
                return (
                    creature_description[constants.fins_color] === concept_description[constants.fins_color]
                )
            },
        }, 
		{
			[constants.name]: 'bugs_with_white_legs',
			[constants.phrase]: 'bugs with white legs',
			[constants.logical_form]: 'bugs and white legs',
			[constants.type]: constants.single_feature,
			[constants.description]: {
				[constants.creature]: constants.bug,
                [constants.legs_color]: constants.white,
            },
            [constants.rule]: function(creature_type, creature_description, concept_description) {
                if (concept_description[constants.creature] !== creature_type) return false;
                return (
                    creature_description[constants.legs_color] === concept_description[constants.legs_color]
                )
            },
        },
		{
			[constants.name]: 'bugs_with_orange_head',
			[constants.phrase]: 'bugs with white orange head',
			[constants.logical_form]: 'bugs and orange head',
			[constants.type]: constants.single_feature,
			[constants.description]: {
				[constants.creature]: constants.bug,
                [constants.head_color]: constants.orange,
            },
            [constants.rule]: function(creature_type, creature_description, concept_description) {
                if (concept_description[constants.creature] !== creature_type) return false;
                return (
                    creature_description[constants.head_color] === concept_description[constants.head_color]
                )
            },
        },
		{
			[constants.name]: 'bugs_with_wings',
			[constants.phrase]: 'bugs with wings',
			[constants.logical_form]: 'bugs and wings',
			[constants.type]: constants.single_feature,
			[constants.description]: {
				[constants.creature]: constants.bug,
                [constants.wings_present]: constants.true,
            },
            [constants.rule]: function(creature_type, creature_description, concept_description) {
                if (concept_description[constants.creature] !== creature_type) return false;
                return (
                    creature_description[constants.wings_present] === concept_description[constants.wings_present]
                )
            },
        },
		{
			[constants.name]: 'bugs_with_purple_antennae',
			[constants.phrase]: 'bugs with purple antennae',
			[constants.logical_form]: 'bugs and purple antennae',
			[constants.type]: constants.single_feature,
			[constants.description]: {
				[constants.creature]: constants.bug,
                [constants.antennae_present]: constants.true,
                [constants.antennae_color]: constants.purple,
            },
            [constants.rule]: function(creature_type, creature_description, concept_description) {
                if (concept_description[constants.creature] !== creature_type) return false;
                return (
                    creature_description[constants.antennae_present] === concept_description[constants.antennae_present] &&
                    creature_description[constants.antennae_color] === concept_description[constants.antennae_color]                    
                )
            },
        },
		{
			[constants.name]: 'birds_with_tails',
			[constants.phrase]: 'birds with tails',
			[constants.logical_form]: 'birds and tails',
			[constants.type]: constants.single_feature,
			[constants.description]: {
				[constants.creature]: constants.bird,
                [constants.tail_present]: constants.true,
            },
            [constants.rule]: function(creature_type, creature_description, concept_description) {
                if (concept_description[constants.creature] !== creature_type) return false;
                return (
                    creature_description[constants.tail_present] === concept_description[constants.tail_present]
                )
            },
        }, 
		{
			[constants.name]: 'birds_with_purple_tails',
			[constants.phrase]: 'birds with purple tails',
			[constants.logical_form]: 'birds and purple tails',
			[constants.type]: constants.single_feature,
			[constants.description]: {
				[constants.creature]: constants.bird,
                [constants.tail_present]: constants.true,
                [constants.crest_tail_color]: constants.purple
            },
            [constants.rule]: function(creature_type, creature_description, concept_description) {
                if (concept_description[constants.creature] !== creature_type) return false;
                return (
                    creature_description[constants.tail_present] === concept_description[constants.tail_present] &&
                    creature_description[constants.crest_tail_color] === concept_description[constants.crest_tail_color]
                )
            },
        }, 
		{
			[constants.name]: 'birds_with_white_wings',
			[constants.phrase]: 'birds with white wings',
			[constants.logical_form]: 'birds and white wings',
			[constants.type]: constants.single_feature,
			[constants.description]: {
				[constants.creature]: constants.bird,
                [constants.bird_wing_color]: constants.white,
            },
            [constants.rule]: function(creature_type, creature_description, concept_description) {
                if (concept_description[constants.creature] !== creature_type) return false;
                return (
                    creature_description[constants.bird_wing_color] === concept_description[constants.bird_wing_color]
                )
            },
        }, 
		// {
		// 	[constants.name]: 'flowers_thorns_green_spots',
		// 	[constants.phrase]: 'Flowers with thorns and green spots',
		// 	[constants.logical_form]: 'flowers AND thorns AND spots AND green spots',
		// 	[constants.type]: constants.conjunction,
		// 	[constants.description]: {
		// 		[constants.creature]: constants.flower,
		// 		[constants.thorns_present]: constants.true,
		// 		[constants.spots_present]: constants.true,
		// 		[constants.spots_color]: constants.green,
        //     },
        //     [constants.rule]: function(creature_type, creature_description, concept_description) {
        //         if (concept_description[constants.creature] !== creature_type) return false;
        //         return (
        //             creature_description[constants.thorns_present] === constants.true &&
        //             creature_description[constants.spots_present] === constants.true &&
        //             creature_description[constants.spots_color] === constants.green
        //         )
        //     },
		// },
		// {
		// 	[constants.name]: 'fat_blue_birds',
		// 	[constants.phrase]: 'Fat Blue Birds',
		// 	[constants.logical_form]: 'birds AND fat AND blue body',
		// 	[constants.type]: constants.conjunction,
		// 	[constants.description]: {
		// 		[constants.creature]: constants.bird,
		// 		[constants.fatness]: constants.large,
		// 		[constants.body_color]: constants.blue,
        //     },
        //     [constants.rule]: function(creature_type, creature_description, concept_description) {
        //         if (concept_description[constants.creature] !== creature_type) return false;
        //         return (
        //             creature_description[constants.fatness] === concept_description[constants.fatness].large &&
        //             creature_description[constants.body_color] === concept_description[constants.body_color]
        //         )
        //     },
		// },
		// {
		// 	[constants.name]: 'trees_blue_berries',
		// 	[constants.phrase]: 'Trees with blue berries',
		// 	[constants.logical_form]: 'trees AND blue berries',
		// 	[constants.type]: constants.conjunction,
		// 	[constants.description]: {
		// 		[constants.creature]: constants.tree,
		// 		[constants.berries_present]: constants.true,
		// 		[constants.berries_color]: constants.blue,
        //     },
        //     [constants.rule]: function(creature_type, creature_description, concept_description) {
        //         if (concept_description[constants.creature] !== creature_type) return false;
        //         return (
        //             creature_description[constants.berries_present] === concept_description[constants.berries_present] &&
        //             creature_description[constants.berries_color] === concept_description[constants.berries_color]
        //         );
        //     }
        // },
		// {
		// 	[constants.name]: 'trees_blue_berries_or_red_leaves',
		// 	[constants.phrase]: 'Trees with blue berries or red leaves',
		// 	[constants.logical_form]: 'trees AND (blue berries or red leaves)',
		// 	[constants.type]: constants.disjunction,
		// 	[constants.description]: {
		// 		[constants.creature]: constants.tree,
		// 		[constants.berries_present]: constants.true,
        //         [constants.berries_color]: constants.blue,
        //         [constants.leaves_present]: constants.true,
        //         [constants.leaves_color]: constants.red,
        //     },
        //     [constants.rule]: function(creature_type, creature_description, concept_description) {
        //         if (concept_description[constants.creature] !== creature_type) return false;
        //         var result =  (
        //             (
        //                 creature_description[constants.berries_present] === concept_description[constants.berries_present] &&
        //                 creature_description[constants.berries_color] === concept_description[constants.berries_color]
        //             ) ||
        //             (
        //                 creature_description[constants.leaves_present] === concept_description[constants.leaves_present] &&
        //                 creature_description[constants.leaves_color] === concept_description[constants.leaves_color]
        //             )
        //         );
        //         return result;
        //     }
		// },
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