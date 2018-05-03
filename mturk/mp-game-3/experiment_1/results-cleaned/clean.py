import pandas as pd
from collections import defaultdict
from shutil import copyfile
import os
import pprint
import uuid
import json

DIR = '../production-results'
CLEANED_DIR = './data'
RAW_SERVER_LOGS = '../raw-server-data'
RAW_SERVER_LOGS_CHAT_MESSAGES = os.path.join(RAW_SERVER_LOGS, 'chatMessage')
RAW_SERVER_LOGS_SUMMARY_STATS = os.path.join(RAW_SERVER_LOGS, 'logScores')
RAW_SERVER_LOGS_SUBJ_INFO = os.path.join(RAW_SERVER_LOGS, 'logSubjInfo')
RAW_SERVER_LOGS_TEST = os.path.join(RAW_SERVER_LOGS, 'logTest')
RAW_SERVER_LOGS_TRAIN = os.path.join(RAW_SERVER_LOGS, 'logTrain')

ROLE_STUDENT = 'student'
ROLE_EXPLORER = 'explorer'


def identify_partnerless_results(dir=DIR):
    '''
    Sometimes results are submitted to Mturk, when a participant disconnected from the game.
    These leads to result files, where we only have 1/2 of the game, i.e. only the listener
    or only the teacher. Here we print a log of the game_ids and files that have only one player.
    '''
    games = defaultdict(list)
    for filename in os.listdir(dir):
        if filename.endswith('.json'):
            fp = os.path.join(dir, filename)
            df = pd.read_json(fp)
            game_id = df['answers']['game_id']
            player_role = df['answers']['role']
            rule_idx = df['answers']['rule_idx']
            training_fn = df['answers']['training_data_fn']
            test_fn = df['answers']['test_data_fn']
            rule_type = df['answers']['rule_type']
            games[game_id].append({
                'file_path': fp,
                'file_name': filename,
                'game_id': game_id,
                'rule_idx': rule_idx,
                'role': player_role,
                'training_data_fn': training_fn,
                'test_data_fn': test_fn,
                'rule_type': rule_type,
            })
        else:
            continue
    complete_games = []
    incomplete_games = []
    for (game_id, players_info) in games.iteritems():
        if len(players_info) != 2:
            incomplete_games.append(players_info[0])
        else: 
            complete_games.extend(players_info)
    return incomplete_games, complete_games


def fill_summary_stats(game_id, role, mturk_file_struct):
    '''
    Given game_id, role look up summary stats in raw server logs.
    '''
    for filename in os.listdir(RAW_SERVER_LOGS_SUMMARY_STATS):
        if game_id in filename:
            fp = os.path.join(RAW_SERVER_LOGS_SUMMARY_STATS, filename)
            df = pd.read_csv(fp, sep='	')
            
            # Training Summary Stats Extraction
            if role == ROLE_STUDENT:
                mturk_file_struct['answers']['training_summary_stats'] = {
                    'hits': 0,
                    'misses': 0,
                    'score': 0,
                    'false_alarms': 0,
                    'type': 'training',
                    'correct_rejections': 0
                }
            else:
                training_results_row = df.loc[(df['role'] == role) & (df['type'] == 'training')]
                mturk_file_struct['answers']['training_summary_stats'] = {
                    'hits': training_results_row['hits'].values[0],
                    'misses': training_results_row['misses'].values[0],
                    'score': training_results_row['score'].values[0],
                    'false_alarms': training_results_row['false_alarms'].values[0],
                    'type': 'training',
                    'correct_rejections': training_results_row['correct_rejections'].values[0],
                }     
        
            # Testing Summary Stats Extraction
            testing_summary_stats = df.loc[(df['role'] == role) & (df['type'] == 'testing')]
            mturk_file_struct['answers']['testing_summary_stats'] = {
                'hits': testing_summary_stats['hits'].values[0],
                'misses': testing_summary_stats['misses'].values[0],
                'score': testing_summary_stats['score'].values[0],
                'false_alarms': testing_summary_stats['false_alarms'].values[0],
                'type': 'testing',
                'correct_rejections': testing_summary_stats['correct_rejections'].values[0],
            }                          
            return True
    return False


def create_answer_dict(row):
    ''' Given a row from a raw server log (training or test), create a dictionary
        representation of the row that can be then filled into an mturk_file_struct.
    '''
    return {
        'is_correct': row['is_correct'],
        'trial_num': row['trial_num'],
        'turker_label': row['turker_label'],
        'time_in_seconds': row['time_in_seconds'],
        'true_label': row['true_label'],
    }


def fill_train_answers(game_id, role, mturk_file_struct):
    '''
    Given game_id, role look up training_answers in raw server logs.
    '''
    if role == ROLE_STUDENT:
        return True
    else:
        train_answers = []
        for filename in os.listdir(RAW_SERVER_LOGS_TRAIN):
            if game_id in filename:
                fp = os.path.join(RAW_SERVER_LOGS_TRAIN, filename)
                df = pd.read_csv(fp, sep='	')
                training_answers_rows = df.loc[(df['role'] == role)]
                for _, r in training_answers_rows.iterrows():
                    train_answers.append(create_answer_dict(r))
                mturk_file_struct['answers']['training_trials'] = train_answers
                return True
    return False


