CritterGame\_MP-1\_TextAnalysis\_Pilot\_1
================
Lauren Oey
8/13/2017

Stanford CoreNLP Pre-Processing
===============================

Tokenize Sentences
==================

Tables
======

| gameid\_num |  trialNum| role    | distribution      | text                                                                                                                      |  partnerPercentCorrectlyHit|  partnerPercentCorrectlyRejected|  partnerPercentCorrect|
|:------------|---------:|:--------|:------------------|:--------------------------------------------------------------------------------------------------------------------------|---------------------------:|--------------------------------:|----------------------:|
| game\_4     |         1| playerA | \[0, 1, 0\]       | a zoov lives near crocodiles                                                                                              |                   1.0000000|                        1.0000000|              1.0000000|
| game\_4     |         4| playerB | \[0, 1, 0\]       | only daith are poisonous                                                                                                  |                   1.0000000|                        1.0000000|              1.0000000|
| game\_4     |         4| playerB | \[0, 1, 0\]       | ok                                                                                                                        |                   1.0000000|                        1.0000000|              1.0000000|
| game\_1     |         2| playerB | \[0, 1, 0\]       | taifel and oller never lay eggs.                                                                                          |                   1.0000000|                        1.0000000|              1.0000000|
| game\_1     |         2| playerB | \[0, 1, 0\]       | ellep always lays eggs.                                                                                                   |                   1.0000000|                        1.0000000|              1.0000000|
| game\_1     |         2| playerB | \[0, 1, 0\]       | okay cool. ready!                                                                                                         |                   1.0000000|                        1.0000000|              1.0000000|
| game\_1     |         3| playerA | \[0, 1, 0\]       | crullet = always luzak/grink = never                                                                                      |                   1.0000000|                        1.0000000|              1.0000000|
| game\_1     |         3| playerA | \[0, 1, 0\]       | kk                                                                                                                        |                   1.0000000|                        1.0000000|              1.0000000|
| game\_1     |         3| playerA | \[0, 1, 0\]       | k got it                                                                                                                  |                   1.0000000|                        1.0000000|              1.0000000|
| game\_5     |         3| playerB | \[0, 1, 0\]       | sorry i clicked continue too fast last time!                                                                              |                   1.0000000|                        1.0000000|              1.0000000|
| game\_5     |         3| playerB | \[0, 1, 0\]       | only the orange ones this time for me                                                                                     |                   1.0000000|                        1.0000000|              1.0000000|
| game\_5     |         3| playerB | \[0, 1, 0\]       | i agree :)                                                                                                                |                   1.0000000|                        1.0000000|              1.0000000|
| game\_5     |         3| playerB | \[0, 1, 0\]       | here we go!                                                                                                               |                   1.0000000|                        1.0000000|              1.0000000|
| game\_5     |         4| playerA | \[0, 1, 0\]       | only the purple creatures should you be interested in                                                                     |                   1.0000000|                        1.0000000|              1.0000000|
| game\_5     |         4| playerA | \[0, 1, 0\]       | all of them                                                                                                               |                   1.0000000|                        1.0000000|              1.0000000|
| game\_5     |         4| playerA | \[0, 1, 0\]       | ok good                                                                                                                   |                   1.0000000|                        1.0000000|              1.0000000|
| game\_5     |         4| playerA | \[0, 1, 0\]       | sounds like a plan                                                                                                        |                   1.0000000|                        1.0000000|              1.0000000|
| game\_2     |         1| playerB | \[0, 1, 0\]       | i learned that kaz plants grow leaves and the others do not. kaz plants are purple.                                       |                   1.0000000|                        1.0000000|              1.0000000|
| game\_2     |         1| playerB | \[0, 1, 0\]       | what color was morseth?                                                                                                   |                   1.0000000|                        1.0000000|              1.0000000|
| game\_2     |         1| playerB | \[0, 1, 0\]       | ok                                                                                                                        |                   1.0000000|                        1.0000000|              1.0000000|
| game\_2     |         1| playerB | \[0, 1, 0\]       | you ready to continue to the thing?                                                                                       |                   1.0000000|                        1.0000000|              1.0000000|
| game\_2     |         1| playerB | \[0, 1, 0\]       | ok, let's make some money                                                                                                 |                   1.0000000|                        1.0000000|              1.0000000|
| game\_3     |         2| playerB | \[0, 1, 0\]       | just taifels lay eggs                                                                                                     |                   1.0000000|                        1.0000000|              1.0000000|
| game\_6     |         2| playerB | \[0, 1, 0\]       | javs lay eggs, the other two didn't                                                                                       |                   1.0000000|                        1.0000000|              1.0000000|
| game\_6     |         2| playerB | \[0, 1, 0\]       | k thanx                                                                                                                   |                   1.0000000|                        1.0000000|              1.0000000|
| game\_6     |         3| playerA | \[0, 1, 0\]       | only wug                                                                                                                  |                   1.0000000|                        1.0000000|              1.0000000|
| game\_3     |         1| playerA | \[0, 1, 0\]       | kwep, the purple fish, lives near alligator. the other two were blue and red, and do not have any hidden attributes       |                   0.2500000|                        0.5000000|              0.4166667|
| game\_2     |         1| playerA | \[0, 1, 0\]       | morseth has crocodiles; none others                                                                                       |                   0.0000000|                        0.0000000|              0.0000000|
| game\_2     |         1| playerA | \[0, 1, 0\]       | i think it came in a few colors; all had crocs nearby                                                                     |                   0.0000000|                        0.0000000|              0.0000000|
| game\_2     |         1| playerA | \[0, 1, 0\]       | sure!                                                                                                                     |                   0.0000000|                        0.0000000|              0.0000000|
| game\_4     |         2| playerB | \[0, 1, 0.75\]    | cheeba and fram have eggs. thup don't                                                                                     |                   1.0000000|                        0.8000000|              0.9166667|
| game\_4     |         4| playerA | \[0, 1, 0.75\]    | all elleps and most sapers grow eggs                                                                                      |                   1.0000000|                        0.8000000|              0.9166667|
| game\_5     |         2| playerA | \[0, 1, 0.75\]    | oh wow                                                                                                                    |                   1.0000000|                        0.8000000|              0.9166667|
| game\_5     |         2| playerA | \[0, 1, 0.75\]    | i had an orange creature and he was poisonous, so were all the purple ones                                                |                   1.0000000|                        0.8000000|              0.9166667|
| game\_5     |         2| playerA | \[0, 1, 0.75\]    | all of them, yes                                                                                                          |                   1.0000000|                        0.8000000|              0.9166667|
| game\_5     |         2| playerA | \[0, 1, 0.75\]    | yes                                                                                                                       |                   1.0000000|                        0.8000000|              0.9166667|
| game\_5     |         4| playerB | \[0, 1, 0.75\]    | this time all the blue lorches are poisonous                                                                              |                   1.0000000|                        0.8000000|              0.9166667|
| game\_5     |         4| playerB | \[0, 1, 0.75\]    | and 3 out of 4 purple dorbs are poisonous                                                                                 |                   1.0000000|                        0.8000000|              0.9166667|
| game\_5     |         4| playerB | \[0, 1, 0.75\]    | might as well go for all the blues and purples                                                                            |                   1.0000000|                        0.8000000|              0.9166667|
| game\_5     |         4| playerB | \[0, 1, 0.75\]    | kk good luck!                                                                                                             |                   1.0000000|                        0.8000000|              0.9166667|
| game\_3     |         3| playerB | \[0, 1, 0.75\]    | mooks and reesles are near crocodiles.                                                                                    |                   1.0000000|                        0.8000000|              0.9166667|
| game\_3     |         4| playerA | \[0, 1, 0.75\]    | fram and daith have the attribute                                                                                         |                   1.0000000|                        0.8000000|              0.9166667|
| game\_6     |         1| playerA | \[0, 1, 0.75\]    | hi, dorb fish do not live near crocodiles; morseth do; blin sometime do                                                   |                   0.8571429|                        1.0000000|              0.9166667|
| game\_6     |         1| playerA | \[0, 1, 0.75\]    | yes                                                                                                                       |                   0.8571429|                        1.0000000|              0.9166667|
| game\_6     |         1| playerA | \[0, 1, 0.75\]    | what is the name of the third one in your group                                                                           |                   0.8571429|                        1.0000000|              0.9166667|
| game\_6     |         1| playerA | \[0, 1, 0.75\]    | ok                                                                                                                        |                   0.8571429|                        1.0000000|              0.9166667|
| game\_6     |         3| playerB | \[0, 1, 0.75\]    | all ollers, some kaz and none of the third                                                                                |                   0.8571429|                        1.0000000|              0.9166667|
| game\_6     |         3| playerB | \[0, 1, 0.75\]    | k ty                                                                                                                      |                   0.8571429|                        1.0000000|              0.9166667|
| game\_1     |         2| playerA | \[0, 1, 0.75\]    | krivel is poisonous 3/4 time                                                                                              |                   0.8571429|                        0.8000000|              0.8333333|
| game\_1     |         2| playerA | \[0, 1, 0.75\]    | dorb is always poisonous                                                                                                  |                   0.8571429|                        0.8000000|              0.8333333|
| game\_1     |         2| playerA | \[0, 1, 0.75\]    | other one ( i missed name so sorry) is never                                                                              |                   0.8571429|                        0.8000000|              0.8333333|
| game\_1     |         2| playerA | \[0, 1, 0.75\]    | yup yup                                                                                                                   |                   0.8571429|                        0.8000000|              0.8333333|
| game\_1     |         3| playerB | \[0, 1, 0.75\]    | blin lives near crocs                                                                                                     |                   0.8571429|                        0.8000000|              0.8333333|
| game\_1     |         3| playerB | \[0, 1, 0.75\]    | mook never live near crocs                                                                                                |                   0.8571429|                        0.8000000|              0.8333333|
| game\_1     |         3| playerB | \[0, 1, 0.75\]    | zorb lives near crocs 3/4 of the time (from left to right starting at top, first two are yes, third is no, fourth is yes) |                   0.8571429|                        0.8000000|              0.8333333|
| game\_1     |         3| playerB | \[0, 1, 0.75\]    | lmk if that makes sense                                                                                                   |                   0.8571429|                        0.8000000|              0.8333333|
| game\_1     |         3| playerB | \[0, 1, 0.75\]    | okay!                                                                                                                     |                   0.8571429|                        0.8000000|              0.8333333|
| game\_2     |         2| playerA | \[0, 1, 0.75\]    | orange crullet is poisonous; yellow mox is likely to be, but not every time                                               |                   0.8571429|                        0.8000000|              0.8333333|
| game\_2     |         2| playerA | \[0, 1, 0.75\]    | each bird is equally likely you mean?                                                                                     |                   0.8571429|                        0.8000000|              0.8333333|
| game\_2     |         2| playerA | \[0, 1, 0.75\]    | k gotcha                                                                                                                  |                   0.8571429|                        0.8000000|              0.8333333|
| game\_2     |         2| playerA | \[0, 1, 0.75\]    | yep!                                                                                                                      |                   0.8571429|                        0.8000000|              0.8333333|
| game\_2     |         4| playerB | \[0, 1, 0.75\]    | thup poisonous 100%, fram 3/4 of the time, wug never poisonous                                                            |                   0.5714286|                        0.4000000|              0.5000000|
| game\_2     |         4| playerB | \[0, 1, 0.75\]    | ok, rdy?                                                                                                                  |                   0.5714286|                        0.4000000|              0.5000000|
| game\_2     |         3| playerB | \[0, 1, 0.25\]    | zorb is near crocs, saper is very very rarely near crocs (1/4 near crocs), and jav is never near crocs                    |                   1.0000000|                        1.0000000|              1.0000000|
| game\_1     |         1| playerA | \[0, 1, 0.25\]    | ackle and mox don't live near crocs                                                                                       |                   0.8000000|                        1.0000000|              0.9166667|
| game\_1     |         1| playerA | \[0, 1, 0.25\]    | fep always live near crocs (fep is the special ones)                                                                      |                   0.8000000|                        1.0000000|              0.9166667|
| game\_1     |         1| playerA | \[0, 1, 0.25\]    | kk ready when you are                                                                                                     |                   0.8000000|                        1.0000000|              0.9166667|
| game\_5     |         3| playerA | \[0, 1, 0.25\]    | only the thups grow leaves in this case                                                                                   |                   0.8000000|                        1.0000000|              0.9166667|
| game\_5     |         3| playerA | \[0, 1, 0.25\]    | its ok                                                                                                                    |                   0.8000000|                        1.0000000|              0.9166667|
| game\_5     |         3| playerA | \[0, 1, 0.25\]    | oh ok cool                                                                                                                |                   0.8000000|                        1.0000000|              0.9166667|
| game\_5     |         3| playerA | \[0, 1, 0.25\]    | seems like we got this                                                                                                    |                   0.8000000|                        1.0000000|              0.9166667|
| game\_3     |         1| playerB | \[0, 1, 0.25\]    | cheebas grow leaves, while the others do not                                                                              |                   0.8000000|                        1.0000000|              0.9166667|
| game\_3     |         2| playerA | \[0, 1, 0.25\]    | mox, the red bug is poisonous. 1/4 of the orange guys are poisonous too                                                   |                   1.0000000|                        0.8571429|              0.9166667|
| game\_3     |         2| playerA | \[0, 1, 0.25\]    | didn't catch the name                                                                                                     |                   1.0000000|                        0.8571429|              0.9166667|
| game\_1     |         1| playerB | \[0, 1, 0.25\]    | zoov always grow leaves. kaz never grows leaves.                                                                          |                   0.8000000|                        0.8571429|              0.8333333|
| game\_1     |         1| playerB | \[0, 1, 0.25\]    | jav grows leaves 1/4 times                                                                                                |                   0.8000000|                        0.8571429|              0.8333333|
| game\_1     |         1| playerB | \[0, 1, 0.25\]    | i'm ready :)                                                                                                              |                   0.8000000|                        0.8571429|              0.8333333|
| game\_4     |         1| playerB | \[0, 1, 0.25\]    | kaz and jav collect leaves                                                                                                |                   1.0000000|                        0.5714286|              0.7500000|
| game\_2     |         3| playerA | \[0, 1, 0.25\]    | red luzak and orange stup have leaves; those were the only ones i saw                                                     |                   1.0000000|                        0.5714286|              0.7500000|
| game\_2     |         3| playerA | \[0, 1, 0.25\]    | ok, zorb always, saper rarely, jav never, got it                                                                          |                   1.0000000|                        0.5714286|              0.7500000|
| game\_6     |         1| playerB | \[0, 1, 0.25\]    | hi, all grinks, some trufts, and some of the third can't remember the name                                                |                   0.8000000|                        0.7142857|              0.7500000|
| game\_6     |         1| playerB | \[0, 1, 0.25\]    | so i should pick mainly morseth no dorbs and some blin?                                                                   |                   0.8000000|                        0.7142857|              0.7500000|
| game\_6     |         1| playerB | \[0, 1, 0.25\]    | k cya in a few, sorry i don't remember                                                                                    |                   0.8000000|                        0.7142857|              0.7500000|
| game\_6     |         1| playerB | \[0, 1, 0.25\]    | just favor grinks                                                                                                         |                   0.8000000|                        0.7142857|              0.7500000|
| game\_6     |         1| playerB | \[0, 1, 0.25\]    | trufts 2nd                                                                                                                |                   0.8000000|                        0.7142857|              0.7500000|
| game\_5     |         2| playerB | \[0, 1, 0.25\]    | this is what i saw this time                                                                                              |                   0.2000000|                        0.2857143|              0.2500000|
| game\_5     |         2| playerB | \[0, 1, 0.25\]    | thup – yellow – egg property (4 out of 4)                                                                                 |                   0.2000000|                        0.2857143|              0.2500000|
| game\_5     |         2| playerB | \[0, 1, 0.25\]    | ackle – blue – no egg property (0 out of 4)                                                                               |                   0.2000000|                        0.2857143|              0.2500000|
| game\_5     |         2| playerB | \[0, 1, 0.25\]    | ellep – orange – egg property (1 out of 4)                                                                                |                   0.2000000|                        0.2857143|              0.2500000|
| game\_5     |         2| playerB | \[0, 1, 0.25\]    | consistently?                                                                                                             |                   0.2000000|                        0.2857143|              0.2500000|
| game\_5     |         2| playerB | \[0, 1, 0.25\]    | all orange and all purple?                                                                                                |                   0.2000000|                        0.2857143|              0.2500000|
| game\_6     |         2| playerA | \[0, 1, 0.25\]    | stick with plov, some kwep, no fep                                                                                        |                   0.0000000|                        0.4285714|              0.2500000|
| game\_6     |         4| playerB | \[0.5, 0.5, 0.5\] | this is a tough one, yeah what you said, it's a dice roll good luck.                                                      |                   0.8333333|                        0.8333333|              0.8333333|
| game\_1     |         4| playerA | \[0.5, 0.5, 0.5\] | k this one tricky                                                                                                         |                   0.6666667|                        0.5000000|              0.5833333|
| game\_1     |         4| playerA | \[0.5, 0.5, 0.5\] | starting from top and left to right like you did....                                                                      |                   0.6666667|                        0.5000000|              0.5833333|
| game\_1     |         4| playerA | \[0.5, 0.5, 0.5\] | lorch is 2nd one and 4th one                                                                                              |                   0.6666667|                        0.5000000|              0.5833333|
| game\_1     |         4| playerA | \[0.5, 0.5, 0.5\] | thup is 1, 2, and 4                                                                                                       |                   0.6666667|                        0.5000000|              0.5833333|
| game\_1     |         4| playerA | \[0.5, 0.5, 0.5\] | cheeba is 1 and 3                                                                                                         |                   0.6666667|                        0.5000000|              0.5833333|
| game\_1     |         4| playerA | \[0.5, 0.5, 0.5\] | does that make sense?                                                                                                     |                   0.6666667|                        0.5000000|              0.5833333|
| game\_1     |         4| playerA | \[0.5, 0.5, 0.5\] | yup                                                                                                                       |                   0.6666667|                        0.5000000|              0.5833333|
| game\_1     |         4| playerA | \[0.5, 0.5, 0.5\] | ready                                                                                                                     |                   0.6666667|                        0.5000000|              0.5833333|
| game\_1     |         4| playerA | \[0.5, 0.5, 0.5\] | gg                                                                                                                        |                   0.6666667|                        0.5000000|              0.5833333|
| game\_5     |         1| playerB | \[0.5, 0.5, 0.5\] | hi there                                                                                                                  |                   0.5000000|                        0.5000000|              0.5000000|
| game\_5     |         1| playerB | \[0.5, 0.5, 0.5\] | i saw 3 types of things, plovs, glippets and luzaks                                                                       |                   0.5000000|                        0.5000000|              0.5000000|
| game\_5     |         1| playerB | \[0.5, 0.5, 0.5\] | there were 4 of each type, and each type had a 50% chance of having a clover property                                     |                   0.5000000|                        0.5000000|              0.5000000|
| game\_5     |         1| playerA | \[0.5, 0.5, 0.5\] | yeah i did not see a consistency in the types i saw                                                                       |                   0.5000000|                        0.5000000|              0.5000000|
| game\_5     |         1| playerB | \[0.5, 0.5, 0.5\] | was it a 50% chance like for me?                                                                                          |                   0.5000000|                        0.5000000|              0.5000000|
| game\_5     |         1| playerA | \[0.5, 0.5, 0.5\] | yes it was that but i did not have those kinds of creatures                                                               |                   0.5000000|                        0.5000000|              0.5000000|
| game\_5     |         1| playerA | \[0.5, 0.5, 0.5\] | mine were more so involved in crocodiles                                                                                  |                   0.5000000|                        0.5000000|              0.5000000|
| game\_5     |         1| playerB | \[0.5, 0.5, 0.5\] | very cool                                                                                                                 |                   0.5000000|                        0.5000000|              0.5000000|
| game\_5     |         1| playerB | \[0.5, 0.5, 0.5\] | ok i am ready, i will just guess 50% for yours                                                                            |                   0.5000000|                        0.5000000|              0.5000000|
| game\_5     |         1| playerB | \[0.5, 0.5, 0.5\] | ready to go?                                                                                                              |                   0.5000000|                        0.5000000|              0.5000000|
| game\_5     |         1| playerA | \[0.5, 0.5, 0.5\] | yeah whenever you are                                                                                                     |                   0.5000000|                        0.5000000|              0.5000000|
| game\_5     |         1| playerB | \[0.5, 0.5, 0.5\] | ok good luck!                                                                                                             |                   0.5000000|                        0.5000000|              0.5000000|
| game\_5     |         1| playerA | \[0.5, 0.5, 0.5\] | you as well                                                                                                               |                   0.5000000|                        0.5000000|              0.5000000|
| game\_2     |         2| playerB | \[0.5, 0.5, 0.5\] | this time i was shown birds. for every one shown they have a 50% chance to lay an egg.                                    |                   1.0000000|                        0.0000000|              0.5000000|
| game\_2     |         2| playerB | \[0.5, 0.5, 0.5\] | no, each bird lays an egg 50% of the time                                                                                 |                   1.0000000|                        0.0000000|              0.5000000|
| game\_2     |         2| playerB | \[0.5, 0.5, 0.5\] | there is a 50% chance that the bird will lay an egg regardless of name or color                                           |                   1.0000000|                        0.0000000|              0.5000000|
| game\_2     |         2| playerB | \[0.5, 0.5, 0.5\] | ok, ready?                                                                                                                |                   1.0000000|                        0.0000000|              0.5000000|
| game\_2     |         4| playerA | \[0.5, 0.5, 0.5\] | ok. red grink yellow zoov and purple truft lay eggs 50% of the time. 2/4 in all cases                                     |                   0.0000000|                        1.0000000|              0.5000000|
| game\_2     |         4| playerA | \[0.5, 0.5, 0.5\] | u bet                                                                                                                     |                   0.0000000|                        1.0000000|              0.5000000|
| game\_3     |         3| playerA | \[0.5, 0.5, 0.5\] | two of each have the attribute, pick them until you've found 2 from each                                                  |                   0.5000000|                        0.5000000|              0.5000000|
| game\_6     |         4| playerA | \[0.5, 0.5, 0.5\] | all were 50/50                                                                                                            |                   0.5000000|                        0.5000000|              0.5000000|
| game\_4     |         2| playerA | \[0.5, 0.5, 0.5\] | at least two members of each creature are poisonous; it will be difficult to determine which ones are the poison ones     |                   0.5000000|                        0.1666667|              0.3333333|
| game\_4     |         3| playerB | \[0.5, 0.5, 0.5\] | one of each has eggs, but it's hard to tell. so i guess randomly pick every other                                         |                   0.3333333|                        0.3333333|              0.3333333|
| game\_1     |         4| playerB | \[0.5, 0.5, 0.5\] | yep!                                                                                                                      |                   0.1666667|                        0.3333333|              0.2500000|
| game\_1     |         4| playerB | \[0.5, 0.5, 0.5\] | mine is tricky too.                                                                                                       |                   0.1666667|                        0.3333333|              0.2500000|
| game\_1     |         4| playerB | \[0.5, 0.5, 0.5\] | daith - 1/4 of the time (3rd one)                                                                                         |                   0.1666667|                        0.3333333|              0.2500000|
| game\_1     |         4| playerB | \[0.5, 0.5, 0.5\] | kwep - 2/4 (1st and 4th)                                                                                                  |                   0.1666667|                        0.3333333|              0.2500000|
| game\_1     |         4| playerB | \[0.5, 0.5, 0.5\] | plov - 2/4 (2nd and 3rd)                                                                                                  |                   0.1666667|                        0.3333333|              0.2500000|
| game\_1     |         4| playerB | \[0.5, 0.5, 0.5\] | make sense?                                                                                                               |                   0.1666667|                        0.3333333|              0.2500000|
| game\_1     |         4| playerB | \[0.5, 0.5, 0.5\] | me too, and you too!!!                                                                                                    |                   0.1666667|                        0.3333333|              0.2500000|
| game\_3     |         4| playerB | \[0.5, 0.5, 0.5\] | half of each are poisonous                                                                                                |                   0.5000000|                        0.0000000|              0.2500000|

