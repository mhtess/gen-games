#!/usr/bin/env python3
"""
File: quantifier_tagging.py
Author: Sahil Chopra
Date: January 24, 2019

Regular expressions utilized to tag quantifiers within
the Cultural Ratchet dataset.
"""
from nltk.tag.stanford import StanfordPOSTagger
from nltk import word_tokenize, sent_tokenize
import nltk

import os
import shutil
import pandas as pd
from tqdm import tqdm

# Constants
DT = 'DT' # determiner
NT = 'CD' # numeric

def process_chat_messages(dir):
    # Process each chat message file in the given directory.
    # For each chat messages in a file, determine whether
    # a quantifier is present by regular expression search.
    # If so, note that a quantifier is present in a new column.
    # Also, keep note of the specific quantifier was identified.
    # It is possible to identify multiply quantifiers for
    # a single message.

    # Insantiate the POS tagger
    pos_model = 'stanford-postagger-full-2018-10-16/models/wsj-0-18-bidirectional-distsim.tagger'
    pos_jar = 'stanford-postagger-full-2018-10-16/stanford-postagger-3.9.2.jar'
    tagger = StanfordPOSTagger(pos_model, pos_jar)

    print("Identifying quantifiers and numerics")
    quantifiers, numerics = identify_supersets(dir, tagger)

    print("Analyzing chat messages")
    for file in tqdm(os.listdir(dir)):
        chat_message_file = os.path.join(dir, file)         
        if '.tsv' not in chat_message_file:
            continue
        df = pd.read_csv(chat_message_file, sep='\t')
        add_fields(df, quantifiers, numerics, tagger)
        df.to_csv(chat_message_file, sep='\t', index=False,)

def add_fields(df, quantifiers, numerics, tagger):
    # Add columns to the given dataframe, where we enumerate
    # the quantifiers we are interested in tagging via regular expressions

    # Default Values
    df["quantifier_present"] = False
    df["numerics_present"] = False
    for q in quantifiers:
        df[q] = 0
    for n in numerics:
        df[n] = 0
    df.reindex()
    
    msgs = list(df['text'].values)
    post_tag_msgs = tagger.tag_sents(word_tokenize(sent) for sent in msgs)
    for i, msg in enumerate(post_tag_msgs):
        for (word, tag) in msg: 
            if tag == DT and word.lower() in quantifiers:
                df[word.lower()].iloc[i] += 1
                df["quantifier_present"].iloc[i] = True
            elif word.lower() in quantifiers:
                df[word.lower()].iloc[i] += 1
                df["quantifier_present"].iloc[i] = True                   
            if tag == NT and word.lower() in numerics:
                df[word.lower()].iloc[i] += 1
                df["numerics_present"].iloc[i] = True
            elif word.lower() in numerics:
                df[word.lower()].iloc[i] += 1
                df["numerics_present"].iloc[i] = True
    return df

def identify_supersets(dir, tagger):
    """ Identify super sets of items that might be quantifiers or numerics.
        We do this by utilizing the state of the art Stanford
        POS Tagger (Kristina Toutanova, Dan Klein, Christopher Manning, and Yoram Singer 2003)
        to identify tokens that are numerics and determiners. 
    """
    quantifier_superset = set()
    numerics_superset = set()

    for file in tqdm(os.listdir(dir)):
        chat_message_file = os.path.join(dir, file)         
        if '.tsv' not in chat_message_file:
            continue
        df = pd.read_csv(chat_message_file, sep='\t')
        msgs = list(df['text'].values)
        post_tag_msgs = tagger.tag_sents(word_tokenize(sent) for sent in msgs)
        for msg in post_tag_msgs:
            for (word, tag) in msg:
                if tag == DT:
                    quantifier_superset.add(word.lower())
                elif tag == NT:
                    numerics_superset.add(word.lower())
    
    # Remove excess determiners
    determiners_to_remove = ['those', 'these', 'an', 'another', 'that', 'a', 'both', 'the', 'this']
    for d in determiners_to_remove:
        if d in quantifier_superset:
            quantifier_superset.remove(d)

    # Add additional quantifiers just in case
    extra_quantifiers = [
        "much", "many", "lot of", "lots of", "a lot of", "plenty of",
        "a large number of", "numerous", "several", "number of", "few",
        "little", "not many", "not much", "small number of", "some", "any",
        "each", "every", "all", "whole", "most", "none", 
    ]
    for q in extra_quantifiers:
        quantifier_superset.add(q)

    return quantifier_superset, numerics_superset

def test():
    process_chat_messages('./')

if __name__ == '__main__':
    process_chat_messages('../../../data/mp-game-6/all_games/chatMessage')