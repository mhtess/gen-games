import pandas as pd
from collections import defaultdict
from shutil import copyfile
import os
import pprint
import uuid
import json
import math

"""
Clean Data, Match Pairs of Players, etc. for Multiplayer Games 3 and Games 4.
"""

DIR = '../mturk/{}/production-results'
RESULTS_DIR = './{}'
RAW_SERVER_LOGS = '../mturk/{}/raw-server-data'

ROLE_STUDENT = 'student'
ROLE_EXPLORER = 'explorer'

def get_worker_id(df):
    ''' Extract worker id from data frame.
    '''
    if isinstance(df['WorkerId'], object):
        return df['WorkerId'].values[0]
    else:
        return df['WorkerId']

def gen_anonymized_worker_id():
    ''' We mantain worked ids for reference, but anonymize them by replacing them with
        generated uuids converted to strings.
    '''
    return str(uuid.uuid4().hex[:8])

def identify_partnerless_results(ignored_game_ids, dir):
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
            if game_id in ignored_game_ids:
                continue
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
            df = pd.read_csv(fp, sep='\s+')
            
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
        'trial_num': int(row['trial_num']),
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
        true_trial_idx = -1
        for filename in os.listdir(RAW_SERVER_LOGS_TRAIN):
            if game_id in filename:
                fp = os.path.join(RAW_SERVER_LOGS_TRAIN, filename)
                df = pd.read_csv(fp, sep='\s+')
                training_answers_rows = df.loc[(df['role'] == role)]
                for _, r in training_answers_rows.iterrows():
                    if math.isnan(r['is_correct']):
                        if len(train_answers):
                            true_trial_idx = train_answers[-1]['trial_num']
                        else:
                            true_trial_idx = 0
                        continue
                    answer = create_answer_dict(r)
                    if true_trial_idx != -1: # We've encountered a Nan
                        true_trial_idx += 1
                        answer['trial_num'] = true_trial_idx
                    train_answers.append(answer)
                mturk_file_struct['answers']['training_trials'] = train_answers
                return True
    return False


def fill_test_answers(game_id, role, mturk_file_struct):
    '''
    Given game_id, role look up training_answers in raw server logs.
    '''
    test_answers = []
    true_trial_idx = -1
    for filename in os.listdir(RAW_SERVER_LOGS_TEST):
        if game_id in filename:
            fp = os.path.join(RAW_SERVER_LOGS_TEST, filename)
            df = pd.read_csv(fp, sep='\s+')
            test_answers_rows = df.loc[(df['role'] == role)]
            for _, r in test_answers_rows.iterrows():
                if math.isnan(r['is_correct']):
                    if len(test_answers):
                        true_trial_idx = test_answers[-1]['trial_num']
                    else:
                        true_trial_idx = 0
                    continue
                answer = create_answer_dict(r)
                if true_trial_idx != -1: # We've encountered a Nan
                    true_trial_idx += 1
                    answer['trial_num'] = true_trial_idx
                test_answers.append(answer)
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

    # Generate a User ID
    mturk_file_struct['WorkerId'] = gen_anonymized_worker_id()

    return (file_found_1 and file_found_2 and file_found_3), mturk_file_struct


def fill_completed_game_struct(df):
    return {
        'AutoApprovalTime': df['AutoApprovalTime'].values[0],
        'AssignmentId': df['AssignmentId'].values[0],
        'WorkerId': df['WorkerId'].values[0],
        'answers': {
            'rule_type': df['answers']['rule_type'],
            'test_data_fn': df['answers']['test_data_fn'],
            'time_in_minutes': df['answers']['time_in_minutes'],
            'training_summary_stats': df['answers']['training_summary_stats'],
            'testing_trials': df['answers']['testing_trials'],
            'system': df['answers']['system'],
            'training_data_fn': df['answers']['training_data_fn'],
            'role': df['answers']['role'],
            'training_trials': df['answers']['training_trials'],
            'subject_information': df['answers']['subject_information'],
            'game_id': df['answers']['game_id'],
            'testing_summary_stats': df['answers']['testing_summary_stats'],
            'rule_idx': df['answers']['rule_idx'],
        },
        'AcceptTime': df['AcceptTime'].values[0],
        'HITId': df['HITId'].values[0],
        'Assignment': df['Assignment'].values[0],
        'AssignmentStatus': df['AssignmentStatus'].values[0],
        'SubmitTime': df['SubmitTime'].values[0]
    }

