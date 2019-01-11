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
			[constants.phrase]: 'flowers with orange stems',
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
			[constants.name]: 'flowers_thorns',
			[constants.phrase]: 'flowers with thorns',
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
			[constants.name]: 'fish_fangs',
			[constants.phrase]: 'fish with white fangs',
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
			[constants.name]: 'fish_whiskers',
			[constants.phrase]: 'fish with whiskers',
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
			[constants.name]: 'bugs_orange_head',
			[constants.phrase]: 'bugs with white orange head',
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
		
		{
			[constants.name]: 'birds_tails',
			[constants.phrase]: 'birds with tails',
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
			[constants.name]: 'birds_purple_tails',
			[constants.phrase]: 'birds with purple tails',
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
			[constants.name]: 'trees_purple_berries',
			[constants.phrase]: 'trees with purple berries',
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
	];

    var conjunction_concepts = [
        {
			[constants.name]: 'fish_orange_bodies_purple_stripes',
			[constants.phrase]: 'fish with orange bodies and purple stripes',
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
			[constants.phrase]: 'fish with white stripes and whiskers',
			[constants.type]: constants.conjunction,
			[constants.description]: {
				[constants.creature]: constants.fish,
                [constants.whiskers_present]: constants.true,
                [constants.stripes_present]: constants.true,
                [constants.stripes_color]: constants.white,
            },
            [constants.rule]: stimuliGen.createConjunctiveRule(),
        },
    
        {
			[constants.name]: 'bugs_purple_legs_white_heads',
			[constants.phrase]: 'bugs with purple legs and white heads',
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
			[constants.phrase]: 'bugs with wings and antennae',
			[constants.type]: constants.conjunction,
			[constants.description]: {
				[constants.creature]: constants.bug,
                [constants.wings_present]: constants.true,
                [constants.antennae_present]: constants.true,
            },
            [constants.rule]: stimuliGen.createConjunctiveRule(),
        },
        {
			[constants.name]: 'birds_purple_wings_crests',
			[constants.phrase]: 'birds with purple wings and crests',
			[constants.type]: constants.conjunction,
			[constants.description]: {
				[constants.creature]: constants.bird,
                [constants.bird_wing_color]: constants.purple,
                [constants.crest_present]: constants.true,
            },
            [constants.rule]: stimuliGen.createConjunctiveRule(),
        },
        {
			[constants.name]: 'birds_orange_wings_tails',
			[constants.phrase]: 'birds with orange wings and tails',
			[constants.type]: constants.conjunction,
			[constants.description]: {
				[constants.creature]: constants.bird,
                [constants.bird_wing_color]: constants.orange,
                [constants.tail_present]: constants.true,
            },
            [constants.rule]: stimuliGen.createConjunctiveRule(),
        },
		{
			[constants.name]: 'trees_orange_trunks_berries',
			[constants.phrase]: 'trees with orange trunks and berries',
			[constants.type]: constants.conjunction,
			[constants.description]: {
				[constants.creature]: constants.tree,
                [constants.berries_present]: constants.true,
                [constants.trunk_color]: constants.orange,
            },
            [constants.rule]: stimuliGen.createConjunctiveRule(),
        },
		{
			[constants.name]: 'trees_purple_leaves_berries',
			[constants.phrase]: 'trees with purple leaves and berries',
			[constants.type]: constants.conjunction,
			[constants.description]: {
				[constants.creature]: constants.tree,
                [constants.berries_present]: constants.true,
                [constants.leaves_present]: constants.true,
                [constants.leaves_color]: constants.purple,
            },
            [constants.rule]: stimuliGen.createConjunctiveRule(),
        },
        {
			[constants.name]: 'flowers_purple_stems_thorns',
			[constants.phrase]: 'flowers with purple stem and thorns',
			[constants.type]: constants.conjunction,
			[constants.description]: {
				[constants.creature]: constants.flower,
                [constants.stem_color]: constants.purple,
                [constants.thorns_present]: constants.true,
            },
            [constants.rule]: stimuliGen.createConjunctiveRule(),
        },
        {
            [constants.name]: 'flowers_orange_petals_purple_centers',
            [constants.phrase]: 'flowers with orange petals and purple centers',
            [constants.type]: constants.conjunction,
            [constants.description]: {
                [constants.creature]: constants.flower,
                [constants.petals_color]: constants.orange,
                [constants.center_color]: constants.purple,
            },
            [constants.rule]: stimuliGen.createConjunctiveRule(),
        },      
    ];

    var disjunction_concepts = [
        {
            [constants.name]: 'bugs_orange_antennae_or_wings',
            [constants.phrase]: 'bugs with orange antennae or wings',
            [constants.type]: constants.disjunction,
            [constants.description]: {
                [constants.creature]: constants.bug,
                [constants.antennae_present]: constants.true,
                [constants.antennae_color]: constants.orange,
                [constants.wings_present]: constants.true,
            },
            [constants.rule]: function(creature_type, creature_description, concept_description) {
                if (concept_description[constants.creature] !== creature_type) return false;
                return(
                    (
                        creature_description[constants.antennae_present] == concept_description[constants.antennae_present] &&
                        creature_description[constants.antennae_color] == concept_description[constants.antennae_color]    
                    )||
                    creature_description[constants.wings_present] == concept_description[constants.wings_present]
                )
            }
        },

        {
            [constants.name]: 'bugs_purple_wings_or_white_legs',
            [constants.phrase]: 'bugs with purple wings or white legs',
            [constants.type]: constants.disjunction,
            [constants.description]: {
                [constants.creature]: constants.bug,
                [constants.legs_color]: constants.white,
                [constants.wings_present]: constants.true,
                [constants.bug_wings_color]: constants.purple,
            },
            [constants.rule]: function(creature_type, creature_description, concept_description) {
                if (concept_description[constants.creature] !== creature_type) return false;
                return(
                    creature_description[constants.legs_color] == concept_description[constants.legs_color] ||
                    (creature_description[constants.wings_present] == concept_description[constants.wings_present] &&
                    creature_description[constants.bug_wings_color] == concept_description[constants.bug_wings_color])
                )
            }
        },

        {
            [constants.name]: 'birds_orange_tails_or_white_wings',
            [constants.phrase]: 'birds with orange tails or white wings',
            [constants.type]: constants.disjunction,
            [constants.description]: {
                [constants.creature]: constants.bird,
                [constants.bird_wing_color]: constants.white,
                [constants.tail_present]: constants.true,
                [constants.crest_tail_color]: constants.orange,
            },
            [constants.rule]: function(creature_type, creature_description, concept_description) {
                if (concept_description[constants.creature] !== creature_type) return false;
                return(
                    creature_description[constants.bird_wing_color] == concept_description[constants.bird_wing_color] ||
                    (creature_description[constants.tail_present] == concept_description[constants.tail_present] &&
                    creature_description[constants.crest_tail_color] == concept_description[constants.crest_tail_color])
                )
            }
        },
        {
            [constants.name]: 'birds_orange_crests_or_purple_wings',
            [constants.phrase]: 'birds with orange crests or purple wings',
            [constants.type]: constants.disjunction,
            [constants.description]: {
                [constants.creature]: constants.bird,
                [constants.bird_wing_color]: constants.purple,
                [constants.crest_present]: constants.true,
                [constants.crest_tail_color]: constants.orange,
            },
            [constants.rule]: function(creature_type, creature_description, concept_description) {
                if (concept_description[constants.creature] !== creature_type) return false;
                return(
                    creature_description[constants.bird_wing_color] == concept_description[constants.bird_wing_color] ||
                    (creature_description[constants.crest_present] == concept_description[constants.crest_present] &&
                    creature_description[constants.crest_tail_color] == concept_description[constants.crest_tail_color])
                )
            }
        },

        {
            [constants.name]: 'trees_purple_berries_or_white_trunks',
            [constants.phrase]: 'trees with purple berries or white trunks',
            [constants.type]: constants.disjunction,
            [constants.description]: {
                [constants.creature]: constants.tree,
                [constants.berries_present]: constants.true,
                [constants.berries_color]: constants.purple,
                [constants.trunk_color]: constants.white,
            },
            [constants.rule]: function(creature_type, creature_description, concept_description) {
                if (concept_description[constants.creature] !== creature_type) return false;
                return(
                    creature_description[constants.trunk_color] == concept_description[constants.trunk_color] ||
                    (creature_description[constants.berries_present] == concept_description[constants.berries_present] &&
                    creature_description[constants.berries_color] == concept_description[constants.berries_color])
                )
            }
        },

        {
            [constants.name]: 'trees_white_leaves_or_orange_berries',
            [constants.phrase]: 'trees with white leaves or orange berries',
            [constants.type]: constants.disjunction,
            [constants.description]: {
                [constants.creature]: constants.tree,
                [constants.berries_present]: constants.true,
                [constants.leaves_present]: constants.true,
                [constants.leaves_color]: constants.white,
                [constants.berries_color]: constants.orange,
            },
            [constants.rule]: function(creature_type, creature_description, concept_description) {
                if (concept_description[constants.creature] !== creature_type) return false;
                return(
                    (creature_description[constants.leaves_present] == concept_description[constants.leaves_present] &&
                    creature_description[constants.leaves_color] == concept_description[constants.leaves_color]) ||
                    (creature_description[constants.berries_present] == concept_description[constants.berries_present] &&
                    creature_description[constants.berries_color] == concept_description[constants.berries_color]
                    )
                )
            }
        },
        {
            [constants.name]: 'flowers_purple_petals_or_thorns',
            [constants.phrase]: 'flowers with purple petals or thorns',
            [constants.type]: constants.disjunction,
            [constants.description]: {
                [constants.creature]: constants.flower,
                [constants.petals_color]: constants.purple,
                [constants.thorns_present]: constants.true,
            },
            [constants.rule]: function(creature_type, creature_description, concept_description) {
                if (concept_description[constants.creature] !== creature_type) return false;
                return(
                    creature_description[constants.petals_color] == concept_description[constants.petals_color] ||
                    creature_description[constants.thorns_present] == concept_description[constants.thorns_present]
                )
            }
            
        },
        {
            [constants.name]: 'flowers_orange_stems_or_thorns',
            [constants.phrase]: 'flowers with orange stems or thorns',
            [constants.type]: constants.disjunction,
            [constants.description]: {
                [constants.creature]: constants.flower,
                [constants.stem_color]: constants.orange,
                [constants.thorns_present]: constants.true,
            },
            [constants.rule]: function(creature_type, creature_description, concept_description) {
                if (concept_description[constants.creature] !== creature_type) return false;
                return(
                    creature_description[constants.stem_color] == concept_description[constants.stem_color] ||
                    creature_description[constants.thorns_present] == concept_description[constants.thorns_present]
                )
            }
            
        },
        {
            [constants.name]: 'fish_orange_bodies_or_fangs',
            [constants.phrase]: 'fish with orange bodies or fangs',
            [constants.type]: constants.disjunction,
            [constants.description]: {
                [constants.creature]: constants.fish,
                [constants.body_color]: constants.orange,
                [constants.fangs_present]: constants.true,
            },
            [constants.rule]: function(creature_type, creature_description, concept_description) {
                if (concept_description[constants.creature] !== creature_type) return false;
                return(
                    creature_description[constants.body_color] == concept_description[constants.body_color] ||
                    creature_description[constants.fangs_present] == concept_description[constants.fangs_present]
                )
            }
        },
        {
            [constants.name]: 'fish_white_stripes_or_whiskers',
            [constants.phrase]: 'fish with white stripes or whiskers',
            [constants.type]: constants.disjunction,
            [constants.description]: {
                [constants.creature]: constants.fish,
                [constants.stripes_present]: constants.true,
                [constants.stripes_color]: constants.white,
                [constants.whiskers_present]: constants.true
            },
            [constants.rule]: function(creature_type, creature_description, concept_description) {
                if (concept_description[constants.creature] !== creature_type) return false;
                return(
                    (creature_description[constants.stripes_color] == concept_description[constants.stripes_color] &&
                    creature_description[constants.stripes_present] == concept_description[constants.stripes_present]) ||
                    creature_description[constants.whiskers_present] == concept_description[constants.whiskers_present]
                )
            }
        },
    ];

    var conjunction_conjunction_concepts = [

        {
            [constants.name]: 'birds_purple_wings_white_crests_white_tails',
            [constants.phrase]: 'birds with purple wings and white crests and white tails',
            [constants.type]: constants.conjunction_conjunction,
            [constants.description]: {
                [constants.creature]: constants.bird,
                [constants.bird_wing_color]: constants.purple,
                [constants.tail_present]: constants.true,
                [constants.crest_present]: constants.true,
                [constants.crest_tail_color]: constants.white,
            },
            [constants.rule]: stimuliGen.createConjunctiveRule(),
        },

        {
            [constants.name]: 'birds_crests_tails_orange_wings',
            [constants.phrase]: 'birds with crests and tails and orange wings',
            [constants.type]: constants.conjunction_conjunction,
            [constants.description]: {
                [constants.creature]: constants.bird,
                [constants.bird_wing_color]: constants.orange,
                [constants.tail_present]: constants.true,
                [constants.crest_present]: constants.true,
            },
            [constants.rule]: stimuliGen.createConjunctiveRule(),
        },
        {
            [constants.name]: 'trees_orange_berries_purple_trunks_white_leaves',
            [constants.phrase]: 'Tree with orange berries and purple trunks and white leaves',
            [constants.type]: constants.conjunction_conjunction,
            [constants.description]: {
                [constants.creature]: constants.tree,
                [constants.berries_present]: constants.true,
                [constants.leaves_present]: constants.true,
                [constants.berries_color]: constants.orange,
                [constants.trunk_color]: constants.purple,
                [constants.leaves_color]: constants.white,
            },
            [constants.rule]: stimuliGen.createConjunctiveRule(),
        },
        {
            [constants.name]: 'trees_leaves_berries_orange_trunks',
            [constants.phrase]: 'trees with leaves and berries and orange trunks',
            [constants.type]: constants.conjunction_conjunction,
            [constants.description]: {
                [constants.creature]: constants.tree,
                [constants.berries_present]: constants.true,
                [constants.leaves_present]: constants.true,
                [constants.trunk_color]: constants.orange,
            },
            [constants.rule]: stimuliGen.createConjunctiveRule(),
        },
    ];

    var disjunction_disjunction_concepts = [

    ];

    var conjunction_disjunction_concepts = [
        {
            [constants.name]: 'birds_purple_wings_white_crests_or_white_tails',
            [constants.phrase]: 'birds with (purple wings and white crests) or white tails',
            [constants.type]: constants.conjunction_disjunction,
            [constants.description]: {
                [constants.creature]: constants.bird,
                [constants.bird_wing_color]: constants.purple,
                [constants.tail_present]: constants.true,
                [constants.crest_tail_color]: constants.white,
                [constants.crest_present]: constants.true,
            },
            [constants.rule]: function(creature_type, creature_description, concept_description) {
                if (concept_description[constants.creature] !== creature_type) return false;
                return(
                    (creature_description[constants.bird_wing_color] == concept_description[constants.bird_wing_color] &&
                    creature_description[constants.crest_tail_color] == concept_description[constants.crest_tail_color] &&
                    creature_description[constants.crest_present] == concept_description[constants.crest_present]) ||
                    (creature_description[constants.tail_present] == concept_description[constants.tail_present] &&
                    creature_description[constants.crest_tail_color] == concept_description[constants.crest_tail_color])
                )
            }
        },
        {
            [constants.name]: 'birds_purple_crests_purple_tails_or_orange_wings',
            [constants.phrase]: 'birds with (purple crests and purple tails) or orange wings',
            [constants.type]: constants.conjunction_disjunction,
            [constants.description]: {
                [constants.creature]: constants.bird,
                [constants.bird_wing_color]: constants.orange,
                [constants.tail_present]: constants.true,
                [constants.crest_present]: constants.true,
                [constants.crest_tail_color]: constants.purple,
            },
            [constants.rule]: function(creature_type, creature_description, concept_description) {
                if (concept_description[constants.creature] !== creature_type) return false;
                return (
                    (
                        creature_description[constants.tail_present] == concept_description[constants.tail_present] &&
                        creature_description[constants.crest_present] == concept_description[constants.crest_present] &&
                        creature_description[constants.crest_tail_color] == concept_description[constants.crest_tail_color]
                    ) ||
                    creature_description[constants.bird_wing_color] == concept_description[constants.bird_wing_color]
                )
            }
        },
        {
            [constants.name]: 'trees_orange_berries_purple_trunks_or_white_leaves',
            [constants.phrase]: 'Tree with (orange berries and purple trunks) or white leaves',
            [constants.type]: constants.conjunction_disjunction,
            [constants.description]: {
                [constants.creature]: constants.tree,
                [constants.berries_present]: constants.true,
                [constants.berries_color]: constants.orange,
                [constants.trunk_color]: constants.purple,
                [constants.leaves_present]: constants.true,
                [constants.leaves_color]: constants.white,
            },
            [constants.rule]: function(creature_type, creature_description, concept_description) {
                if (concept_description[constants.creature] !== creature_type) return false;
                return(
                    (creature_description[constants.trunk_color] == concept_description[constants.trunk_color] &&
                    creature_description[constants.berries_present] == concept_description[constants.berries_present] &&
                    creature_description[constants.berries_color] == concept_description[constants.berries_color]) ||
                    (creature_description[constants.leaves_present] == concept_description[constants.leaves_present] &&
                    creature_description[constants.leaves_color] == concept_description[constants.leaves_color])
                )
            }
        },
        {
            [constants.name]: 'trees_leaves_berries_or_orange_trunks',
            [constants.phrase]: 'trees with (leaves and berries) or orange trunks',
            [constants.type]: constants.conjunction_disjunction,
            [constants.description]: {
                [constants.creature]: constants.tree,
                [constants.berries_present]: constants.true,
                [constants.trunk_color]: constants.orange,
                [constants.leaves_present]: constants.true,
            },
            [constants.rule]: function(creature_type, creature_description, concept_description) {
                if (concept_description[constants.creature] !== creature_type) return false;
                return(
                    creature_description[constants.trunk_color] == concept_description[constants.trunk_color] ||
                    (creature_description[constants.leaves_present] == concept_description[constants.leaves_present] &&
                    creature_description[constants.berries_present] == concept_description[constants.berries_present])
                )
            }
        },
        {
            [constants.name]: 'flowers_purple_stems_white_petals_or_orange_centers',
            [constants.phrase]: 'flowers with (purple stems and white petals) or orange centers',
            [constants.type]: constants.conjunction_disjunction,
            [constants.description]: {
                [constants.creature]: constants.flower,
                [constants.stem_color]: constants.purple,
                [constants.petals_color]: constants.white,
                [constants.center_color]: constants.orange,
            },
            [constants.rule]: function(creature_type, creature_description, concept_description) {
                if (concept_description[constants.creature] !== creature_type) return false;
                return(
                    (creature_description[constants.stem_color] == concept_description[constants.stem_color] &&
                    creature_description[constants.petals_color] == concept_description[constants.petals_color])||
                    creature_description[constants.center_color] == concept_description[constants.center_color]
                )
            }
            
        },
        {
            [constants.name]: 'flowers_thorns_purple_petals_or_orange_stems',
            [constants.phrase]: 'flowers with (thorns and purple petals) or orange stems',
            [constants.type]: constants.conjunction_disjunction,
            [constants.description]: {
                [constants.creature]: constants.flower,
                [constants.stem_color]: constants.orange,
                [constants.petals_color]: constants.purple,
                [constants.thorns_present]: constants.true,
            },
            [constants.rule]: function(creature_type, creature_description, concept_description) {
                if (concept_description[constants.creature] !== creature_type) return false;
                return(
                    (creature_description[constants.thorns_present] == concept_description[constants.thorns_present] &&
                    creature_description[constants.petals_color] == concept_description[constants.petals_color])||
                    creature_description[constants.stem_color] == concept_description[constants.stem_color]
                )
            }
            
        },
        {
            [constants.name]: 'fish_orange_bodies_purple_stripes_or_whiskers',
            [constants.phrase]: 'fish with (orange bodies and purple stripes) or whiskers',
            [constants.type]: constants.conjunction_disjunction,
            [constants.description]: {
                [constants.creature]: constants.fish,
                [constants.stripes_present]: constants.true,
                [constants.stripes_color]: constants.purple,
                [constants.body_color]: constants.orange,
                [constants.whiskers_present]: constants.true,
            },
            [constants.rule]: function(creature_type, creature_description, concept_description) {
                if (concept_description[constants.creature] !== creature_type) return false;
                return(
                    (creature_description[constants.stripes_color] == concept_description[constants.stripes_color] &&
                    creature_description[constants.stripes_present] == concept_description[constants.stripes_present] &&
                    creature_description[constants.body_color] == concept_description[constants.body_color]) ||
                    creature_description[constants.whiskers_present] == concept_description[constants.whiskers_present]
                )
            }
        },
        {
            [constants.name]: 'fish_white_bodies_orange_stripes_or_fangs',
            [constants.phrase]: 'fish with (white bodies and orange stripes) or fangs',
            [constants.type]: constants.conjunction_disjunction,
            [constants.description]: {
                [constants.creature]: constants.fish,
                [constants.stripes_present]: constants.true,
                [constants.stripes_color]: constants.orange,
                [constants.body_color]: constants.white,
                [constants.fangs_present]: constants.true,
            },
            [constants.rule]: function(creature_type, creature_description, concept_description) {
                if (concept_description[constants.creature] !== creature_type) return false;
                return(
                    (creature_description[constants.stripes_color] == concept_description[constants.stripes_color] &&
                    creature_description[constants.stripes_present] == concept_description[constants.stripes_present] &&
                    creature_description[constants.body_color] == concept_description[constants.body_color]) ||
                    creature_description[constants.fangs_present] == concept_description[constants.fangs_present]
                )
            }
        },

        {
            [constants.name]: 'bugs_purple_legs_white_heads_or_orange_wings',
            [constants.phrase]: 'bugs with (purple legs and white heads) or orange wings',
            [constants.type]: constants.conjunction_disjunction,
            [constants.description]: {
                [constants.creature]: constants.bug,
                [constants.legs_color]: constants.purple,
                [constants.wings_present]: constants.true,
                [constants.bug_wings_color]: constants.orange,
                [constants.head_color]: constants.white,
            },
            [constants.rule]: function(creature_type, creature_description, concept_description) {
                if (concept_description[constants.creature] !== creature_type) return false;
                return(
                    (creature_description[constants.legs_color] == concept_description[constants.legs_color] && 
                    creature_description[constants.head_color] == concept_description[constants.head_color])||
                    (creature_description[constants.wings_present] == concept_description[constants.wings_present] &&
                    creature_description[constants.bug_wings_color] == concept_description[constants.bug_wings_color])
                )
            }
        },
        {
            [constants.name]: 'bugs_white_legs_purple_wings_or_orange_antennae',
            [constants.phrase]: 'bugs with (white legs and purple wings) or orange antennae',
            [constants.type]: constants.conjunction_disjunction,
            [constants.description]: {
                [constants.creature]: constants.bug,
                [constants.legs_color]: constants.white,
                [constants.wings_present]: constants.true,
                [constants.bug_wings_color]: constants.purple,
                [constants.antennae_present]: constants.true,
                [constants.antennae_color]: constants.orange,
            },
            [constants.rule]: function(creature_type, creature_description, concept_description) {
                if (concept_description[constants.creature] !== creature_type) return false;
                return(
                    (creature_description[constants.legs_color] == concept_description[constants.legs_color] && 
                    creature_description[constants.wings_present] == concept_description[constants.wings_present] &&
                    creature_description[constants.bug_wings_color] == concept_description[constants.bug_wings_color])||
                    (creature_description[constants.antennae_present] == concept_description[constants.antennae_present] &&
                    creature_description[constants.antennae_color] == concept_description[constants.antennae_color])
                )
            }
        },
    ];

    var disjunction_conjunction_concepts = [
        {
            [constants.name]: 'trees_purple_trunks_or_white_leaves_orange_berries',
            [constants.phrase]: 'trees with (purple trunks or white leaves) and orange berries',
            [constants.type]: constants.disjunction_conjunction,
            [constants.description]: {
                [constants.creature]: constants.tree,
                [constants.berries_present]: constants.true,
                [constants.berries_color]: constants.orange,
                [constants.trunk_color]: constants.purple,
                [constants.leaves_present]: constants.true,
                [constants.leaves_color]: constants.white,
            },
            [constants.rule]: function(creature_type, creature_description, concept_description) {
                if (concept_description[constants.creature] !== creature_type) return false;
                return(
                    (creature_description[constants.trunk_color] == concept_description[constants.trunk_color] ||
                        (creature_description[constants.leaves_present] == concept_description[constants.leaves_present] &&
                        creature_description[constants.leaves_color] == concept_description[constants.leaves_color])) &&
                    (creature_description[constants.berries_color] == concept_description[constants.berries_color] &&
                    creature_description[constants.berries_present] == concept_description[constants.berries_present])
                )
            }
        },
        {
            [constants.name]: 'trees_orange_trunks_or_berries_white_leaves',
            [constants.phrase]: 'trees with (orange trunks or berries) and white leaves',
            [constants.type]: constants.disjunction_conjunction,
            [constants.description]: {
                [constants.creature]: constants.tree,
                [constants.berries_present]: constants.true,
                [constants.trunk_color]: constants.orange,
                [constants.leaves_present]: constants.true,
                [constants.leaves_color]: constants.white,
            },
            [constants.rule]: function(creature_type, creature_description, concept_description) {
                if (concept_description[constants.creature] !== creature_type) return false;
                return(
                    (creature_description[constants.trunk_color] == concept_description[constants.trunk_color] ||
                    creature_description[constants.berries_present] == concept_description[constants.berries_present]) &&
                    (creature_description[constants.leaves_color] == concept_description[constants.leaves_color] &&
                    creature_description[constants.leaves_present] == concept_description[constants.leaves_present])
                )
            }
        },
        {
            [constants.name]: 'flowers_purple_centers_or_orange_stems_with_thorns',
            [constants.phrase]: 'flowers with (purple centers or orange stems) and thorns',
            [constants.type]: constants.disjunction_conjunction,
            [constants.description]: {
                [constants.creature]: constants.flower,
                [constants.stem_color]: constants.orange,
                [constants.center_color]: constants.purple,
                [constants.thorns_present]: constants.true,
            },
            [constants.rule]: function(creature_type, creature_description, concept_description) {
                if (concept_description[constants.creature] !== creature_type) return false;
                return(
                    creature_description[constants.thorns_present] == concept_description[constants.thorns_present] &&
                    (creature_description[constants.center_color] == concept_description[constants.center_color] ||
                    creature_description[constants.stem_color] == concept_description[constants.stem_color])
                )
            }
            
        },
        {
            [constants.name]: 'flowers_purple_stems_or_thorns_white_centers',
            [constants.phrase]: 'flowers with (purple stems or thorns) and white centers',
            [constants.type]: constants.disjunction_conjunction,
            [constants.description]: {
                [constants.creature]: constants.flower,
                [constants.stem_color]: constants.purple,
                [constants.center_color]: constants.white,
                [constants.thorns_present]: constants.true,
            },
            [constants.rule]: function(creature_type, creature_description, concept_description) {
                if (concept_description[constants.creature] !== creature_type) return false;
                return(
                    creature_description[constants.center_color] == concept_description[constants.center_color] &&
                    (creature_description[constants.stem_color] == concept_description[constants.stem_color] ||
                    creature_description[constants.thorns_present] == concept_description[constants.thorns_present])
                )
            }
            
        },
        {
            [constants.name]: 'fish_orange_bodies_or_fangs_whiskers',
            [constants.phrase]: 'fish with (orange bodies or fangs) and whiskers',
            [constants.type]: constants.disjunction_conjunction,
            [constants.description]: {
                [constants.creature]: constants.fish,
                [constants.fangs_present]: constants.true,
                [constants.body_color]: constants.orange,
                [constants.whiskers_present]: constants.true,
            },
            [constants.rule]: function(creature_type, creature_description, concept_description) {
                if (concept_description[constants.creature] !== creature_type) return false;
                return(
                    (creature_description[constants.body_color] == concept_description[constants.body_color] ||
                    creature_description[constants.fangs_present] == concept_description[constants.fangs_present]) &&
                    creature_description[constants.whiskers_present] == concept_description[constants.whiskers_present]
                )
            }
        },
        {
            [constants.name]: 'fish_white_stripes_or_purple_bodies_whiskers',
            [constants.phrase]: 'fish with (white stripes or purple bodies) and whiskers',
            [constants.type]: constants.disjunction_conjunction,
            [constants.description]: {
                [constants.creature]: constants.fish,
                [constants.stripes_present]: constants.true,
                [constants.stripes_color]: constants.white,
                [constants.body_color]: constants.purple,
                [constants.whiskers_present]: constants.true,
            },
            [constants.rule]: function(creature_type, creature_description, concept_description) {
                if (concept_description[constants.creature] !== creature_type) return false;
                return(
                    (creature_description[constants.body_color] == concept_description[constants.body_color] ||
                        (creature_description[constants.stripes_present] == concept_description[constants.stripes_present] &&
                        creature_description[constants.stripes_color] == concept_description[constants.stripes_color])) &&
                    creature_description[constants.whiskers_present] == concept_description[constants.whiskers_present]
                )
            }
        },
        {
            [constants.name]: 'bugs_antennae_or_wings_purple_bodies',
            [constants.phrase]: 'bugs with (antennae or wings) and purple bodies',
            [constants.type]: constants.disjunction_conjunction,
            [constants.description]: {
                [constants.creature]: constants.bug,
                [constants.antennae_present]: constants.true,
                [constants.wings_present]: constants.true,
                [constants.body_color]: constants.purple,
            },
            [constants.rule]: function(creature_type, creature_description, concept_description) {
                if (concept_description[constants.creature] !== creature_type) return false;
                return(
                    (creature_description[constants.antennae_present] == concept_description[constants.antennae_present] || 
                    creature_description[constants.wings_present] == concept_description[constants.wings_present]) && 
                    creature_description[constants.body_color] == concept_description[constants.body_color]
                )
            }
        },
        {
            [constants.name]: 'bugs_white_heads_or_orange_antennae_purple_legs',
            [constants.phrase]: 'bugs with (white heads or orange antennae) and purple legs',
            [constants.type]: constants.disjunction_conjunction,
            [constants.description]: {
                [constants.creature]: constants.bug,
                [constants.antennae_present]: constants.true,
                [constants.antennae_color]: constants.orange,
                [constants.head_color]: constants.white,
                [constants.legs_color]: constants.purple,
            },
            [constants.rule]: function(creature_type, creature_description, concept_description) {
                if (concept_description[constants.creature] !== creature_type) return false;
                return(
                    (creature_description[constants.head_color] == concept_description[constants.head_color] || 
                        (creature_description[constants.antennae_present] == concept_description[constants.antennae_present] &&
                        creature_description[constants.antennae_color] == concept_description[constants.antennae_color])) && 
                    creature_description[constants.legs_color] == concept_description[constants.legs_color]
                )
            }
        },
        {
            [constants.name]: 'birds_orange_tails_or_white_wings_orange_crests',
            [constants.phrase]: 'birds with (orange tails or white wings) and orange crests',
            [constants.type]: constants.disjunction_conjunction,
            [constants.description]: {
                [constants.creature]: constants.bird,
                [constants.bird_wing_color]: constants.white,
                [constants.tail_present]: constants.true,
                [constants.crest_present]: constants.true,
                [constants.crest_tail_color]: constants.orange,
            },
            [constants.rule]: function(creature_type, creature_description, concept_description) {
                if (concept_description[constants.creature] !== creature_type) return false;
                return(
                    (creature_description[constants.bird_wing_color] == concept_description[constants.bird_wing_color] ||
                        (creature_description[constants.tail_present] == concept_description[constants.tail_present] &&
                        creature_description[constants.crest_tail_color] == concept_description[constants.crest_tail_color])) &&
                    (
                        creature_description[constants.crest_tail_color] == concept_description[constants.crest_tail_color] &&
                        creature_description[constants.crest_present] == concept_description[constants.crest_present]
                    )
                )
            }
        },
        {
            [constants.name]: 'birds_white_crests_or_orange_wings_tails',
            [constants.phrase]: 'birds with (white crests or orange wings) and tails',
            [constants.type]: constants.disjunction_conjunction,
            [constants.description]: {
                [constants.creature]: constants.bird,
                [constants.bird_wing_color]: constants.orange,
                [constants.tail_present]: constants.true,
                [constants.crest_present]: constants.true,
                [constants.crest_tail_color]: constants.white,
            },
            [constants.rule]: function(creature_type, creature_description, concept_description) {
                if (concept_description[constants.creature] !== creature_type) return false;
                return(
                    (creature_description[constants.bird_wing_color] == concept_description[constants.bird_wing_color] ||
                        (creature_description[constants.crest_present] == concept_description[constants.crest_present] &&
                        creature_description[constants.crest_tail_color] == concept_description[constants.crest_tail_color])) &&
                    creature_description[constants.tail_present] == concept_description[constants.tail_present]
                )
            }
        },
    ];


    // OTHER RULES

    var other_single_feature_concepts = [
        // {
        //  [constants.name]: 'flowers_purple_spots',
        //  [constants.phrase]: 'flowers with purple spots',
        //  [constants.type]: constants.single_feature,
        //  [constants.description]: {
        //      [constants.creature]: constants.flower,
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

        // {
        //  [constants.name]: 'flowers_purple_spots',
        //  [constants.phrase]: 'flowers with purple spots',
        //  [constants.type]: constants.single_feature,
        //  [constants.description]: {
        //      [constants.creature]: constants.flower,
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

            // {
        //  [constants.name]: 'fish_purple_stripes',
        //  [constants.phrase]: 'fish with purple stripes',
        //  [constants.type]: constants.single_feature,
        //  [constants.description]: {
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

        // {
        //  [constants.name]: 'bugs_purple_antennae',
        //  [constants.phrase]: 'bugs with purple antennae',
        //  [constants.type]: constants.single_feature,
        //  [constants.description]: {
        //      [constants.creature]: constants.bug,
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

        // {
        //  [constants.name]: 'birds_white_wings',
        //  [constants.phrase]: 'birds with white wings',
        //  [constants.type]: constants.single_feature,
        //  [constants.description]: {
        //      [constants.creature]: constants.bird,
        //         [constants.bird_wing_color]: constants.white,
        //     },
        //     [constants.rule]: function(creature_type, creature_description, concept_description) {
        //         if (concept_description[constants.creature] !== creature_type) return false;
        //         return (
        //             creature_description[constants.bird_wing_color] === concept_description[constants.bird_wing_color]
        //         )
        //     },
        // },

        // {
        //  [constants.name]: 'trees_white_trunks',
        //  [constants.phrase]: 'trees with white trunks',
        //  [constants.type]: constants.single_feature,
        //  [constants.description]: {
        //      [constants.creature]: constants.tree,
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

    var other_conjunction_concepts = [

        // {
        //  [constants.name]: 'fish_fangs_without_whiskers',
        //  [constants.phrase]: 'fish with fangs and without whiskers',
        //  [constants.type]: constants.conjunction,
        //  [constants.description]: {
        //      [constants.creature]: constants.fish,
        //         [constants.whiskers_present]: constants.false,
        //         [constants.fangs_present]: constants.true,
        //     },
        //     [constants.rule]: stimuliGen.createConjunctiveRule(),
        // },

        // {
        //  [constants.name]: 'bugs_orange_antennae_orange_wings',
        //  [constants.phrase]: 'bugs with orange antennae and orange wings',
        //  [constants.type]: constants.conjunction,
        //  [constants.description]: {
        //      [constants.creature]: constants.bug,
        //         [constants.wings_present]: constants.true,
        //         [constants.bug_wings_color]: constants.orange,
        //         [constants.antennae_present]: constants.true,
        //         [constants.antennae_color]: constants.orange,
        //     },
        //     [constants.rule]: stimuliGen.createConjunctiveRule(),
        // },

        // {
        //  [constants.name]: 'birds_white_crests_white_tails',
        //  [constants.phrase]: 'birds with white crests and white tails',
        //  [constants.type]: constants.conjunction,
        //  [constants.description]: {
        //      [constants.creature]: constants.bird,
        //         [constants.crest_present]: constants.true,
        //         [constants.tail_present]: constants.true,                
        //         [constants.crest_tail_color]: constants.white,
        //     },
        //     [constants.rule]: stimuliGen.createConjunctiveRule(),
        // },

        // {
        //  [constants.name]: 'trees_white_leaves_purple_trunks',
        //  [constants.phrase]: 'trees with white leaves and purple trunks',
        //  [constants.type]: constants.conjunction,
        //  [constants.description]: {
        //      [constants.creature]: constants.tree,
        //         [constants.leaves_present]: constants.true,
        //         [constants.leaves_color]: constants.white,
        //         [constants.trunk_color]: constants.purple,
        //     },
        //     [constants.rule]: stimuliGen.createConjunctiveRule(),
        // }, 

    ];

    var other_disjunction_concepts = [

    ];

    var other_conjunction_conjunction_concepts = [
        // {
        //  [constants.name]: 'flowers_white_petals_purple_centers_orange_stems',
        //  [constants.phrase]: 'flowers with white petals and purple centers and orange stems',
        //  [constants.logical_form]: 'flowers and white petals and purple centers and orange stems',
        //  [constants.type]: constants.conjunction_conjunction,
        //  [constants.description]: {
        //      [constants.creature]: constants.flower,
        //         [constants.petals_color]: constants.white,
        //         [constants.center_color]: constants.purple,
        //         [constants.stem_color]: constants.orange,                
        //     },
        //     [constants.rule]: stimuliGen.createConjunctiveRule(),
        // },

        // {
        //  [constants.name]: 'fish_fangs_whiskers_white_stripes',
        //  [constants.phrase]: 'fish with fangs and whiskers and white stripes',
        //  [constants.logical_form]: 'fish and fangs and whiskers and white stripes',
        //  [constants.type]: constants.conjunction_conjunction,
        //  [constants.description]: {
        //      [constants.creature]: constants.fish,
        //         [constants.fangs_present]: constants.true,
        //         [constants.whiskers_present]: constants.true,
        //         [constants.stripes_present]: constants.true,
        //         [constants.stripes_color]: constants.white,

        //     },
        //     [constants.rule]: stimuliGen.createConjunctiveRule(),
        // },

    ];

    var other_disjunction_disjunction_concepts = [

    ];

    var other_conjunction_disjunction_concepts = [

    ];

    var other_disjunction_conjunction_concepts = [

    ];


    var concepts = _.concat(
        single_feature_concepts,
        conjunction_concepts,
        disjunction_concepts,
        conjunction_disjunction_concepts,
        disjunction_conjunction_concepts
    ); 
    console.log("Number of Concepts: " + concepts.length);
	stimuliGen.genDatasets(concepts, 50, 50, '.', 6);

}

stimuliGeneration();