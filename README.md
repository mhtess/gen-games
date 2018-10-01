# Generalization Games

## Experiments (Games)

For more specific details on the individual games, please check out the code for the appropriate game in the `./experiments` folder.

In general, one can run a game with the following commands where `{game-name}` indicates the name of the specific experiment:

- run `npm install` inside `experiments/{game-name}/`

- run: `node app.js --expname {game-name}`
- navigate to: `http://localhost:8888/{game-name}/index.html`


### Single Player Experiments

Single player games are denoted by folder names such as `game-1`, `game-2`, etc. 

### Multiplayer Experiments

Several of the generalization games center around multiplayer interactions. These are built upon an unofficial fork of [reference_games](https://github.com/hawkrobe/reference_games) by [Robert Hawkins](https://github.com/hawkrobe).

Multiplayer games are denoted by folder names such as `mp-game-1`, `mp-game-2`, etc.

## Data

Anonymized data from respective experiments can be found in the `./data` folder.

## Mturk

Instructions for running these experiments on MTurk along with data cleaning functionality can be found in the `./mturk` folder.


## R Data Analysis

R markdown, webppl scripts, etc. utilzed for analysis of raw data can be found in the `./r_data_analysis` folder.
 