def fill_test_answers(game_id, role, mturk_file_struct):
    '''
    Given game_id, role look up training_answers in raw server logs.
    '''
    test_answers = []
    for filename in os.listdir(RAW_SERVER_LOGS_TEST):
        if game_id in filename:
            fp = os.path.join(RAW_SERVER_LOGS_TEST, filename)
            df = pd.read_csv(fp, sep='	')
            test_answers_rows = df.loc[(df['role'] == role)]
            for _, r in test_answers_rows.iterrows():
                test_answers.append(create_answer_dict(r))
            mturk_file_struct['answers']['testing_trials'] = test_answers
            return True
    return False


def fill_shared_info(other_player_info, missing_player_role, mturk_file_struct):
    ''' Fill information shared between two players in provided mturk_file_struct
    '''
    game_id = other_player_info['game_id']
    rule_idx = other_player_info['rule_idx']
    training_fn = other_player_info['training_data_fn']
    test_fn = other_player_info['test_data_fn']
    rule_type = other_player_info['rule_type']
    mturk_file_struct['answers']['game_id'] = game_id
    mturk_file_struct['answers']['role'] = missing_player_role 
    mturk_file_struct['answers']['rule_idx'] = rule_idx 
    mturk_file_struct['answers']['training_data_fn'] = training_fn
    mturk_file_struct['answers']['test_data_fn'] = test_fn
    mturk_file_struct['answers']['rule_type'] = rule_type 


def get_empty_mturk_struct():
    # Create MTURK File Structure
    mturk_file_struct = {
        'AutoApprovalTime': '',
        'AssignmentId': '',
        'WorkerId': '',
        'answers': {
            'rule_type': '',
            'test_data_fn': '',
            'time_in_minutes': 'null',
            'training_summary_stats': {
                'hits': -1,
                'misses': -1,
                'score': -1,
                'false_alarms': -1,
                'type': 'training',
                'correct_rejections': -1
            },
            'testing_trials': [],
            'system': {
                'screenW': -1,
                'screenH': -1,
                'OS': '',
                'Browser': ''
            },
            'training_data_fn': '',
            'role': '',
            'training_trials': [],
            'subject_information': {
                'enjoyment': '',
                'gender': '',
                'age': '',
                'problems': '',
                'nativeEnglish': '',
                'strategy': '',
                'assess': '',
                'humanPartner': '',
                'fairprice': '',
                'comments': '',
                'likePartner': '',
                'education': ''
            },
            'game_id': '',
            'testing_summary_stats': {
                'hits': -1,
                'misses': -1,
                'score': -1,
                'false_alarms': -1,
                'type': 'testing',
                'correct_rejections': -1,
            },
            'rule_idx': -1,
        },
        'AcceptTime': '',
        'HITId': '',
        'Assignment': '',
        'AssignmentStatus': '',
        'SubmitTime': ''
    }
    return mturk_file_struct

def construct_mturk_file(other_player_info):
    '''
    When we have an incomplete game, we can often recover the partner's data
    by examining the raw data logged to the server. In order to make things easier
    downstream, we sif through these raw logs and create a file in the fashion of one
    that would have been pulled down from Mturk.
    '''
    # Extract Info from Other Player
    mturk_file_struct = get_empty_mturk_struct()
    game_id = other_player_info['game_id']
    missing_player_role = ROLE_EXPLORER if other_player_info['role'] == ROLE_STUDENT else ROLE_STUDENT
    fill_shared_info(other_player_info, missing_player_role, mturk_file_struct)

    # Gather Info about Missing Player
    file_found_1 = fill_summary_stats(game_id, missing_player_role, mturk_file_struct)
    file_found_2 = fill_train_answers(game_id, missing_player_role, mturk_file_struct)
    file_found_3 = fill_test_answers(game_id, missing_player_role, mturk_file_struct)

    return (file_found_1 and file_found_2 and file_found_3), mturk_file_struct

if __name__ == '__main__':
    # pretty printing for debugging
    pp = pprint.PrettyPrinter(indent=4)
    incomplete_games, complete_games = identify_partnerless_results()

    # Copy over complete games
    for cg in complete_games:
        cg_copy_path = os.path.join(CLEANED_DIR, cg['file_name'])
        copyfile(cg['file_path'], cg_copy_path)

    still_incomplete = []
    for ig in incomplete_games:
        file_found, mturk_file_struct = construct_mturk_file(ig)
        if not file_found:
            still_incomplete.append(ig)
        else:
            ig_copy_path = os.path.join(CLEANED_DIR, ig['file_name'])
            copyfile(ig['file_path'], ig_copy_path)

            new_file_name = str(uuid.uuid1())
            new_file_path = os.path.join(CLEANED_DIR, '{}.json'.format(new_file_name))
            with open(new_file_path, 'w') as fp:
                json.dump(mturk_file_struct, fp)

    pp.pprint(still_incomplete)


    