def fix_incomplete_files(ignored_game_ids, dir):
    ''' Fix incomplete files, craeting mturk equivalent files in './data' folder. 
        Copy complete files, who have a paired component either after fixing
        or in original dataset.
    '''
    # pretty printing for debugging
    pp = pprint.PrettyPrinter(indent=4)
    incomplete_games, complete_games = identify_partnerless_results(ignored_game_ids, dir)

    # Copy over complete games
    for cg in complete_games:
        # Read completed game and anonymize worker id
        cp_file_path = os.path.join(DIR, cg['file_name'])
        df = pd.read_json(cp_file_path)
        df['WorkerId'] = gen_anonymized_worker_id()

        # Write completed game to disk
        cg_file_path = os.path.join(CLEANED_DIR, cg['file_name'])
        mturk_file_struct = fill_completed_game_struct(df)
        with open(cg_file_path, 'w') as fp:
            json.dump(mturk_file_struct, fp, indent=4)

    still_incomplete = []
    for ig in incomplete_games:
        file_found, mturk_file_struct = construct_mturk_file(ig)
        if not file_found:
            still_incomplete.append(ig)
        else:
            # Swap worker id for incomplete game file
            df = pd.read_json(os.path.join(DIR, ig['file_name']))
            df['WorkerId'] = gen_anonymized_worker_id()
            copy_file_path = os.path.join(CLEANED_DIR, ig['file_name'])
            copy_file_struct = fill_completed_game_struct(df)
            with open(copy_file_path, 'w') as fp:
                json.dump(copy_file_struct, fp, indent=4)

            # Construct new file from other half of the game
            new_file_name = str(uuid.uuid1())
            new_file_path = os.path.join(CLEANED_DIR, '{}.json'.format(new_file_name))
            with open(new_file_path, 'w') as fp:
                json.dump(mturk_file_struct, fp, indent=4)

    pp.pprint(still_incomplete)


def save_train_data(ignored_game_ids, dir):
    ''' Write CSVs for each player's set of training data '''
    for filename in os.listdir(dir):
        if filename.endswith('.json'):
            fp = os.path.join(dir, filename)
            df = pd.read_json(fp)
            if df['answers']['game_id'] in ignored_game_ids:
                continue
            player_role = df['answers']['role']
            if player_role == ROLE_STUDENT:
                continue
            else:
                worker_id = get_worker_id(df)
                training_trials = pd.DataFrame(df['answers']['training_trials'])
                training_trials['game_id'] = df['answers']['game_id']
                training_trials['rule_idx'] = df['answers']['rule_idx']
                training_trials['training_data_fn'] = df['answers']['training_data_fn']
                training_trials['rule_type'] = df['answers']['rule_type']
                training_trials['role'] = player_role
                training_trials['WorkerId'] = worker_id
                csv_fp = os.path.join(CLEANED_TRAIN_TRIALS, '{}_{}.csv'.format(df['answers']['game_id'], player_role))
                training_trials.to_csv(csv_fp, index=False)

def save_test_data(ignored_game_ids, dir):
    ''' Write CSVs for each player's set of test data '''
    for filename in os.listdir(dir):
        if filename.endswith('.json'):
            fp = os.path.join(dir, filename)
            df = pd.read_json(fp)
            if df['answers']['game_id'] in ignored_game_ids:
                continue
            player_role = df['answers']['role']
            worker_id = get_worker_id(df)
            testing_trials = pd.DataFrame(df['answers']['testing_trials'])
            testing_trials['game_id'] = df['answers']['game_id']
            testing_trials['rule_idx'] = df['answers']['rule_idx']
            testing_trials['test_data_fn'] = df['answers']['test_data_fn']
            testing_trials['rule_type'] = df['answers']['rule_type']
            testing_trials['role'] = player_role
            testing_trials['WorkerId'] = worker_id
            csv_fp = os.path.join(CLEANED_TEST_TRIALS, '{}_{}.csv'.format(df['answers']['game_id'], player_role))
            testing_trials.to_csv(csv_fp, index=False)


