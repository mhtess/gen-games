// -------------------------------------------------------
// Generate Critters for Piantadosi Replication Experiment
// -------------------------------------------------------
// For this replication experiment, we mimic the Piantadosi
// experimental paradigm, where there are 3 dimensions
// of variability allowed for any given object. And each
// dimension has three possible values, yielding 27 possible
// objects for the replication experiment.
// 
// For any set, there can be between 1 - 5 objects. In this
// replication, we are using Erin DB's Stimuli Genearation
// package. 
//
// Specifically, we only generate fish, bugs, and birds. 
// Prop2 (tailsize) are held constant. Additionally, tar1
// (fangs) is held false for all samples and tar2 (whiskers)
// is held true for all samples. The stripe color is 
// kept to the same as the body color, and all fish
// have stripes. This reduces the
// possible axes of variability to 3, like in the Piantadosi
// experiment.
//
// These 3 dimensions are namely: col1/col2/col3, prop1 (bodysize),
// and critter type. We shall randomly sample values for
// each of this dimensions from sets of size 3.
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

var creatureOpts = {
	"critterTypes": ["fish", "bug", "bird"],
	"col1": ["blue", "green", "orange"],
	"prop1": ["small", "medium", "large"],
	"prop2": ["small"],
	"tar1": ["does_not_exist"],
	"tar2": ["exists"],
	"tar3": ["exists"],	
}

// ------------------
// Dataset Generation
// ------------------
var createDatset = function(rule, numSets, upper_bound_num_critters) {
	// Define dataset of some number of sets of critters.
	// ---------
	// rule: function that evaluates a dictionary of "col1", "col2",
	//		 "tar1", "tar2", "tar3", "prop1", "prop2" values and returns T/F
	//		 according to whether the critter fits the given concept rule
	// numSets: number of sets in the dataset
	// upper_bound_num_critters: upper bound on the number of critters
	var data = [];
	for (var i in _.range(numSets)) {
		var critterSet = createCritterSet(rule, upper_bound_num_critters);
		data.push(critterSet);
	}
	return data;
}

var createCritterSet = function(rule, upper_bound_num_critters) {
	// Define critter set consisting of some number of critters (1-5).
	// ---------
	// rule: function that evaluates a dictionary of "col1", "col2",
	//		 "tar1", "tar2", "tar3", "prop1", "prop2" values and returns T/F
	//		 according to whether the critter fits the given concept rule
	// upper_bound_num_critters: upper bound on the number of critters
	var critterSet = [];
	var numCritters = _.random(1, 1, false);
	for (var i in _.range(numCritters)) {
		var critter = createCritter(rule, color_dict, creatureOpts);
		critterSet.push(critter);
	}
	return critterSet;
}

var createCritter = function(rule) {
	// Define critter and label it according to the given rule.
	// ---------
	// rule: function that evaluates a dictionary of "col1", "col2",
	//		 "tar1", "tar2", "tar3", "prop1", "prop2" values and returns T/F
	//		 according to whether the critter fits the given concept rule
	var critter = {
		critter: _.sample(creatureOpts["critterTypes"]),
		props: {
			"col1": color_dict[_.sample(creatureOpts["col1"])],
			"tar1": tar1_dict[_.sample(creatureOpts["tar1"])],
			"tar2": tar2_dict[_.sample(creatureOpts["tar2"])],
			"tar3": tar3_dict[_.sample(creatureOpts["tar3"])],
			"prop1": prop1_dict[_.sample(creatureOpts["prop1"])],
			"prop2": prop2_dict[_.sample(creatureOpts["prop2"])],
		}
	};
	critter["belongs_to_concept"] = rule(critter);
	critter["props"]["col2"] = critter["props"]["col1"];
	critter["props"]["col3"] = critter["props"]["col1"]; // Constant color 
	critter["props"]["col4"] = critter["props"]["col1"]; // Constant color 
	critter["props"]["col5"] = critter["props"]["col1"]; // Constant color 
	return critter;
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
	var data = createDatset(rule, 5);
	var data_str = JSON.stringify(data, null, 4);
}

// ----
// MAIN
// ----
var numSets = 50;
var easy_rule = function(critter) {
	// Rule: If critter is orange
	return critter["props"]["col1"] === color_dict["orange"]
} 
var easy_rule_data = createDatset(easy_rule, numSets);
console.log(String(easy_rule_data.length) + " Sets for Easy Rule Data Generated");
saveDatasetToFile(easy_rule_data, './easy_rule_data.js');

var medium_rule = function(critter) {
	// Rule: If critter has small and green
	return critter["props"]["col1"] === color_dict["green"] && critter["props"]["prop1"] === prop1_dict["small"];
} 
var medium_rule_data = createDatset(medium_rule, numSets);
console.log(String(medium_rule_data.length) + " Sets for Medium Rule Data Generated");
saveDatasetToFile(medium_rule_data, './medium_rule_data.js');

var hard_rule = function(critter) {
	// Rule: If critter is a fish XOR blue body
	return (
		(critter["critter"] === "fish" || critter["props"]["col1"] === color_dict["blue"]) &&
		!(critter["critter"] === "fish" && critter["props"]["col1"] === color_dict["blue"])
	);	
}
var hard_rule_data = createDatset(medium_rule, numSets);
console.log(String(hard_rule_data.length) + " Sets for Hard Rule Data Generated");
saveDatasetToFile(hard_rule_data, './hard_rule_data.js');