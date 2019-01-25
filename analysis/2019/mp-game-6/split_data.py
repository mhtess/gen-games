#!/usr/bin/env python3
"""
File: split_data.py
Author: Sahil Chopra
Date: January 19, 2019

Some of the collected MTurk Data is "incomplete", i.e. two players
participating in our experiment were disconnected mid-game, due to
a browser refresh, browser close, or server error. This means
that we a smattering of data points where participants played
through n < 5 rounds of concept learning, communicating, and testing.
Here, we separate complete games (those with 5 rounds) from incomplete
games.
"""

import os
import shutil
import pandas as pd
from tqdm import tqdm

def split_data(all_games_dir, complete_games_dir, incomplete_games_dir):
    # Clean complete_games_dir and incomplete_games_dir
    # Then copy over appropriate directory structure from all_games_dir
    clear_dir(complete_games_dir)
    clear_dir(incomplete_games_dir)
    subdir_names = [dI for dI in os.listdir(all_games_dir) if os.path.isdir(os.path.join(all_games_dir, dI)) and dI != 'logSubjInfo']

    create_subdirs(complete_games_dir, subdir_names)
    create_subdirs(incomplete_games_dir, subdir_names)

    # Inspect each subdirectory in all_games and split the data
    # into complete/incomplete. Copy the files appropriately.
    for s in subdir_names:
        all_games_sub_dir = os.path.join(all_games_dir, s)
        complete_games_sub_dir = os.path.join(complete_games_dir, s)
        incomplete_games_sub_dir = os.path.join(incomplete_games_dir, s)
        num_complete, num_incomplete = split_files_in_sub_dir(
            all_games_sub_dir,
            complete_games_sub_dir,
            incomplete_games_sub_dir
        )
        print ("{} complete, {} incomplete in {}".format(num_complete, num_incomplete, s))

    
def clear_dir(dir):
    """ Delete all the folders recursively in dir.
    """
    if not os.path.exists(dir):
        return

    for dI in os.listdir(dir):
        full_path_subdir = os.path.join(dir, dI)
        if os.path.isdir(full_path_subdir):
            shutil.rmtree(full_path_subdir)


def create_subdirs(base_dir, subdir_names):
    """ Create all subdirectories enumerated in subdir_names for the
        base_dir.
    """
    for s in subdir_names:
        s_dir = os.path.join(base_dir, s)
        os.makedirs(s_dir)


def split_files_in_sub_dir(all_games_sub_dir, complete_games_sub_dir, incomplete_games_sub_dir):
    """ Iterate over all the files in a subdirectory of all the all_games directory.
        Appropriately copy the file to either the respective subdirectory
        in the complete games directory or incomplete games directory.
    """
    num_complete, num_incomplete = 0, 0
    for file in tqdm(os.listdir(all_games_sub_dir)):
        src = os.path.join(all_games_sub_dir, file)            
        if 'DS_Store' in src:
            continue
        if is_complete_game(src):
            num_complete += 1
            dst = os.path.join(complete_games_sub_dir, file)
        else:
            dst = os.path.join(incomplete_games_sub_dir, file)
            num_incomplete += 1
        shutil.copyfile(src, dst)
    return num_complete, num_incomplete


def is_complete_game(file):
    """ Determines whether game in file is complete or incomplete.
    """
    df = pd.read_csv(file, sep='\t')
    num_rounds_played = df[['round_num']].max().values[0] + 1
    return num_rounds_played == 5

if __name__ == '__main__':
    split_data(
        all_games_dir="../../../data/mp-game-6/all_games",
        complete_games_dir="../../../data/mp-game-6/complete_games",
        incomplete_games_dir="../../../data/mp-game-6/incomplete_games",
    )

