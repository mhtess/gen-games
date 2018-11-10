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
var creatureGen = require('../../sharedUtils/genConceptLearningCritters');

// -------
// HELPERS
// -------
var NUM_TOTAL = 81;
var NUM_TRAIN = 50;
var NUM_TEST = NUM_TOTAL - NUM_TRAIN;
var SINGLE_FEAT = "SINGLE_FEAT";
var CONJUNCTION = "CONJUNCTION";
var DISJUNCTION = "DISJUNCTION";
var CONJUNCTION_CONJUNCTION = 'CONJUNCTION,CONJUNCTION';
var DISJUNCTION_DISJUNCTION = 'DISUNCTION,DISJUNCTION';
var CONJUNCTION_DISJUNCTION = 'CONJUNCTION,DISJUNCTION';
var DISJUNCTION_CONJUNCTION = 'DISJUNCTION,CONJUNCTION';

function genRules() {
	var rules = [];

	// // Rule: Body Color
	// rules.push({
	// 	name: "body_color_orange_1",
	// 	func: function(critter, color_dict, prop1_dict, critter_to_color_props) {
	// 		var critterBodyColorProp = critter_to_color_props[critter["critter"]]["body_color"][0];
	// 		return critter["props"][critterBodyColorProp] === color_dict["orange"];
	// 	},
	// 	type: SINGLE_FEAT,
	// });
	// rules.push({
	// 	name: "body_color_orange_2",
	// 	func: function(critter, color_dict, prop1_dict, critter_to_color_props) {
	// 		var critterBodyColorProp = critter_to_color_props[critter["critter"]]["body_color"][0];
	// 		return critter["props"][critterBodyColorProp] === color_dict["orange"];
	// 	},
	// 	type: SINGLE_FEAT,
	// });

	// // Rule: Critter And Body Color
	// rules.push({
	// 	name: "critter_fish_body_color_blue_1",
	// 	func: function(critter, color_dict, prop1_dict, critter_to_color_props) {
	// 		var critterBodyColorProp = critter_to_color_props[critter["critter"]]["body_color"][0];
	// 		return critter["critter"] === "fish" && critter["props"][critterBodyColorProp] === color_dict["blue"];
	// 	},
	// 	type: CONJUNCTION,
	// });
	// rules.push({
	// 	name: "critter_fish_body_color_blue_2",
	// 	func: function(critter, color_dict, prop1_dict, critter_to_color_props) {
	// 		var critterBodyColorProp = critter_to_color_props[critter["critter"]]["body_color"][0];
	// 		return critter["critter"] === "fish" && critter["props"][critterBodyColorProp] === color_dict["blue"];
	// 	},
	// 	type: CONJUNCTION,
	// });

	// // Rule: Body Color AND Second Color
	// rules.push({
	// 	name: "body_color_orange_secondary_color_purple_1",
	// 	func: function(critter, color_dict, prop1_dict, critter_to_color_props) {
	// 		var critterBodyColorProp = critter_to_color_props[critter["critter"]]["body_color"][0];
	// 		var critterSecondaryColorProp = critter_to_color_props[critter["critter"]]["secondary_color"][0];	
	// 		return critter["props"][critterBodyColorProp] === color_dict["orange"] && critter["props"][critterSecondaryColorProp] === color_dict["purple"];
	// 	},
	// 	type: CONJUNCTION,
	// });
	// rules.push({
	// 	name: "body_color_orange_secondary_color_purple_2",
	// 	func: function(critter, color_dict, prop1_dict, critter_to_color_props) {
	// 		var critterBodyColorProp = critter_to_color_props[critter["critter"]]["body_color"][0];
	// 		var critterSecondaryColorProp = critter_to_color_props[critter["critter"]]["secondary_color"][0];	
	// 		return critter["props"][critterBodyColorProp] === color_dict["orange"] && critter["props"][critterSecondaryColorProp] === color_dict["purple"];
	// 	},
	// 	type: CONJUNCTION,
	// });

	// // Rule: Critter OR Secondary Color
	// rules.push({
	// 	name: "critter_bug_or_secondary_color_yellow_1",
	// 	func: function(critter, color_dict, prop1_dict, critter_to_color_props) {
	// 		var critterSecondaryColorProp = critter_to_color_props[critter["critter"]]["secondary_color"][0];	
	// 		return critter["critter"] === "bug" || critter["props"][critterSecondaryColorProp] === color_dict["yellow"];
	// 	},
	// 	type: DISJUNCTION,
	// });
	// rules.push({
	// 	name: "critter_bug_or_secondary_color_yellow_2",
	// 	func: function(critter, color_dict, prop1_dict, critter_to_color_props) {
	// 		var critterSecondaryColorProp = critter_to_color_props[critter["critter"]]["secondary_color"][0];	
	// 		return critter["critter"] === "bug" || critter["props"][critterSecondaryColorProp] === color_dict["yellow"];
	// 	},
	// 	type: DISJUNCTION,
	// });

	// // Rule: Critter OR Primary Color
	// rules.push({
	// 	name: "critter_bird_or_body_color_green_1",
	// 	func: function(critter, color_dict, prop1_dict, critter_to_color_props) {
	// 		var critterBodyColorProp = critter_to_color_props[critter["critter"]]["body_color"][0];
	// 		return critter["critter"] === "bird" || critter["props"][critterBodyColorProp] === color_dict["green"];
	// 	},
	// 	type: DISJUNCTION,
	// });
	// rules.push({
	// 	name: "critter_bird_or_body_color_green_2",
	// 	func: function(critter, color_dict, prop1_dict, critter_to_color_props) {
	// 		var critterBodyColorProp = critter_to_color_props[critter["critter"]]["body_color"][0];
	// 		return critter["critter"] === "bird" || critter["props"][critterBodyColorProp] === color_dict["green"];
	// 	},
	// 	type: DISJUNCTION,
	// });

	// Primary Color or Secondary Color Or Critter Type — Medium Diff
	rules.push({
		name: "body_color_green_or_secondary_color_purple_or_critter_bug_1",
		func: function(critter, color_dict, prop1_dict, critter_to_color_props) {
			var critterBodyColorProp = critter_to_color_props[critter["critter"]]["body_color"][0];
			var critterSecondaryColorProp = critter_to_color_props[critter["critter"]]["secondary_color"][0];	
			return (
				critter["props"][critterBodyColorProp] === color_dict["green"] ||
				critter["props"][critterSecondaryColorProp] === color_dict["purple"] ||
				critter["critter"] === "bug"
			);
		},
		type: DISJUNCTION_DISJUNCTION,
	});


	// (Critter Type And Primary Color) Or Size — Medium Diff.
	rules.push({
		name: "(critter_bird_and_body_color_orange)_or_small_1",
		func: function(critter, color_dict, prop1_dict, critter_to_color_props) {
			var critterBodyColorProp = critter_to_color_props[critter["critter"]]["body_color"][0];
			var critterSecondaryColorProp = critter_to_color_props[critter["critter"]]["secondary_color"][0];
			return (
				(
					critter["props"][critterBodyColorProp] === color_dict["green"] &&
					critter["props"][critterSecondaryColorProp] === color_dict["purple"]
				) ||
				critter["props"]["prop1"] === prop1_dict["small"]
			);
		},
		type: CONJUNCTION_DISJUNCTION,
	});


	// (Critter Type And Size) or Primary Color — High Diff
	rules.push({
		name: "(critter_fish_and_large)_or_body_color_blue_1",
		func: function(critter, color_dict, prop1_dict, critter_to_color_props) {
			var critterBodyColorProp = critter_to_color_props[critter["critter"]]["body_color"][0];
			return (
				(
					critter["critter"] === "fish" &&
					critter["props"]["prop1"] === prop1_dict["large"]
				) ||
				critter["props"][critterBodyColorProp] === color_dict["blue"]
			);
		},
		type: CONJUNCTION_DISJUNCTION,
	});

	// (Critter Type Or Size) And Secondary Color — High Diff
	rules.push({
		name: "(critter_bug_or_medium)_and_second_color_red_1",
		func: function(critter, color_dict, prop1_dict, critter_to_color_props) {
			var critterSecondaryColorProp = critter_to_color_props[critter["critter"]]["secondary_color"][0];
			return (
				(
					critter["critter"] === "bug" ||
					critter["props"]["prop1"] === prop1_dict["large"]
				) &&
				critter["props"][critterSecondaryColorProp] === color_dict["red"]
			);
		},
		type: DISJUNCTION_CONJUNCTION,
	});


	// (Size Or Primary Color) And Secondary Color  — High Diff.
	rules.push({
		name: "(medium_or_body_color_green)_and_second_color_red_1",
		func: function(critter, color_dict, prop1_dict, critter_to_color_props) {
			var critterBodyColorProp = critter_to_color_props[critter["critter"]]["body_color"][0];
			var critterSecondaryColorProp = critter_to_color_props[critter["critter"]]["secondary_color"][0];
			return (
				(
					critter["props"]["prop1"] === prop1_dict["medium"] ||
					critter["props"][critterBodyColorProp] === color_dict["green"]
				) &&
				critter["props"][critterSecondaryColorProp] === color_dict["red"]
			);
		},
		type: DISJUNCTION_CONJUNCTION,
	});

	return rules;	
}

// ----
// MAIN
// ----
var rules = genRules();
creatureGen.genDatasets(rules, NUM_TRAIN);