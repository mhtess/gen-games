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

def split_data(all_games_dir, complete_games_dir, incomplete_games_dir):
    # Clean complete_games_dir and incomplete_games_dir
    # Then copy over appropriate directory structure from all_games_dir
    clear_dir(complete_games_dir)
    clear_dir(incomplete_games_dir)
    subdir_names = [dI for dI in os.listdir(all_games_dir) if os.path.isdir()]
    print(subdir_names)



def clear_dir(dir):
    """ Delete all the folders recursively in dir.
    """
    if not os.path.exists(dir):
        return

    for dI in os.listdir(dir):
        full_path_subdir = os.path.join(dir, dI)
        if os.path.isdir(full_path_subdir):
            shutil.rmtree(full_path_subdir)

def create_dirs(base_dir):
    """
    """

if __name__ == '__main__:


print(os.path.exists("/home/el/myfile.txt"))