def save_train_summary_stats(ignored_game_ids, dir):
    ''' Write CSVs for each player's training summary stats '''
    for filename in os.listdir(dir):
        if filename.endswith('.json'):
            fp = os.path.join(dir, filename)
            df = pd.read_json(fp)
            if df['answers']['game_id'] in ignored_game_ids:
                continue
            player_role = df['answers']['role']
            if player_role == ROLE_STUDENT:
                continue
            else:
                worker_id = get_worker_id(df)
                training_summary_stats = pd.DataFrame([df['answers']['training_summary_stats']])
                training_summary_stats.reset_index()
                training_summary_stats['game_id'] = df['answers']['game_id']
                training_summary_stats['rule_idx'] = df['answers']['rule_idx']
                training_summary_stats['training_data_fn'] = df['answers']['training_data_fn']
                training_summary_stats['rule_type'] = df['answers']['rule_type']
                training_summary_stats['role'] = player_role
                training_summary_stats['WorkerId'] = worker_id
                csv_fp = os.path.join(CLEANED_TRAIN_SUMMARY_STATS, '{}_{}.csv'.format(df['answers']['game_id'], player_role))
                training_summary_stats.to_csv(csv_fp, index=False)

def save_test_summary_stats(ignored_game_ids, dir):
    ''' Write CSVs for each player's testing summary stats '''
    for filename in os.listdir(dir):
        if filename.endswith('.json'):
            fp = os.path.join(dir, filename)
            df = pd.read_json(fp)
            if df['answers']['game_id'] in ignored_game_ids:
                continue
            player_role = df['answers']['role']
            worker_id = get_worker_id(df)
            testing_summary_stats = pd.DataFrame([df['answers']['testing_summary_stats']])
            testing_summary_stats['game_id'] = df['answers']['game_id']
            testing_summary_stats['rule_idx'] = df['answers']['rule_idx']
            testing_summary_stats['test_data_fn'] = df['answers']['test_data_fn']
            testing_summary_stats['rule_type'] = df['answers']['rule_type']
            testing_summary_stats['role'] = player_role
            testing_summary_stats['WorkerId'] = worker_id
            csv_fp = os.path.join(CLEANED_TEST_SUMMARY_STATS, '{}_{}.csv'.format(df['answers']['game_id'], player_role))
            testing_summary_stats.to_csv(csv_fp, index=False)

def save_chat_messages(ignored_game_ids, dir):
    ''' Write CSVs for each player's testing summary stats. 
    '''
    game_ids = set()
    for filename in os.listdir(dir):
        if filename.endswith('.json'):
            fp = os.path.join(dir, filename)
            df = pd.read_json(fp)
            if df['answers']['game_id'] in ignored_game_ids:
                continue
            game_id = df['answers']['game_id']
            game_ids.add(game_id)
            for filename in os.listdir(RAW_SERVER_LOGS_CHAT_MESSAGES):
                if game_id in filename:
                    chat_fp = os.path.join(RAW_SERVER_LOGS_CHAT_MESSAGES, filename)
                    chat_df = pd.read_csv(chat_fp, sep='\t')
                    chat_df.fillna(1, inplace=True)
                    chat_df['rule_idx'] = df['answers']['rule_idx']
                    chat_df['rule_type'] = df['answers']['rule_type']
                    chat_df.loc[:,'reactionTime'] /= 1000 # Convert millisecodns to seconds
                    chat_df.rename(columns={'gameid': 'game_id'}, inplace=True)
                    chat_fp_dest = os.path.join( CLEANED_CHAT_MESSAGES, '{}.csv'.format(game_id))
                    chat_df.to_csv(chat_fp_dest, index=False)
                    break


