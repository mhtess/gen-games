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

| gameid                                    |  trialNum| distribution      | text                                                                                                                      |  partnerPercentCorrect|
|:------------------------------------------|---------:|:------------------|:--------------------------------------------------------------------------------------------------------------------------|----------------------:|
| 7270-103c2178-9638-4a00-9ca6-5ed29429346a |         1| \[0, 1, 0.25\]    | a zoov lives near crocodiles                                                                                              |              1.0000000|
| 7270-103c2178-9638-4a00-9ca6-5ed29429346a |         1| \[0, 1, 0\]       | kaz and jav collect leaves                                                                                                |              0.7500000|
| 7270-103c2178-9638-4a00-9ca6-5ed29429346a |         2| \[0.5, 0.5, 0.5\] | cheeba and fram have eggs. thup don't                                                                                     |              0.9166667|
| 7270-103c2178-9638-4a00-9ca6-5ed29429346a |         2| \[0, 1, 0.75\]    | at least two members of each creature are poisonous; it will be difficult to determine which ones are the poison ones     |              0.3333333|
| 7270-103c2178-9638-4a00-9ca6-5ed29429346a |         3| \[0, 1, 0.25\]    | one of each has eggs, but it's hard to tell. so i guess randomly pick every other                                         |              0.3333333|
| 7270-103c2178-9638-4a00-9ca6-5ed29429346a |         4| \[0, 1, 0.75\]    | only daith are poisonous                                                                                                  |              1.0000000|
| 7270-103c2178-9638-4a00-9ca6-5ed29429346a |         4| \[0, 1, 0\]       | all elleps and most sapers grow eggs                                                                                      |              0.9166667|
| 7270-103c2178-9638-4a00-9ca6-5ed29429346a |         4| \[0, 1, 0.75\]    | ok                                                                                                                        |              1.0000000|
| 0092-4cf18622-eb4d-46de-9e81-4bedec469478 |         1| \[0, 1, 0.25\]    | Ackle and Mox Don't live near crocs                                                                                       |              0.9166667|
| 0092-4cf18622-eb4d-46de-9e81-4bedec469478 |         1| \[0, 1, 0.25\]    | Feb always live near crocs (Feb is the special ones)                                                                      |              0.9166667|
| 0092-4cf18622-eb4d-46de-9e81-4bedec469478 |         1| \[0, 1, 0.25\]    | zoov always grow leaves. kaz never grows leaves.                                                                          |              0.8333333|
| 0092-4cf18622-eb4d-46de-9e81-4bedec469478 |         1| \[0, 1, 0.25\]    | kk ready when you are                                                                                                     |              0.9166667|
| 0092-4cf18622-eb4d-46de-9e81-4bedec469478 |         1| \[0, 1, 0.25\]    | jav grows leaves 1/4 times                                                                                                |              0.8333333|
| 0092-4cf18622-eb4d-46de-9e81-4bedec469478 |         1| \[0, 1, 0.25\]    | I'm ready :)                                                                                                              |              0.8333333|
| 0092-4cf18622-eb4d-46de-9e81-4bedec469478 |         2| \[0, 1, 0.75\]    | Taifel and oller never lay eggs.                                                                                          |              1.0000000|
| 0092-4cf18622-eb4d-46de-9e81-4bedec469478 |         2| \[0, 1, 0.75\]    | Ellep always lays eggs.                                                                                                   |              1.0000000|
| 0092-4cf18622-eb4d-46de-9e81-4bedec469478 |         2| \[0, 1, 0\]       | Krivel is poisonus 3/4 time                                                                                               |              0.8333333|
| 0092-4cf18622-eb4d-46de-9e81-4bedec469478 |         2| \[0, 1, 0\]       | Dorb is always poisonus                                                                                                   |              0.8333333|
| 0092-4cf18622-eb4d-46de-9e81-4bedec469478 |         2| \[0, 1, 0\]       | Other one ( i missed name so sorry) is never                                                                              |              0.8333333|
| 0092-4cf18622-eb4d-46de-9e81-4bedec469478 |         2| \[0, 1, 0.75\]    | Okay cool. Ready!                                                                                                         |              1.0000000|
| 0092-4cf18622-eb4d-46de-9e81-4bedec469478 |         2| \[0, 1, 0\]       | yup yup                                                                                                                   |              0.8333333|
| 0092-4cf18622-eb4d-46de-9e81-4bedec469478 |         3| \[0, 1, 0\]       | blin lives near crocs                                                                                                     |              0.8333333|
| 0092-4cf18622-eb4d-46de-9e81-4bedec469478 |         3| \[0, 1, 0.75\]    | Crullet = Always Luzak/Grink = never                                                                                      |              1.0000000|
| 0092-4cf18622-eb4d-46de-9e81-4bedec469478 |         3| \[0, 1, 0.75\]    | kk                                                                                                                        |              1.0000000|
| 0092-4cf18622-eb4d-46de-9e81-4bedec469478 |         3| \[0, 1, 0\]       | mook never live near crocs                                                                                                |              0.8333333|
| 0092-4cf18622-eb4d-46de-9e81-4bedec469478 |         3| \[0, 1, 0\]       | zorb lives near crocs 3/4 of the time (from left to right starting at top, first two are yes, third is no, fourth is yes) |              0.8333333|
| 0092-4cf18622-eb4d-46de-9e81-4bedec469478 |         3| \[0, 1, 0\]       | lmk if that makes sense                                                                                                   |              0.8333333|
| 0092-4cf18622-eb4d-46de-9e81-4bedec469478 |         3| \[0, 1, 0.75\]    | k got it                                                                                                                  |              1.0000000|
| 0092-4cf18622-eb4d-46de-9e81-4bedec469478 |         3| \[0, 1, 0\]       | Okay!                                                                                                                     |              0.8333333|
| 0092-4cf18622-eb4d-46de-9e81-4bedec469478 |         4| \[0.5, 0.5, 0.5\] | k this one tricky                                                                                                         |              0.5833333|
| 0092-4cf18622-eb4d-46de-9e81-4bedec469478 |         4| \[0.5, 0.5, 0.5\] | starting from top and left to right like you did....                                                                      |              0.5833333|
| 0092-4cf18622-eb4d-46de-9e81-4bedec469478 |         4| \[0.5, 0.5, 0.5\] | Lorch is 2nd one and 4th one                                                                                              |              0.5833333|
| 0092-4cf18622-eb4d-46de-9e81-4bedec469478 |         4| \[0.5, 0.5, 0.5\] | Thup is 1, 2, and 4                                                                                                       |              0.5833333|
| 0092-4cf18622-eb4d-46de-9e81-4bedec469478 |         4| \[0.5, 0.5, 0.5\] | Cheeba is 1 and 3                                                                                                         |              0.5833333|
| 0092-4cf18622-eb4d-46de-9e81-4bedec469478 |         4| \[0.5, 0.5, 0.5\] | does that make sense?                                                                                                     |              0.5833333|
| 0092-4cf18622-eb4d-46de-9e81-4bedec469478 |         4| \[0.5, 0.5, 0.5\] | Yep!                                                                                                                      |              0.2500000|
| 0092-4cf18622-eb4d-46de-9e81-4bedec469478 |         4| \[0.5, 0.5, 0.5\] | Mine is tricky too.                                                                                                       |              0.2500000|
| 0092-4cf18622-eb4d-46de-9e81-4bedec469478 |         4| \[0.5, 0.5, 0.5\] | daith - 1/4 of the time (3rd one)                                                                                         |              0.2500000|
| 0092-4cf18622-eb4d-46de-9e81-4bedec469478 |         4| \[0.5, 0.5, 0.5\] | kwep - 2/4 (1st and 4th)                                                                                                  |              0.2500000|
| 0092-4cf18622-eb4d-46de-9e81-4bedec469478 |         4| \[0.5, 0.5, 0.5\] | plov - 2/4 (2nd and 3rd)                                                                                                  |              0.2500000|
| 0092-4cf18622-eb4d-46de-9e81-4bedec469478 |         4| \[0.5, 0.5, 0.5\] | make sense?                                                                                                               |              0.2500000|
| 0092-4cf18622-eb4d-46de-9e81-4bedec469478 |         4| \[0.5, 0.5, 0.5\] | yup                                                                                                                       |              0.5833333|
| 0092-4cf18622-eb4d-46de-9e81-4bedec469478 |         4| \[0.5, 0.5, 0.5\] | ready                                                                                                                     |              0.5833333|
| 0092-4cf18622-eb4d-46de-9e81-4bedec469478 |         4| \[0.5, 0.5, 0.5\] | gg                                                                                                                        |              0.5833333|
| 0092-4cf18622-eb4d-46de-9e81-4bedec469478 |         4| \[0.5, 0.5, 0.5\] | me too, and you too!!!                                                                                                    |              0.2500000|
| 7480-f3534652-26df-4fb1-848f-859a2cc64c33 |         1| \[0.5, 0.5, 0.5\] | Hi There                                                                                                                  |              0.5000000|
| 7480-f3534652-26df-4fb1-848f-859a2cc64c33 |         1| \[0.5, 0.5, 0.5\] | I saw 3 types of things, plovs, glippets and luzaks                                                                       |              0.5000000|
| 7480-f3534652-26df-4fb1-848f-859a2cc64c33 |         1| \[0.5, 0.5, 0.5\] | There were 4 of each type, and each type had a 50% chance of having a clover property                                     |              0.5000000|
| 7480-f3534652-26df-4fb1-848f-859a2cc64c33 |         1| \[0.5, 0.5, 0.5\] | yeah i did not see a consistency in the types i saw                                                                       |              0.5000000|
| 7480-f3534652-26df-4fb1-848f-859a2cc64c33 |         1| \[0.5, 0.5, 0.5\] | was it a 50% chance like for me?                                                                                          |              0.5000000|
| 7480-f3534652-26df-4fb1-848f-859a2cc64c33 |         1| \[0.5, 0.5, 0.5\] | yes it was that but i did not have those kinds of creatures                                                               |              0.5000000|
| 7480-f3534652-26df-4fb1-848f-859a2cc64c33 |         1| \[0.5, 0.5, 0.5\] | mine were more so involved in crocodiles                                                                                  |              0.5000000|
| 7480-f3534652-26df-4fb1-848f-859a2cc64c33 |         1| \[0.5, 0.5, 0.5\] | very cool                                                                                                                 |              0.5000000|
| 7480-f3534652-26df-4fb1-848f-859a2cc64c33 |         1| \[0.5, 0.5, 0.5\] | OK I am ready, I will just guess 50% for yours                                                                            |              0.5000000|
| 7480-f3534652-26df-4fb1-848f-859a2cc64c33 |         1| \[0.5, 0.5, 0.5\] | Ready to go?                                                                                                              |              0.5000000|
| 7480-f3534652-26df-4fb1-848f-859a2cc64c33 |         1| \[0.5, 0.5, 0.5\] | yeah whenever you are                                                                                                     |              0.5000000|
| 7480-f3534652-26df-4fb1-848f-859a2cc64c33 |         1| \[0.5, 0.5, 0.5\] | ok good luck!                                                                                                             |              0.5000000|
| 7480-f3534652-26df-4fb1-848f-859a2cc64c33 |         1| \[0.5, 0.5, 0.5\] | you as well                                                                                                               |              0.5000000|
| 7480-f3534652-26df-4fb1-848f-859a2cc64c33 |         2| \[0, 1, 0.75\]    | This is what I saw this time                                                                                              |              0.2500000|
| 7480-f3534652-26df-4fb1-848f-859a2cc64c33 |         2| \[0, 1, 0.75\]    | Thup – Yellow – Egg property (4 out of 4)                                                                                 |              0.2500000|
| 7480-f3534652-26df-4fb1-848f-859a2cc64c33 |         2| \[0, 1, 0.75\]    | Ackle – Blue – NO Egg property (0 out of 4)                                                                               |              0.2500000|
| 7480-f3534652-26df-4fb1-848f-859a2cc64c33 |         2| \[0, 1, 0.75\]    | Ellep – Orange – Egg property (1 out of 4)                                                                                |              0.2500000|
| 7480-f3534652-26df-4fb1-848f-859a2cc64c33 |         2| \[0, 1, 0.25\]    | oh wow                                                                                                                    |              0.9166667|
| 7480-f3534652-26df-4fb1-848f-859a2cc64c33 |         2| \[0, 1, 0.25\]    | i had an orange creature and he was poisonous, so were all the purple ones                                                |              0.9166667|
| 7480-f3534652-26df-4fb1-848f-859a2cc64c33 |         2| \[0, 1, 0.75\]    | consistently?                                                                                                             |              0.2500000|
| 7480-f3534652-26df-4fb1-848f-859a2cc64c33 |         2| \[0, 1, 0.25\]    | all of them, yes                                                                                                          |              0.9166667|
| 7480-f3534652-26df-4fb1-848f-859a2cc64c33 |         2| \[0, 1, 0.75\]    | All orange and all purple?                                                                                                |              0.2500000|
| 7480-f3534652-26df-4fb1-848f-859a2cc64c33 |         2| \[0, 1, 0.25\]    | yes                                                                                                                       |              0.9166667|
| 7480-f3534652-26df-4fb1-848f-859a2cc64c33 |         3| \[0, 1, 0.25\]    | Sorry I clicked continue too fast last time!                                                                              |              1.0000000|
| 7480-f3534652-26df-4fb1-848f-859a2cc64c33 |         3| \[0, 1, 0\]       | only the thups grow leaves in this case                                                                                   |              0.9166667|
| 7480-f3534652-26df-4fb1-848f-859a2cc64c33 |         3| \[0, 1, 0\]       | its ok                                                                                                                    |              0.9166667|
| 7480-f3534652-26df-4fb1-848f-859a2cc64c33 |         3| \[0, 1, 0.25\]    | Only the orange ones this time for me                                                                                     |              1.0000000|
| 7480-f3534652-26df-4fb1-848f-859a2cc64c33 |         3| \[0, 1, 0\]       | oh ok cool                                                                                                                |              0.9166667|
| 7480-f3534652-26df-4fb1-848f-859a2cc64c33 |         3| \[0, 1, 0\]       | seems like we got this                                                                                                    |              0.9166667|
| 7480-f3534652-26df-4fb1-848f-859a2cc64c33 |         3| \[0, 1, 0.25\]    | I agree :)                                                                                                                |              1.0000000|
| 7480-f3534652-26df-4fb1-848f-859a2cc64c33 |         3| \[0, 1, 0.25\]    | here we go!                                                                                                               |              1.0000000|
| 7480-f3534652-26df-4fb1-848f-859a2cc64c33 |         4| \[0, 1, 0.75\]    | only the purple creatures should you be interested in                                                                     |              1.0000000|
| 7480-f3534652-26df-4fb1-848f-859a2cc64c33 |         4| \[0, 1, 0.75\]    | all of them                                                                                                               |              1.0000000|
| 7480-f3534652-26df-4fb1-848f-859a2cc64c33 |         4| \[0, 1, 0\]       | This time all the blue lorches are poisonous                                                                              |              0.9166667|
| 7480-f3534652-26df-4fb1-848f-859a2cc64c33 |         4| \[0, 1, 0.75\]    | ok good                                                                                                                   |              1.0000000|
| 7480-f3534652-26df-4fb1-848f-859a2cc64c33 |         4| \[0, 1, 0\]       | and 3 out of 4 purple dorbs are poisonous                                                                                 |              0.9166667|
| 7480-f3534652-26df-4fb1-848f-859a2cc64c33 |         4| \[0, 1, 0\]       | might as well go for all the blues and purples                                                                            |              0.9166667|
| 7480-f3534652-26df-4fb1-848f-859a2cc64c33 |         4| \[0, 1, 0.75\]    | sounds like a plan                                                                                                        |              1.0000000|
| 7480-f3534652-26df-4fb1-848f-859a2cc64c33 |         4| \[0, 1, 0\]       | kk good luck!                                                                                                             |              0.9166667|
| 3416-c018ab1b-f022-41c4-893c-462e12108278 |         1| \[0, 1, 0\]       | morseth has crocodiles; none others                                                                                       |              0.0000000|
| 3416-c018ab1b-f022-41c4-893c-462e12108278 |         1| \[0, 1, 0\]       | I learned that kaz plants grow leaves and the others do not. Kaz plants are purple.                                       |              1.0000000|
| 3416-c018ab1b-f022-41c4-893c-462e12108278 |         1| \[0, 1, 0\]       | What color was Morseth?                                                                                                   |              1.0000000|
| 3416-c018ab1b-f022-41c4-893c-462e12108278 |         1| \[0, 1, 0\]       | I think it came in a few colors; all had crocs nearby                                                                     |              0.0000000|
| 3416-c018ab1b-f022-41c4-893c-462e12108278 |         1| \[0, 1, 0\]       | ok                                                                                                                        |              1.0000000|
| 3416-c018ab1b-f022-41c4-893c-462e12108278 |         1| \[0, 1, 0\]       | you ready to continue to the thing?                                                                                       |              1.0000000|
| 3416-c018ab1b-f022-41c4-893c-462e12108278 |         1| \[0, 1, 0\]       | sure!                                                                                                                     |              0.0000000|
| 3416-c018ab1b-f022-41c4-893c-462e12108278 |         1| \[0, 1, 0\]       | ok, let's make some money                                                                                                 |              1.0000000|
| 3416-c018ab1b-f022-41c4-893c-462e12108278 |         2| \[0, 1, 0.75\]    | This time I was shown birds. for every one shown they have a 50% chance to lay an egg.                                    |              0.5000000|
| 3416-c018ab1b-f022-41c4-893c-462e12108278 |         2| \[0.5, 0.5, 0.5\] | orange crullet is poisonous; yellow mox is likely to be, but not every time                                               |              0.8333333|
| 3416-c018ab1b-f022-41c4-893c-462e12108278 |         2| \[0.5, 0.5, 0.5\] | each bird is equally likely you mean?                                                                                     |              0.8333333|
| 3416-c018ab1b-f022-41c4-893c-462e12108278 |         2| \[0, 1, 0.75\]    | no, each bird lays an egg 50% of the time                                                                                 |              0.5000000|
| 3416-c018ab1b-f022-41c4-893c-462e12108278 |         2| \[0, 1, 0.75\]    | there is a 50% chance that the bird will lay an egg regardless of name or color                                           |              0.5000000|
| 3416-c018ab1b-f022-41c4-893c-462e12108278 |         2| \[0.5, 0.5, 0.5\] | k gotcha                                                                                                                  |              0.8333333|
| 3416-c018ab1b-f022-41c4-893c-462e12108278 |         2| \[0, 1, 0.75\]    | ok, ready?                                                                                                                |              0.5000000|
| 3416-c018ab1b-f022-41c4-893c-462e12108278 |         2| \[0.5, 0.5, 0.5\] | yep!                                                                                                                      |              0.8333333|
| 3416-c018ab1b-f022-41c4-893c-462e12108278 |         3| \[0, 1, 0.25\]    | zorb is near crocs, zaper is very very rarely near crocs (1/4 near crocs), and jav is never near crocs                    |              1.0000000|
| 3416-c018ab1b-f022-41c4-893c-462e12108278 |         3| \[0, 1, 0.25\]    | red luzak and orange stup have leaves; those were the only ones I saw                                                     |              0.7500000|
| 3416-c018ab1b-f022-41c4-893c-462e12108278 |         3| \[0, 1, 0.25\]    | OK, zorb always, zaper rarely, jav never, got it                                                                          |              0.7500000|
| 3416-c018ab1b-f022-41c4-893c-462e12108278 |         4| \[0.5, 0.5, 0.5\] | thup poisonous 100%, fram 3/4 of the time, wug never poisonous                                                            |              0.5000000|
| 3416-c018ab1b-f022-41c4-893c-462e12108278 |         4| \[0, 1, 0.75\]    | OK. red grink yellow zoov and purple truft lay eggs 50% of the time. 2/4 in all cases                                     |              0.5000000|
| 3416-c018ab1b-f022-41c4-893c-462e12108278 |         4| \[0.5, 0.5, 0.5\] | ok, rdy?                                                                                                                  |              0.5000000|
| 3416-c018ab1b-f022-41c4-893c-462e12108278 |         4| \[0, 1, 0.75\]    | u bet                                                                                                                     |              0.5000000|
| 4168-ead62023-8119-4366-8c05-e2091e126643 |         1| \[0, 1, 0.25\]    | kwep, the purple fish, lives near aligators. the other two were blue and red, and do not have any hidden attributes       |              0.4166667|
| 4168-ead62023-8119-4366-8c05-e2091e126643 |         1| \[0, 1, 0\]       | Cheebas grow leaves, while the others do not                                                                              |              0.9166667|
| 4168-ead62023-8119-4366-8c05-e2091e126643 |         2| \[0, 1, 0.25\]    | Just taifels lay eggs                                                                                                     |              1.0000000|
| 4168-ead62023-8119-4366-8c05-e2091e126643 |         2| \[0, 1, 0\]       | Mox, the red bug is poisonous. 1/4 of the orange guys are poisonous too                                                   |              0.9166667|
| 4168-ead62023-8119-4366-8c05-e2091e126643 |         2| \[0, 1, 0\]       | didn't catch the name                                                                                                     |              0.9166667|
| 4168-ead62023-8119-4366-8c05-e2091e126643 |         3| \[0, 1, 0.75\]    | two of each have the attribute, pick them until you've found 2 from each                                                  |              0.5000000|
| 4168-ead62023-8119-4366-8c05-e2091e126643 |         3| \[0.5, 0.5, 0.5\] | Mooks and reisels are near crocodiles.                                                                                    |              0.9166667|
| 4168-ead62023-8119-4366-8c05-e2091e126643 |         4| \[0.5, 0.5, 0.5\] | fram and daith have the attribute                                                                                         |              0.9166667|
| 4168-ead62023-8119-4366-8c05-e2091e126643 |         4| \[0, 1, 0.75\]    | Half of each are poisonous                                                                                                |              0.2500000|
| 7885-73f4a3d7-c242-46d0-96f2-a0c9fb4c2307 |         1| \[0, 1, 0.75\]    | hi, all grinks, some trufts, and some of the third can't remember the name                                                |              0.7500000|
| 7885-73f4a3d7-c242-46d0-96f2-a0c9fb4c2307 |         1| \[0, 1, 0.25\]    | Hi, dorb fish do not live near crocodiles; morseth do; blin sometime do                                                   |              0.9166667|
| 7885-73f4a3d7-c242-46d0-96f2-a0c9fb4c2307 |         1| \[0, 1, 0.75\]    | so i should pick mainly morseth no dorbs and some blin?                                                                   |              0.7500000|
| 7885-73f4a3d7-c242-46d0-96f2-a0c9fb4c2307 |         1| \[0, 1, 0.25\]    | yes                                                                                                                       |              0.9166667|
| 7885-73f4a3d7-c242-46d0-96f2-a0c9fb4c2307 |         1| \[0, 1, 0.25\]    | what is the name of the third one in your group                                                                           |              0.9166667|
| 7885-73f4a3d7-c242-46d0-96f2-a0c9fb4c2307 |         1| \[0, 1, 0.75\]    | k cya in a few, sorry i don't remember                                                                                    |              0.7500000|
| 7885-73f4a3d7-c242-46d0-96f2-a0c9fb4c2307 |         1| \[0, 1, 0.75\]    | just favor grunks                                                                                                         |              0.7500000|
| 7885-73f4a3d7-c242-46d0-96f2-a0c9fb4c2307 |         1| \[0, 1, 0.25\]    | ok                                                                                                                        |              0.9166667|
| 7885-73f4a3d7-c242-46d0-96f2-a0c9fb4c2307 |         1| \[0, 1, 0.75\]    | trufts 2nd                                                                                                                |              0.7500000|
| 7885-73f4a3d7-c242-46d0-96f2-a0c9fb4c2307 |         2| \[0, 1, 0.25\]    | javs lay eggs, the other two didn't                                                                                       |              1.0000000|
| 7885-73f4a3d7-c242-46d0-96f2-a0c9fb4c2307 |         2| \[0, 1, 0\]       | stick with plov, some kwep, no fep                                                                                        |              0.2500000|
| 7885-73f4a3d7-c242-46d0-96f2-a0c9fb4c2307 |         2| \[0, 1, 0.25\]    | k thanx                                                                                                                   |              1.0000000|
| 7885-73f4a3d7-c242-46d0-96f2-a0c9fb4c2307 |         3| \[0, 1, 0.75\]    | only wug                                                                                                                  |              1.0000000|
| 7885-73f4a3d7-c242-46d0-96f2-a0c9fb4c2307 |         3| \[0, 1, 0\]       | all ollers, some kaz and none of the third                                                                                |              0.9166667|
| 7885-73f4a3d7-c242-46d0-96f2-a0c9fb4c2307 |         3| \[0, 1, 0\]       | k ty                                                                                                                      |              0.9166667|
| 7885-73f4a3d7-c242-46d0-96f2-a0c9fb4c2307 |         4| \[0.5, 0.5, 0.5\] | all were 50/50                                                                                                            |              0.5000000|
| 7885-73f4a3d7-c242-46d0-96f2-a0c9fb4c2307 |         4| \[0.5, 0.5, 0.5\] | this is a tough one, yeah what you said, it's a dice roll good luck.                                                      |              0.8333333|

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
