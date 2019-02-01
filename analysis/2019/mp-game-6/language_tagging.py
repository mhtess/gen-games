#!/usr/bin/env python3
"""
File: quantifier_tagging.py
Author: Sahil Chopra
Date: January 29, 2019

Language Tagging Tootls
"""
import os
import shutil
import pandas as pd
from tqdm import tqdm


def process_chat_messages(dir):
    # Process each chat message file in the given directory.
    # For each chat messages in a file, fill in "NA"
    # for the "uttClass" column if
    # the type of message is not "I" -- informative
    # or "F" -- follow up
    print("Analyzing chat messages")
    for file in tqdm(os.listdir(dir)):
        chat_message_file = os.path.join(dir, file)         
        if '.tsv' not in chat_message_file:
            continue
        df = pd.read_csv(chat_message_file, sep='\t', encoding="ISO-8859-1")
        df = add_fields(df)
        df.to_csv(chat_message_file, sep='\t', index=False,)

def add_fields(df):
    # Default Values
    df = df.rename(columns={ df.columns[12]: "messageType" })
    df = df.iloc[:,0:13]
    df["uttClass"] = ""
    df.reindex()

    for index, row in df.iterrows(): 
        if row["messageType"] != "I" and row["messageType"] != "F":
            df["uttClass"].iloc[index] = "NA"
        if "?" in row["text"]:
            df["uttClass"].iloc[index] = "?"

    return df


def convert_c_to_m(dir):
    for file in tqdm(os.listdir(dir)):
        chat_message_file = os.path.join(dir, file)         
        if ".tsv" not in chat_message_file:
            continue
        df = pd.read_csv(chat_message_file, sep='\t')
        for index, row in df.iterrows(): 
            if row["messageType"] == "C":
                df["messageType"].iloc[index] = "M"
        df.to_csv(chat_message_file, sep='\t', index=False,)


def clear_annotations(dir):
    for file in tqdm(os.listdir(dir)):
        chat_message_file = os.path.join(dir, file)         
        if ".tsv" not in chat_message_file:
            continue
        df = pd.read_csv(chat_message_file, sep='\t')
        df = df.iloc[:,0:13]
        df.to_csv(chat_message_file, sep='\t', index=False)


if __name__ == '__main__':
    convert_c_to_m('../../../data/mp-game-6/complete_games/chatMessage')
    # clear_annotations('../../../data/mp-game-6/complete_games/chatMessage')
    # process_chat_messages('../../../data/mp-game-6/complete_games/chatMessage')
