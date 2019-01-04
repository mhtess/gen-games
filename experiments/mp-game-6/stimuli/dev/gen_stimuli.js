// -------
// Imports
// -------
var stimuliGen = require('../../../sharedUtils/stimuli/genConceptLearningCritters.js')
var constants = stimuliGen.constants;
var _ = require('lodash');

var stimuliGeneration = function() {
	var single_feature_concepts = [
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
		// {
		// 	[constants.name]: 'flowers_with_purple_spots',
		// 	[constants.phrase]: 'Flowers with purple spots',
		// 	[constants.logical_form]: 'flowers and purple spots',
		// 	[constants.type]: constants.single_feature,
		// 	[constants.description]: {
		// 		[constants.creature]: constants.flower,
        //         [constants.spots_present]: constants.true,
        //         [constants.spots_color]: constants.purple,
        //     },
        //     [constants.rule]: function(creature_type, creature_description, concept_description) {
        //         if (concept_description[constants.creature] !== creature_type) return false;
        //         return (
        //             creature_description[constants.spots_present] === concept_description[constants.spots_present] &&
        //             creature_description[constants.spots_color] === concept_description[constants.spots_color]
        //         )
        //     },
        // },
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
		// {
		// 	[constants.name]: 'fish_with_purple_stripes',
		// 	[constants.phrase]: 'Fish with purple stripes',
		// 	[constants.logical_form]: 'fish and purple stripes',
		// 	[constants.type]: constants.single_feature,
		// 	[constants.description]: {
        //         [constants.creature]: constants.fish,
        //         [constants.stripes_present]: constants.true,
        //         [constants.stripes_color]: constants.purple,
        //     },
        //     [constants.rule]: function(creature_type, creature_description, concept_description) {
        //         if (concept_description[constants.creature] !== creature_type) return false;
        //         return (
        //             creature_description[constants.stripes_present] === concept_description[constants.stripes_present] &&
        //             creature_description[constants.stripes_color] === concept_description[constants.stripes_color]
        //         )
        //     },
        // }, 
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
			[constants.name]: 'bugs_without_wings',
			[constants.phrase]: 'bugs without wings',
			[constants.logical_form]: 'bugs and no wings',
			[constants.type]: constants.single_feature,
			[constants.description]: {
				[constants.creature]: constants.bug,
                [constants.wings_present]: constants.false,
            },
            [constants.rule]: function(creature_type, creature_description, concept_description) {
                if (concept_description[constants.creature] !== creature_type) return false;
                return (
                    creature_description[constants.wings_present] === concept_description[constants.wings_present]
                )
            },
        },
		// {
		// 	[constants.name]: 'bugs_with_purple_antennae',
		// 	[constants.phrase]: 'bugs with purple antennae',
		// 	[constants.logical_form]: 'bugs and purple antennae',
		// 	[constants.type]: constants.single_feature,
		// 	[constants.description]: {
		// 		[constants.creature]: constants.bug,
        //         [constants.antennae_present]: constants.true,
        //         [constants.antennae_color]: constants.purple,
        //     },
        //     [constants.rule]: function(creature_type, creature_description, concept_description) {
        //         if (concept_description[constants.creature] !== creature_type) return false;
        //         return (
        //             creature_description[constants.antennae_present] === concept_description[constants.antennae_present] &&
        //             creature_description[constants.antennae_color] === concept_description[constants.antennae_color]                    
        //         )
        //     },
        // },
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
		// {
		// 	[constants.name]: 'birds_with_white_wings',
		// 	[constants.phrase]: 'birds with white wings',
		// 	[constants.logical_form]: 'birds and white wings',
		// 	[constants.type]: constants.single_feature,
		// 	[constants.description]: {
		// 		[constants.creature]: constants.bird,
        //         [constants.bird_wing_color]: constants.white,
        //     },
        //     [constants.rule]: function(creature_type, creature_description, concept_description) {
        //         if (concept_description[constants.creature] !== creature_type) return false;
        //         return (
        //             creature_description[constants.bird_wing_color] === concept_description[constants.bird_wing_color]
        //         )
        //     },
        // },
		{
			[constants.name]: 'trees_with_purple_berries',
			[constants.phrase]: 'trees with purple berries',
			[constants.logical_form]: 'birds and purple berries',
			[constants.type]: constants.single_feature,
			[constants.description]: {
				[constants.creature]: constants.tree,
                [constants.berries_present]: constants.true,
                [constants.berries_color]: constants.purple,
            },
            [constants.rule]: function(creature_type, creature_description, concept_description) {
                if (concept_description[constants.creature] !== creature_type) return false;
                return (
                    creature_description[constants.berries_present] === concept_description[constants.berries_present] &&
                    creature_description[constants.berries_color] === concept_description[constants.berries_color]
                )
            },
        },
		{
			[constants.name]: 'trees_without_leaves',
			[constants.phrase]: 'trees without leaves',
			[constants.logical_form]: 'trees and no leaves',
			[constants.type]: constants.single_feature,
			[constants.description]: {
				[constants.creature]: constants.tree,
                [constants.leaves_present]: constants.false,
            },
            [constants.rule]: function(creature_type, creature_description, concept_description) {
                if (concept_description[constants.creature] !== creature_type) return false;
                return (
                    creature_description[constants.leaves_present] === concept_description[constants.leaves_present]
                )
            },
        },
		// {
		// 	[constants.name]: 'trees_with_white_trunks',
		// 	[constants.phrase]: 'trees with white trunks',
		// 	[constants.logical_form]: 'trees and white trunks',
		// 	[constants.type]: constants.single_feature,
		// 	[constants.description]: {
		// 		[constants.creature]: constants.tree,
        //         [constants.trunk_color]: constants.white,
        //     },
        //     [constants.rule]: function(creature_type, creature_description, concept_description) {
        //         if (concept_description[constants.creature] !== creature_type) return false;
        //         return (
        //             creature_description[constants.trunk_color] === concept_description[constants.trunk_color]                    
        //         )
        //     },
        // },
	];

    var conjunction_concepts = [
        {
			[constants.name]: 'flowers_with_purple_stems_white_spots',
			[constants.phrase]: 'Flowers with purple stems and white spots',
			[constants.logical_form]: 'flowers and purple stems and white spots',
			[constants.type]: constants.conjunction,
			[constants.description]: {
				[constants.creature]: constants.flower,
                [constants.stem_color]: constants.purple,
                [constants.spots_present]: constants.true,
                [constants.spots_color]: constants.white,
            },
            [constants.rule]: stimuliGen.createConjunctiveRule(),
        },
        {
			[constants.name]: 'flowers_with_thorns_spots',
			[constants.phrase]: 'Flowers with thorns and spots',
			[constants.logical_form]: 'flowers and thorns and spots',
			[constants.type]: constants.conjunction,
			[constants.description]: {
				[constants.creature]: constants.flower,
                [constants.spots_present]: constants.true,
                [constants.thorns_present]: constants.true,
            },
            [constants.rule]: stimuliGen.createConjunctiveRule(),
        },
        // {
		// 	[constants.name]: 'flowers_with_orange_petals_purple_centers',
		// 	[constants.phrase]: 'Flowers with orange petals and purple centers',
		// 	[constants.logical_form]: 'flowers and orange petals and purple centers',
		// 	[constants.type]: constants.conjunction,
		// 	[constants.description]: {
		// 		[constants.creature]: constants.flower,
        //         [constants.petals_color]: constants.orange,
        //         [constants.center_color]: constants.purple,
        //     },
        //     [constants.rule]: stimuliGen.createConjunctiveRule(),
        // },
        {
			[constants.name]: 'fish_orange_bodies_purple_stripes',
			[constants.phrase]: 'Fish with orange bodies and purple stripes',
			[constants.logical_form]: 'fish and orange bodies and purple stripes',
			[constants.type]: constants.conjunction,
			[constants.description]: {
				[constants.creature]: constants.fish,
                [constants.body_color]: constants.orange,
                [constants.stripes_present]: constants.true,
                [constants.stripes_color]: constants.purple,
            },
            [constants.rule]: stimuliGen.createConjunctiveRule(),
        },
        {
			[constants.name]: 'fish_white_stripes_whiskers',
			[constants.phrase]: 'Fish with white stripes and whiskers',
			[constants.logical_form]: 'fish and white stripes and whiskers',
			[constants.type]: constants.conjunction,
			[constants.description]: {
				[constants.creature]: constants.fish,
                [constants.whiskers_present]: constants.true,
                [constants.stripes_present]: constants.true,
                [constants.stripes_color]: constants.white,
            },
            [constants.rule]: stimuliGen.createConjunctiveRule(),
        },
        // {
		// 	[constants.name]: 'fish_fangs_without_whiskers',
		// 	[constants.phrase]: 'Fish with fangs and without whiskers',
		// 	[constants.logical_form]: 'fish and fangs and no whiskers',
		// 	[constants.type]: constants.conjunction,
		// 	[constants.description]: {
		// 		[constants.creature]: constants.fish,
        //         [constants.whiskers_present]: constants.false,
        //         [constants.fangs_present]: constants.true,
        //     },
        //     [constants.rule]: stimuliGen.createConjunctiveRule(),
        // },
        {
			[constants.name]: 'bugs_purple_legs_white_heads',
			[constants.phrase]: 'Bugs with purple legs and white heads',
			[constants.logical_form]: 'bugs and purple legs and white heads',
			[constants.type]: constants.conjunction,
			[constants.description]: {
				[constants.creature]: constants.bug,
                [constants.legs_color]: constants.purple,
                [constants.head_color]: constants.white,
            },
            [constants.rule]: stimuliGen.createConjunctiveRule(),
        },
        {
			[constants.name]: 'bugs_wings_antennae',
			[constants.phrase]: 'Bugs with wings and antennae',
			[constants.logical_form]: 'bugs and wings and antennae',
			[constants.type]: constants.conjunction,
			[constants.description]: {
				[constants.creature]: constants.bug,
                [constants.wings_present]: constants.true,
                [constants.antennae_present]: constants.true,
            },
            [constants.rule]: stimuliGen.createConjunctiveRule(),
        },
        // {
		// 	[constants.name]: 'bugs_orange_antennae_orange_wings',
		// 	[constants.phrase]: 'Bugs with orange antennae and orange wings',
		// 	[constants.logical_form]: 'bugs and orange antennae and orange wings',
		// 	[constants.type]: constants.conjunction,
		// 	[constants.description]: {
		// 		[constants.creature]: constants.bug,
        //         [constants.wings_present]: constants.true,
        //         [constants.bug_wings_color]: constants.orange,
        //         [constants.antennae_present]: constants.true,
        //         [constants.antennae_color]: constants.orange,
        //     },
        //     [constants.rule]: stimuliGen.createConjunctiveRule(),
        // },
        {
			[constants.name]: 'birds_purple_wings_white_crests',
			[constants.phrase]: 'Birds with purple wings and white crests',
			[constants.logical_form]: 'birds and purple wings and white crests',
			[constants.type]: constants.conjunction,
			[constants.description]: {
				[constants.creature]: constants.bird,
                [constants.bird_wing_color]: constants.purple,
                [constants.crest_present]: constants.true,
                [constants.crest_tail_color]: constants.white,
            },
            [constants.rule]: stimuliGen.createConjunctiveRule(),
        },
        {
			[constants.name]: 'birds_orange_wings_purple_tails',
			[constants.phrase]: 'Birds with orange wings and purple tails',
			[constants.logical_form]: 'birds and orange wings and purple tail',
			[constants.type]: constants.conjunction,
			[constants.description]: {
				[constants.creature]: constants.bird,
                [constants.bird_wing_color]: constants.orange,
                [constants.tail_present]: constants.true,
                [constants.crest_tail_color]: constants.purple,
            },
            [constants.rule]: stimuliGen.createConjunctiveRule(),
        },
        // {
		// 	[constants.name]: 'birds_white_crests_white_tails',
		// 	[constants.phrase]: 'Birds with white crests and white tails',
		// 	[constants.logical_form]: 'birds and white crests and white tails',
		// 	[constants.type]: constants.conjunction,
		// 	[constants.description]: {
		// 		[constants.creature]: constants.bird,
        //         [constants.crest_present]: constants.true,
        //         [constants.tail_present]: constants.true,                
        //         [constants.crest_tail_color]: constants.white,
        //     },
        //     [constants.rule]: stimuliGen.createConjunctiveRule(),
        // },
		{
			[constants.name]: 'trees_purple_berries_orange_trunks',
			[constants.phrase]: 'trees with purple berries and orange trunks',
			[constants.logical_form]: 'trees and purple berries and orange trunks',
			[constants.type]: constants.conjunction,
			[constants.description]: {
				[constants.creature]: constants.tree,
                [constants.berries_present]: constants.true,
                [constants.berries_color]: constants.purple,
                [constants.trunk_color]: constants.orange,
            },
            [constants.rule]: stimuliGen.createConjunctiveRule(),
        },
		{
			[constants.name]: 'trees_leaves_berries',
			[constants.phrase]: 'trees with leaves and berries',
			[constants.logical_form]: 'trees and leaves and berries',
			[constants.type]: constants.conjunction,
			[constants.description]: {
				[constants.creature]: constants.tree,
                [constants.berries_present]: constants.true,
                [constants.leaves_present]: constants.true,
            },
            [constants.rule]: stimuliGen.createConjunctiveRule(),
        },
		// {
		// 	[constants.name]: 'trees_white_leaves_purple_trunks',
		// 	[constants.phrase]: 'trees with white leaves and purple trunks',
		// 	[constants.logical_form]: 'trees and white leaves and purple trunks',
		// 	[constants.type]: constants.conjunction,
		// 	[constants.description]: {
		// 		[constants.creature]: constants.tree,
        //         [constants.leaves_present]: constants.true,
        //         [constants.leaves_color]: constants.white,
        //         [constants.trunk_color]: constants.purple,
        //     },
        //     [constants.rule]: stimuliGen.createConjunctiveRule(),
        // },         
    ];

    var disjunction_concepts = [

    ];

    var conjunction_conjunction_concepts = [
        {
			[constants.name]: 'flowers_with_purple_stems_white_spots_thorns',
			[constants.phrase]: 'Flowers with purple stems and white spots and thorns',
			[constants.logical_form]: 'flowers and purple stems and white spots and thorns',
			[constants.type]: constants.conjunction_conjunction,
			[constants.description]: {
				[constants.creature]: constants.flower,
                [constants.stem_color]: constants.purple,
                [constants.spots_present]: constants.true,
                [constants.spots_color]: constants.white,
                [constants.thorns_present]: constants.true,
            },
            [constants.rule]: stimuliGen.createConjunctiveRule(),
        },
        {
			[constants.name]: 'flowers_with_thorns_spots_orange_stems',
			[constants.phrase]: 'Flowers with thorns and spots and orange stems',
			[constants.logical_form]: 'flowers and thorns and spots and orange stems',
			[constants.type]: constants.conjunction_conjunction,
			[constants.description]: {
				[constants.creature]: constants.flower,
                [constants.spots_present]: constants.true,
                [constants.thorns_present]: constants.true,
                [constants.stem_color]: constants.orange,                
            },
            [constants.rule]: stimuliGen.createConjunctiveRule(),
        },
        // {
		// 	[constants.name]: 'flowers_with_white_petals_purple_centers_orange_stems',
		// 	[constants.phrase]: 'Flowers with white petals and purple centers and orange stems',
		// 	[constants.logical_form]: 'flowers and white petals and purple centers and orange stems',
		// 	[constants.type]: constants.conjunction_conjunction,
		// 	[constants.description]: {
		// 		[constants.creature]: constants.flower,
        //         [constants.petals_color]: constants.white,
        //         [constants.center_color]: constants.purple,
        //         [constants.stem_color]: constants.orange,                
        //     },
        //     [constants.rule]: stimuliGen.createConjunctiveRule(),
        // },
        {
			[constants.name]: 'fish_orange_bodies_purple_stripes_whiskers',
			[constants.phrase]: 'Fish with orange bodies and purple stripes and whiskers',
			[constants.logical_form]: 'fish and orange bodies and purple stripes and whiskers',
			[constants.type]: constants.conjunction_conjunction,
			[constants.description]: {
				[constants.creature]: constants.fish,
                [constants.body_color]: constants.orange,
                [constants.stripes_present]: constants.true,
                [constants.stripes_color]: constants.purple,
                [constants.whiskers_present]: constants.true,                
            },
            [constants.rule]: stimuliGen.createConjunctiveRule(),
        },
        {
			[constants.name]: 'fish_white_bodies_orange_stripes_fangs',
			[constants.phrase]: 'Fish with white bodies and orange stripes and fangs',
			[constants.logical_form]: 'fish and white bodies and orange stripes and fangs',
			[constants.type]: constants.conjunction_conjunction,
			[constants.description]: {
				[constants.creature]: constants.fish,
                [constants.body_color]: constants.white,
                [constants.stripes_present]: constants.true,
                [constants.stripes_color]: constants.orange,
                [constants.fangs_present]: constants.true,                
            },
            [constants.rule]: stimuliGen.createConjunctiveRule(),
        },
        // {
		// 	[constants.name]: 'fish_fangs_whiskers_white_stripes',
		// 	[constants.phrase]: 'Fish with fangs and whiskers and white stripes',
		// 	[constants.logical_form]: 'fish and fangs and whiskers and white stripes',
		// 	[constants.type]: constants.conjunction_conjunction,
		// 	[constants.description]: {
		// 		[constants.creature]: constants.fish,
        //         [constants.fangs_present]: constants.true,
        //         [constants.whiskers_present]: constants.true,
        //         [constants.stripes_present]: constants.true,
        //         [constants.stripes_color]: constants.white,

        //     },
        //     [constants.rule]: stimuliGen.createConjunctiveRule(),
        // },
    ];

    var disjunction_disjunction_concepts = [

    ];

    var conjunction_disjunction_concepts = [

    ];

    var disjunction_conjunction_concepts = [

    ];

    var concepts = _.concat(
        single_feature_concepts,
        conjunction_concepts,
        disjunction_concepts,
        conjunction_disjunction_concepts,
        disjunction_conjunction_concepts
    ); 
	stimuliGen.genDatasets(concepts, 50, 50, './pilot');

}

stimuliGeneration();