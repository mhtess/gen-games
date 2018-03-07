// -------------------------------------------------------
// Generate Critters for Multiplayer Concept Learning Game
// -------------------------------------------------------
// Here we generate critters with 4 properties and 3 possible
// values for each property. These 4 properties are critter
// type, body size, primary color, and secondary color.
//
// Critter Types: Fish, Bugs, Birds
// Body Size: Small, Medium, Large
// Primary Color: Blue, Green, Orange
// Secondary Color: Purple, Yellow, Red
//
// This provides a set of 81 possible critters.
// 50 critters are mantained for a training set, and 31 critters
// are left for a test set.
// -------------------------------------------------------

// -------
// IMPORTS
// -------
var _ = require('lodash');
var jsonfile = require('jsonfile');

// --------------------------------------
// Creature Properties (Global Variables)
// --------------------------------------
var color_dict = {
	"blue": "#5da5db",
	"red": "#f42935",
	"yellow": "#eec900",
	"green": "#228b22",
	"orange": "#ff8c00",
	"purple": "#dda0dd"
}
var prop1_dict = {
	"small": Math.log(1.0),
	"medium": Math.log(2.0),
	"large": Math.log(3.2)
}
var prop2_dict = {
	"small": 0.2
}
var tar1_dict = {
	"does_not_exist": false,
}
var tar2_dict = {
	"exists": true,
}
var tar3_dict = {
	"exists": true,
}
var creature_opts = {
	"critterTypes": ["fish", "bug", "bird"],
	"body_color": ["blue", "green", "orange"],
	"secondary_color": ["red", "yellow", "purple"],
	"constant_color": ["brown"],
	"prop1": ["small", "medium", "large"],
	"prop2": ["small"],
	"tar1": ["does_not_exist"],
	"tar2": ["exists"],
	"tar3": ["exists"],
}

var critter_to_color_props = {
	"fish": {
		"body_color": ["col1"], // Body
		"secondary_color": ["col2"], // Fins
		"constant_color": ["col3", "col4", "col5"],
	},
	"bug": {
		"body_color": ["col5"], // Wings
		"secondary_color": ["col2"], // Head
		"constant_color": ["col1", "col4", "col3"], // Head, Antennae, Wings
	},
	"bird": {
		"body_color": ["col2"], // Body
		"secondary_color": ["col1"], // Crest/Tail
		"constant_color": ["col3", "col4", "col5"], // Wings
	},

};

var enumerable_opts = ["critterTypes", "body_color", "secondary_color", "prop1"];

// ------------------
// Dataset Generation
// ------------------
var createDatset = function(rule, training_set_sz, enumerable_opts, creature_opts, critter_to_color_props) {
	// Define dataset of some number of sets of critters.
	// ---------
	// rule: function that evaluates a dictionary of "body_color", "secondary_color",
	//		 "tar1", "tar2", "tar3", "prop1", "prop2" values and returns T/F
	//		 according to whether the critter fits the given concept rule
	// training_set_sz: Training set size. If training set size >= possible
	//					unique creatures (given enumerable opts and creature_opts),
	//					then the test size becomes 0.
	// enumerable_opts: List of traits with multiple values
	// creature_opts: Possible trait options

	// Establish Base Critter (Constant Features Except Color)
	var base_critter = {};
	base_critter["props"] = {};
	for (let opt of Object.keys(creature_opts)) {
		if (enumerable_opts.indexOf(opt) < 0) {
			if (opt === "critterTypes") {
				base_critter.critter = creature_opts[opt][0];
			} else if (opt == "tar1") {
				base_critter["props"][opt] = tar1_dict[creature_opts[opt][0]];
			} else if (opt == "tar2") {
				base_critter["props"][opt] = tar2_dict[creature_opts[opt][0]];
			} else if (opt == "tar3") {
				base_critter["props"][opt] = tar3_dict[creature_opts[opt][0]];
			} else if (opt == "prop1") {
				base_critter["props"][opt] = prop1_dict[creature_opts[opt][0]];
			} else if (opt == "prop2") {
				base_critter["props"][opt] = prop2_dict[creature_opts[opt][0]];
			} 
		}
	}

	// Enumerate all possible stimuli
	var num_vals_per_opt = [];
	var num_critters = 1;
	for (let trait of enumerable_opts) {
		num_critters *= creature_opts[trait].length;
		num_vals_per_opt.push(creature_opts[trait].length);
	}
	var enumerate_opts = function(num_vals_per_opt, stimuli_descriptions) {
		if (num_vals_per_opt.length == 0) {
			return stimuli_descriptions;
		} else {
			var num_vals = num_vals_per_opt[0];
			var updated_stimuli_descriptions = [];

			for (let val of _.range(num_vals)) {
				if (stimuli_descriptions.length === 0) {
					updated_stimuli_descriptions.push([val]);
				} else {
					for (let stim of stimuli_descriptions) {
						var stim_copy = stim.slice(0);
						stim_copy.push(val);
						updated_stimuli_descriptions.push(stim_copy);
					}
				}
			}
			return enumerate_opts(num_vals_per_opt.slice(1), updated_stimuli_descriptions);
		}
	}
	var stimuli_descriptions = enumerate_opts(num_vals_per_opt, []);

	// Create all critters
	var stimuli = [];
	var num_satisfy_rule = 0;
	for (let descrip of stimuli_descriptions) {
		var critter = createCritter(base_critter, enumerable_opts, creature_opts, descrip, rule, critter_to_color_props);
		if (critter["belongs_to_concept"] === true) {
			num_satisfy_rule++;
		}
		stimuli.push(critter);
	}

	// Split critters into train and test sets
	var shuffled_stimuli = _.shuffle(stimuli);
	var num_satisfy_rule_training_set = Math.floor(num_satisfy_rule / num_critters * training_set_sz);
	var training_stimuli = [];
	var test_stimuli = [];
	var satisfy_rule_training_set_count = 0;
	var training_set_count = 0;
	for (let critter of shuffled_stimuli) {
		if (critter["belongs_to_concept"] === true && satisfy_rule_training_set_count < num_satisfy_rule_training_set) {
			training_stimuli.push(critter);
			satisfy_rule_training_set_count++;
			training_set_count++;
		} else if (critter["belongs_to_concept"]) {
			test_stimuli.push(critter);
		} else if (training_set_count < training_set_sz) {
			training_stimuli.push(critter);
			training_set_count++;
		} else {
			test_stimuli.push(critter);
		}
	}

	return [training_stimuli, test_stimuli]
}