def compute_human_predictives_teacher(training_data, test_data):
    ''' Compute human predictives for the teacher.
    '''
    num_training, num_test = training_data['game_id'].nunique(), test_data['game_id'].nunique()
    training_preds, test_preds = defaultdict(int), defaultdict(int)

    for _, r in training_data.iterrows():
        if ROLE_EXPLORER == r['role']:
            training_preds[r['trial_num']] += int(r['turker_label'])

    for _, r in test_data.iterrows():
        if ROLE_EXPLORER == r['role']:
            test_preds[r['trial_num']] += int(r['turker_label'])

    training_preds = {trial_num: num_true / float(num_training) for trial_num, num_true in training_preds.iteritems()}
    test_preds = {trial_num: num_true / float(num_test) for trial_num, num_true in test_preds.iteritems()}
    return training_preds, test_preds


def save_human_predictives_teacher_pooled_by_list(ignored_game_ids, rule_idx):
    ''' Save human predictives for the teacher, pooled by the list utilized.
    '''
    train_df, test_df = None, None

    # Gather training trials for specified list
    for filename in os.listdir(CLEANED_TRAIN_TRIALS):
        if filename.endswith('.csv'):
            fp = os.path.join(CLEANED_TRAIN_TRIALS, filename)
            df = pd.read_csv(fp)
            if df['game_id'].iloc[0] in ignored_game_ids:
                continue
            if df['rule_idx'].iloc[0] != rule_idx:
                continue
            if train_df is None:
                train_df = df
            else:
                train_df = pd.concat([train_df, df])

    # Gather test trials for specified list
    for filename in os.listdir(CLEANED_TEST_TRIALS):
        if filename.endswith('.csv'):
            fp = os.path.join(CLEANED_TEST_TRIALS, filename)
            df = pd.read_csv(fp)
            if df['game_id'].iloc[0] in ignored_game_ids:
                continue
            if df['rule_idx'].iloc[0] != rule_idx:
                continue
            if test_df is None:
                test_df = df
            else:
                test_df = pd.concat([test_df, df])        

    # Save Pooled Predictives
    training_preds, test_preds = compute_human_predictives_teacher(train_df, test_df)
    items = training_preds.items()
    preds = pd.DataFrame({'trial_num': [i[0] for i in items], 'pred': [i[1] for i in items]})
    preds['type'] = 'train'
    items = test_preds.items()
    temp = pd.DataFrame({'trial_num': [i[0] for i in items], 'pred': [i[1] for i in items]})
    temp['type'] = 'test'
    preds = pd.concat([preds, temp])

    new_file_path = os.path.join(PREDICTIVES_POOLED_BY_LIST, '{}.csv'.format(rule_idx))
    preds.to_csv(new_file_path, index=False)


def save_human_predictives_pooled_by_lists(ignored_game_ids):
    ''' Save human predictives for teacher, pooled by the list utilized. Do this for all lists.
    '''
    for rule_idx in xrange(NUM_LISTS):
        save_human_predictives_teacher_pooled_by_list(ignored_game_ids, rule_idx)


def game_summary(ignored_game_ids, dir):
    ''' Summarize Games in data directory '''
    summary = []
    game_ids = set()
    for filename in os.listdir(dir):
        if filename.endswith('.json'):
            fp = os.path.join(dir, filename)
            df = pd.read_json(fp)
            
            game_id = df['answers']['game_id']
            if game_id in game_ids or game_id in ignored_game_ids:
                continue
            else:
                game_ids.add(game_id)
            rule_idx = df['answers']['rule_idx']
            training_fn = df['answers']['training_data_fn']
            test_fn = df['answers']['test_data_fn']
            rule_type = df['answers']['rule_type']
            summary.append({
                'game_id': game_id,
                'rule_idx': rule_idx,
                'training_data_fn': training_fn,
                'test_data_fn': test_fn,
                'rule_type': rule_type
            })
    summary_df = pd.DataFrame.from_dict(summary)
    summary_df.to_csv(GAME_SUMMARY, index=False)
    

def create_dirs():
    ''' Create cleaned data directories. 
    '''
    def create_dir(d):
        if not os.path.exists(d):
            os.makedirs(d)
    create_dir(RESULTS_DIR)
    create_dir(CLEANED_DIR)
    create_dir(CLEANED_TRAIN_SUMMARY_STATS)
    create_dir(CLEANED_TEST_SUMMARY_STATS)
    create_dir(CLEANED_TRAIN_TRIALS)
    create_dir(CLEANED_TEST_TRIALS)
    create_dir(CLEANED_CHAT_MESSAGES)
    create_dir(PREDICTIVES_POOLED_BY_LIST)


