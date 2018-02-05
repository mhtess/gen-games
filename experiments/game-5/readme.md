# Game 5

## Structure
1. 1 - 5 critters are presented on screen and subject must identify the critter as belonging / not belonging to the given critter title, e.g. "wudsy".
1. Previous trials are kept on the screen, throughout the duration of the game
1. After 50 rounds of a single concept, a "moving on to the next concept" slide is shown and the process begins again with another concept. There are 3 concepts in total.

## Note
1. Each concept is taught by presenting a series of pre-generated trials. In the original paper, there are 2 lists per concept, where the value of discrimination, e.g. blue versus green, is different between the two lists. We don't do that here. There is only one list of pre-generated trials per concept.

2. Concepts:
    - Color Orange (Easy) --> Original Paper: Blue
    - Size Small and Body Color Green (Medium)   ---> Original Paper: Size 1 and Blue
    - Critter Fish XOR Body Color Blue (Hard) ---> Original Paper: Circle XOR Blue


## Experiments Run

- `Easy_Rule`: concept learning, one item at a time, 50 trials. $0.13 / minute ~ 10 minutes
  - total experiment space: 3 axes of variability with 3 possible values = 27 possible items (sampled with replacement)
  - target: n = 4 (1 batch) ==> ($.13 * 10) * 1. = 1.56
- `Hard_Rule`: concept learning, one item at a time, 50 trials. $0.13 / minute ~ 10 minutes
  - total experiment space: 3 axes of variability with 3 possible values = 27 possible items (sampled with replacement)
  - target: n = 5 (1 batch) ==> ($.13 * 10) * 1.2 = 1.56