var createCritter = function(base_critter, enumerable_opts, creature_opts, description, rule, critter_to_color_props) {
	// Define critter and label it according to the given rule.
	// ---------
	// base_critter: critter object where certain fields are held fixed
	// enumerable_opts: list of opts that we have changing values over
	// creature_opts: mapping of critter property -> categorical value
	// description: list of values in  the order of enumerable values,
	//				that indexes into the list of possible categorical values
	//				given by creature_opts
	// rule: function that evaluates a dictionary of "col1", "col2",
	//		 "tar1", "tar2", "tar3", "prop1", "prop2" values and returns T/F
	//		 according to whether the critter fits the given concept rule
	var critter = JSON.parse(JSON.stringify(base_critter));
	for (var i = 0; i < enumerable_opts.length; i++){
		var opt = enumerable_opts[i];
		var opt_val_idx = description[i];
		if (opt == "critterTypes") {
			critter.critter = creature_opts["critterTypes"][opt_val_idx];
		} else if (opt == "tar1") {
			critter["props"][opt] = tar1_dict[creature_opts[opt][opt_val_idx]];
		} else if (opt == "tar2") {
			critter["props"][opt] = tar2_dict[creature_opts[opt][opt_val_idx]];
		} else if (opt == "tar3") {
			critter["props"][opt] = tar3_dict[creature_opts[opt][opt_val_idx]];
		} else if (opt == "prop1") {
			critter["props"][opt] = prop1_dict[creature_opts[opt][opt_val_idx]];
		} else if (opt == "prop2") {
			critter["props"][opt] = prop2_dict[creature_opts[opt][opt_val_idx]];
		} else if (opt == "body_color") {
			var body_color_opt = critter_to_color_props[critter.critter][opt][0];
			var c = color_dict[creature_opts[opt][opt_val_idx]];
			critter["props"][body_color_opt] = c;
			critter["body_color"] = c;
			// console.log("Inside primary color for critter: " + critter.critter + " section under: " + body_color_opt + " , color: " + c);
		} else if (opt == "secondary_color") {
			var secondary_color_opt = critter_to_color_props[critter.critter][opt][0];
			var c = color_dict[creature_opts[opt][opt_val_idx]];
			critter["props"][secondary_color_opt] = c;
			critter["secondary_color"] = c;			
		} 
	}

	// Set constant color properties
	var opt = "constant_color";
	var constant_color_opts = critter_to_color_props[critter.critter][opt];
	for (let constant_color_opt of constant_color_opts) {
		var c = critter.secondary_color;
		critter["props"][constant_color_opt] = c;
	}			

	// Belongs to concept?
	var belongs_to_concept = rule(critter);
	critter["belongs_to_concept"] = belongs_to_concept;
	return critter
}

// ------------------
// Data File Creation
// ------------------
var saveDatasetToFile = function(dataset, filepath) {
	jsonfile.writeFile(filepath, dataset, function(err) {
		console.log(err);
	})
}

// ------------------
// Example End-to-End
// ------------------
var example = function() {
	// Creates and logs an example dataset to the console.
	var rule = function(critter) {
		// Example Rule: If critter is small and has a blue body
		return critter["props"]["col1"] === color_dict["blue"] && critter["props"]["prop1"] === prop1_dict["small"];
	}
	var data = createDatset(rule, 50, enumerable_opts, creature_opts, critter_to_color_props);
}
example()

// ----
// MAIN
// ----
var hard_rule = function(critter) {
	// Rule: If critter is a fish XOR blue body
	return (
		(critter["critter"] === "fish" || critter["body_color"] === color_dict["blue"]) &&
		!(critter["critter"] === "fish" && critter["body_color"] === color_dict["blue"])
	);
}
var hard_rule_data = createDatset(hard_rule, 50, enumerable_opts, creature_opts, critter_to_color_props);
saveDatasetToFile(hard_rule_data[0], './training_data.json');
saveDatasetToFile(hard_rule_data[1], './test_data.json');