def run_data_cleaning():
    """ Run Data Cleaning
    """
    create_dirs()
    ignored_game_ids = [
        '8846-b611ef86-0a79-40c9-8dd4-64c3b4b6bf67',
        '6395-177e9f73-0418-4430-9a6a-6fe59daef313',
        '1264-d6d8fe98-9e3c-4f05-81ae-a39b703103f8',
        '9542-eef3fde3-2e2a-4089-a7d7-c392d057dc0e',
    ]
    fix_incomplete_files(ignored_game_ids, DIR)
    game_summary(ignored_game_ids, CLEANED_DIR)
    save_train_data(ignored_game_ids, CLEANED_DIR)
    save_test_data(ignored_game_ids, CLEANED_DIR)
    save_train_summary_stats(ignored_game_ids, CLEANED_DIR)
    save_test_summary_stats(ignored_game_ids, CLEANED_DIR)
    save_chat_messages(ignored_game_ids, CLEANED_DIR)
    save_human_predictives_pooled_by_lists(ignored_game_ids)

def gen_globals(game='mp-game-3'):
    """ Configuration to run data cleaning.
    """
    global DIR
    global RESULTS_DIR
    global RAW_SERVER_LOGS
    global CLEANED_DIR
    global CLEANED_TRAIN_SUMMARY_STATS
    global CLEANED_TEST_SUMMARY_STATS
    global CLEANED_TRAIN_TRIALS
    global CLEANED_TEST_TRIALS
    global CLEANED_CHAT_MESSAGES
    global GAME_SUMMARY
    global PREDICTIVES_POOLED_BY_LIST
    global RAW_SERVER_LOGS_CHAT_MESSAGES
    global RAW_SERVER_LOGS_SUMMARY_STATS
    global RAW_SERVER_LOGS_SUBJ_INFO
    global RAW_SERVER_LOGS_TEST
    global RAW_SERVER_LOGS_TRAIN
    global NUM_LISTS

    DIR = DIR.format(game) 
    RESULTS_DIR = RESULTS_DIR.format(game)
    RAW_SERVER_LOGS = RAW_SERVER_LOGS.format(game)

    CLEANED_DIR = os.path.join(RESULTS_DIR, 'data')
    CLEANED_TRAIN_SUMMARY_STATS = os.path.join(RESULTS_DIR, 'train_summary_stats')
    CLEANED_TEST_SUMMARY_STATS = os.path.join(RESULTS_DIR, 'test_summary_stats')
    CLEANED_TRAIN_TRIALS = os.path.join(RESULTS_DIR, 'train_trials')
    CLEANED_TEST_TRIALS = os.path.join(RESULTS_DIR, 'test_trials')
    CLEANED_CHAT_MESSAGES = os.path.join(RESULTS_DIR, 'chat_messages')

    GAME_SUMMARY = os.path.join(RESULTS_DIR, 'game_summary.csv')
    PREDICTIVES_POOLED_BY_LIST = os.path.join(RESULTS_DIR, 'predictives_pooled_list') 

    RAW_SERVER_LOGS_CHAT_MESSAGES = os.path.join(RAW_SERVER_LOGS, 'chatMessage')
    RAW_SERVER_LOGS_SUMMARY_STATS = os.path.join(RAW_SERVER_LOGS, 'logScores')
    RAW_SERVER_LOGS_SUBJ_INFO = os.path.join(RAW_SERVER_LOGS, 'logSubjInfo')
    RAW_SERVER_LOGS_TEST = os.path.join(RAW_SERVER_LOGS, 'logTest')
    RAW_SERVER_LOGS_TRAIN = os.path.join(RAW_SERVER_LOGS, 'logTrain')
    NUM_LISTS = 9

if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('game', type=str, help='which multiplayer game\'s data to clean')
    args = parser.parse_args()

    if args.game == 'mp-game-3':
        gen_globals('mp-game-3/experiment')
        run_data_cleaning()
    elif args.game == 'mp-game-4':
        gen_globals('mp-game-4')
        run_data_cleaning()
    else:
        raise Exception('No Such Game')


    