Word Count
==========

![](CritterGame_MP-1_TextAnalysis_Pilot_08_13_files/figure-markdown_github-ascii_identifiers/unnamed-chunk-4-1.png)

Context Word Count
==================

Both Conditions Combined
------------------------

    ## Joining, by = "word"

![](CritterGame_MP-1_TextAnalysis_Pilot_08_13_files/figure-markdown_github-ascii_identifiers/unnamed-chunk-5-1.png)

By Distribution Condition
-------------------------

    ## Joining, by = "word"

![](CritterGame_MP-1_TextAnalysis_Pilot_08_13_files/figure-markdown_github-ascii_identifiers/unnamed-chunk-6-1.png)

Context Words by Word Type
==========================

    ## Joining, by = "word"

![](CritterGame_MP-1_TextAnalysis_Pilot_08_13_files/figure-markdown_github-ascii_identifiers/unnamed-chunk-7-1.png)

By Distribution Condition
-------------------------

    ## Joining, by = "word"

![](CritterGame_MP-1_TextAnalysis_Pilot_08_13_files/figure-markdown_github-ascii_identifiers/unnamed-chunk-8-1.png)

Quantifiers Word Count
======================

Both Conditions Combined
------------------------

![](CritterGame_MP-1_TextAnalysis_Pilot_08_13_files/figure-markdown_github-ascii_identifiers/unnamed-chunk-9-1.png)

