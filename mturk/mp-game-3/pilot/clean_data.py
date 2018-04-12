import json
import pandas
from collections import defaultdict

RESULTS_FILE = './mp-game-3-mturk.csv'
TRAINING_STIMULI = '../../../experiments/mp-game-3/js/training_data.json'
TEST_STIMULI = '../../../experiments/mp-game-3/js/test_data.json'
TRAINING_TRIALS = 'Answer.training_trials'
TEST_TRIALS = 'Answer.testing_trials'
TURKER_LABEL = 'turker_label'
ROLE = 'Answer.role'

def read_results(file=RESULTS_FILE):
    def CustomParser(data):
        j1 = json.loads(data)
        return j1
    results = pandas.read_csv(file, converters={TRAINING_TRIALS: CustomParser, TEST_TRIALS: CustomParser})
    return results, results[TRAINING_TRIALS], results[TEST_TRIALS]

def read_stimuli(training=TRAINING_STIMULI, test=TEST_STIMULI):
    with open(TRAINING_STIMULI) as train:
        training_stimuli = json.load(train)
    with open(TEST_STIMULI) as test:
        test_stimuli = json.load(test)       
    return training_stimuli, test_stimuli

def correct_labels(trials, stimuli):
    parsed_trials = json.loads(trials)
    if len(parsed_trials) == 0:
        return parsed_trials
    else:
        for i in xrange(len(stimuli)):
            belongs_to_concept = stimuli[i]['belongs_to_concept']
            parsed_trials[i]['true_label'] = belongs_to_concept
            if parsed_trials[i]['turker_label'] == parsed_trials[i]['true_label']:
                parsed_trials[i]['is_correct'] = True
            else:
                parsed_trials[i]['is_correct'] = False
        return parsed_trials

def compute_teacher_posterior_predictives(results, pooled=True):
    role, training_data, test_data = results[ROLE], results[TRAINING_TRIALS], results[TEST_TRIALS]
    num_training = 0
    num_test = 0

    if pooled:
        # Compute fraction of true responses for each item
        # in train and test, across all the teachers in the game
        training_preds = defaultdict(int)
        test_preds = defaultdict(int)
        for i, p_data in enumerate(training_data):
            trials = json.loads(p_data)
            if 'explorer' in role[i]:
                num_training += 1
                for t_num, t in enumerate(trials):
                    training_preds[t_num] += int(t[TURKER_LABEL])
        for i, p_data in enumerate(test_data): 
            trials = json.loads(p_data)
            if 'explorer' in role[i]:
                num_test += 1
                for t_num, t in enumerate(trials):
                    test_preds[t_num] += int(t[TURKER_LABEL])

        training_preds = {trial_num: num_true / float(num_training) for trial_num, num_true in training_preds.iteritems()}
        test_preds = {trial_num: num_true / float(num_test) for trial_num, num_true in test_preds.iteritems()}
        return training_preds, test_preds

if __name__ == '__main__':
    results, training_data, test_data = read_results()
    training_stimuli, test_stimuli = read_stimuli()

    for i, participant_data in enumerate(training_data):
        labels = correct_labels(participant_data, training_stimuli)
        results.loc[i,(TRAINING_TRIALS)] = json.dumps(labels)

    for i, participant_data in enumerate(test_data):
        labels = correct_labels(participant_data, test_stimuli)
        results.loc[i,(TEST_TRIALS)] = json.dumps(labels)

    results.to_csv("mp-game-3-mturk-cleaned.csv", index=False)
    training_preds, test_preds = compute_teacher_posterior_predictives(results)
    training_preds_df = pandas.DataFrame(training_preds.items())
    training_preds_df.columns = ['trial_num', 'pred']
    training_preds_df.insert(2, 'type', 'training')

    test_preds_df = pandas.DataFrame(test_preds.items())
    test_preds_df.columns = ['trial_num', 'pred']
    test_preds_df.insert(2, 'type', 'test')
    test_preds_df.index = range(len(training_preds_df), len(training_preds_df) + len(test_preds_df))
    combined_preds = pandas.concat([training_preds_df, test_preds_df])
    combined_preds.to_json("teacher_posterior_preds.json")