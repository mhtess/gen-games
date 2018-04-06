import json
import pandas

RESULTS_FILE = '../../mturk/mp-game-3/pilot/mp-game-3.csv'
TRAINING_STIMULI = './training_data.json'
TEST_STIMULI = './test_data.json'

def read_results(file=RESULTS_FILE):
    def CustomParser(data):
        j1 = json.loads(data)
        return j1

    training = 'Answer.training_trials'
    test = 'Answer.testing_trials'
    results = pandas.read_csv(file, converters={training: CustomParser, test: CustomParser})
    return results[training], results[test]

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

if __name__ == '__main__':
    training_data, test_data = read_results()
    training_stimuli, test_stimuli = read_stimuli()

    print training_data[1]
    for i, participant_data in enumerate(training_data):
        training_data[i] = correct_labels(participant_data, training_stimuli)

    for i, participant_data in enumerate(test_data):
        test_data[i] = correct_labels(participant_data, test_stimuli)

    print training_data[1]
    