Probabilistic Word Count
========================

Both Conditions Combined
------------------------

![](CritterGame_MP-1_TextAnalysis_Pilot_08_13_files/figure-markdown_github-ascii_identifiers/unnamed-chunk-10-1.png)

Conditionals Word Count
=======================

Both Conditions Combined
------------------------

![](CritterGame_MP-1_TextAnalysis_Pilot_08_13_files/figure-markdown_github-ascii_identifiers/unnamed-chunk-11-1.png)

Numeric Word Count
==================

![](CritterGame_MP-1_TextAnalysis_Pilot_08_13_files/figure-markdown_github-ascii_identifiers/unnamed-chunk-12-1.png)

Types Within Categories
=======================

Species Categories
------------------

![](CritterGame_MP-1_TextAnalysis_Pilot_08_13_files/figure-markdown_github-ascii_identifiers/unnamed-chunk-13-1.png)

Colors Categories
-----------------

![](CritterGame_MP-1_TextAnalysis_Pilot_08_13_files/figure-markdown_github-ascii_identifiers/unnamed-chunk-14-1.png)

Internal Property Categories
----------------------------

![](CritterGame_MP-1_TextAnalysis_Pilot_08_13_files/figure-markdown_github-ascii_identifiers/unnamed-chunk-15-1.png)

Total Word Count by Speaker
===========================

![](CritterGame_MP-1_TextAnalysis_Pilot_08_13_files/figure-markdown_github-ascii_identifiers/unnamed-chunk-16-1.png)

Total Word Count by Trial
=========================

![](CritterGame_MP-1_TextAnalysis_Pilot_08_13_files/figure-markdown_github-ascii_identifiers/unnamed-chunk-17-1.png)

Total Word Count by POS
=======================

![](CritterGame_MP-1_TextAnalysis_Pilot_08_13_files/figure-markdown_github-ascii_identifiers/unnamed-chunk-18-1.png)

Total Word Count by Dependencies
================================

![](CritterGame_MP-1_TextAnalysis_Pilot_08_13_files/figure-markdown_github-ascii_identifiers/unnamed-chunk-19-1.png)
