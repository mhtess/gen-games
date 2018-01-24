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
// Specifically, we only generate fish. 
// Prop2 (tailsize) are held constant. Additionally, tar1
// (fangs) is held false for all samples and tar2 (whiskers)
// is held true for all samples. This reduces the
// possible axes of variability to 3, like in the Piantadosi
// experiment.
//
// These 3 dimensions are namely: col1 (body color), col2 (fin color),
// and prop1 (bodysize). We shall randomly sample values for
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
	"small": Math.log(2),
	"medium": Math.log(3),
	"large": Math.log(4)
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

var creatureOpts = {
		"col1": ["blue", "red", "purple"],
		"col2": ["green", "yellow", "orange"],
		"prop1": ["small", "medium", "large"],
		"prop2": ["small"],
		"tar1": ["does_not_exist"],
		"tar2": ["exists"],	
}

// ------------------
// Dataset Generation
// ------------------
var createDatset = function(rule, numSets) {
	// Define dataset of some number of sets of critters.
	// ---------
	// rule: function that evaluates a dictionary of "col1", "col2",
	//		 "tar1", "tar2", "prop1", "prop2" values and returns T/F
	//		 according to whether the critter fits the given concept rule
	// numSets: number of sets in the dataset
	var data = [];
	for (var i in _.range(numSets)) {
		var critterSet = createCritterSet(rule, color_dict, creatureOpts);
		data.push(critterSet);
	}
	return data;
}

var createCritterSet = function(rule) {
	// Define critter set consisting of some number of critters (1-5).
	// ---------
	// rule: function that evaluates a dictionary of "col1", "col2",
	//		 "tar1", "tar2", "prop1", "prop2" values and returns T/F
	//		 according to whether the critter fits the given concept rule
	var critterSet = [];
	var numCritters = _.random(1, 6, false);
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
	//		 "tar1", "tar2", "prop1", "prop2" values and returns T/F
	//		 according to whether the critter fits the given concept rule
	var critter = {
		critter: "fish",
		props: {
			"col1": color_dict[_.sample(creatureOpts["col1"])],
			"col2": color_dict[_.sample(creatureOpts["col2"])],
			"tar1": tar1_dict[_.sample(creatureOpts["tar1"])],
			"tar2": tar2_dict[_.sample(creatureOpts["tar2"])],
			"prop1": prop1_dict[_.sample(creatureOpts["prop1"])],
			"prop2": prop2_dict[_.sample(creatureOpts["prop2"])],
		}
	};
	critter['belongs_to_concept'] = rule(critter.props);
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
	var rule = function(props) {
		// Example Rule: If critter is small and has a blue body
		return props["col1"] === color_dict["blue"] && props["prop1"] === prop1_dict["small"];
	} 
	var data = createDatset(rule, 5);
	var data_str = JSON.stringify(data, null, 4);
	console.log(data_str);	
}

// ----
// MAIN
// ----
var numSets = 2;
var easy_rule = function(props) {
	// Rule: If critter is small and has a blue body
	return props["col1"] === color_dict["blue"] && props["prop1"] === prop1_dict["small"];
} 
var easy_rule_data = createDatset(easy_rule, numSets);
console.log(String(easy_rule_data.length) + " Sets for Easy Rule Data Generated");
saveDatasetToFile(easy_rule_data, './easy_rule_data.js');

var medium_rule = function(props) {
	// Rule: If critter has green fin XOR blue body
	return (
		(props["col2"] === color_dict["green"] || props["col1"] === color_dict["blue"]) &&
		!(props["col2"] === color_dict["green"] && props["col1"] === color_dict["blue"])
	);
} 
var medium_rule_data = createDatset(medium_rule, numSets);
console.log(String(medium_rule_data.length) + " Sets for Medium Rule Data Generated");
saveDatasetToFile(medium_rule_data, './medium_rule_data.js');