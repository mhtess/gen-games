Critter Game - Data - Catch Trial
================
Lauren Oey
7/7/2017

``` r
library(dplyr)
```

    ## 
    ## Attaching package: 'dplyr'

    ## The following objects are masked from 'package:stats':
    ## 
    ##     filter, lag

    ## The following objects are masked from 'package:base':
    ## 
    ##     intersect, setdiff, setequal, union

``` r
library(tidyr)
library(ggplot2)
library(data.table)
```

    ## 
    ## Attaching package: 'data.table'

    ## The following objects are masked from 'package:dplyr':
    ## 
    ##     between, first, last

``` r
# library(xtable)


# setting the directory
setwd("../mturk/game-1/")


catch_trial_data <- read.csv("game-1-catch_trials.csv")

# View(catch_trial_data)

str(catch_trial_data)
```

    ## 'data.frame':    216 obs. of  27 variables:
    ##  $ workerid       : int  0 0 0 0 0 0 0 0 0 0 ...
    ##  $ col4_crit      : int  -99 -99 -99 -99 -99 -99 -99 -99 -99 -99 ...
    ##  $ species        : Factor w/ 3 levels "blicket","rambo",..: 3 2 3 3 1 3 1 2 2 2 ...
    ##  $ prop2_crit     : Factor w/ 1 level "fatness": 1 1 1 1 1 1 1 1 1 1 ...
    ##  $ trial_num      : int  1 2 3 4 5 6 7 8 9 10 ...
    ##  $ question       : Factor w/ 2 levels "tar1","tar2": 1 1 1 2 2 1 1 1 1 1 ...
    ##  $ time_in_seconds: num  6.08 4.19 5.38 5.09 4.28 ...
    ##  $ prop1_crit     : Factor w/ 1 level "height": 1 1 1 1 1 1 1 1 1 1 ...
    ##  $ critter        : Factor w/ 1 level "bird": 1 1 1 1 1 1 1 1 1 1 ...
    ##  $ col1_crit      : Factor w/ 1 level "crest": 1 1 1 1 1 1 1 1 1 1 ...
    ##  $ tar1_crit      : Factor w/ 1 level "tail": 1 1 1 1 1 1 1 1 1 1 ...
    ##  $ tar2_crit      : Factor w/ 1 level "crest": 1 1 1 1 1 1 1 1 1 1 ...
    ##  $ col3_crit      : Factor w/ 1 level "wing": 1 1 1 1 1 1 1 1 1 1 ...
    ##  $ col2_crit      : Factor w/ 1 level "body": 1 1 1 1 1 1 1 1 1 1 ...
    ##  $ col4           : int  -99 -99 -99 -99 -99 -99 -99 -99 -99 -99 ...
    ##  $ col5           : int  -99 -99 -99 -99 -99 -99 -99 -99 -99 -99 ...
    ##  $ col2           : Factor w/ 39 levels "#00fc1a","#00fd1a",..: 3 38 5 3 36 3 25 31 39 38 ...
    ##  $ col3           : Factor w/ 216 levels "#003402","#013b04",..: 28 77 49 3 152 53 195 110 108 96 ...
    ##  $ col1           : Factor w/ 216 levels "#06b114","#07951f",..: 21 106 14 70 129 5 189 112 130 192 ...
    ##  $ response       : Factor w/ 2 levels "No","Yes": 1 1 2 1 1 1 2 2 1 1 ...
    ##  $ condition      : Factor w/ 2 levels "label_book","pepsin_detector": 2 2 2 2 2 2 2 2 2 2 ...
    ##  $ trial_type     : Factor w/ 1 level "learning_trial": 1 1 1 1 1 1 1 1 1 1 ...
    ##  $ prop1          : num  0.8931 0.5617 0.7862 0.0509 0.6534 ...
    ##  $ prop2          : num  0.0664 0.6558 0.8201 0.2259 0.0209 ...
    ##  $ col5_crit      : int  -99 -99 -99 -99 -99 -99 -99 -99 -99 -99 ...
    ##  $ tar2           : int  1 0 1 0 0 0 0 0 0 0 ...
    ##  $ tar1           : int  0 0 1 0 1 0 1 1 0 0 ...

``` r
summary(catch_trial_data)
```

    ##     workerid      col4_crit      species     prop2_crit    trial_num    
    ##  Min.   : 0.0   Min.   :-99   blicket:72   fatness:216   Min.   : 1.00  
    ##  1st Qu.: 4.0   1st Qu.:-99   rambo  :72                 1st Qu.: 3.75  
    ##  Median : 8.5   Median :-99   wug    :72                 Median : 6.50  
    ##  Mean   : 8.5   Mean   :-99                              Mean   : 6.50  
    ##  3rd Qu.:13.0   3rd Qu.:-99                              3rd Qu.: 9.25  
    ##  Max.   :17.0   Max.   :-99                              Max.   :12.00  
    ##                                                                         
    ##  question   time_in_seconds    prop1_crit  critter    col1_crit  
    ##  tar1:114   Min.   :  1.068   height:216   bird:216   crest:216  
    ##  tar2:102   1st Qu.:  3.147                                      
    ##             Median :  4.391                                      
    ##             Mean   :  6.225                                      
    ##             3rd Qu.:  5.905                                      
    ##             Max.   :125.962                                      
    ##                                                                  
    ##  tar1_crit  tar2_crit   col3_crit  col2_crit       col4          col5    
    ##  tail:216   crest:216   wing:216   body:216   Min.   :-99   Min.   :-99  
    ##                                               1st Qu.:-99   1st Qu.:-99  
    ##                                               Median :-99   Median :-99  
    ##                                               Mean   :-99   Mean   :-99  
    ##                                               3rd Qu.:-99   3rd Qu.:-99  
    ##                                               Max.   :-99   Max.   :-99  
    ##                                                                          
    ##       col2          col3          col1     response            condition  
    ##  #00fd1a: 16   #003402:  1   #06b114:  1   No :146   label_book     : 96  
    ##  #fd4501: 14   #013b04:  1   #07951f:  1   Yes: 70   pepsin_detector:120  
    ##  #fdfd00: 14   #02470d:  1   #07ed12:  1                                  
    ##  #00fe1a: 11   #025b0e:  1   #08a71a:  1                                  
    ##  #01fe1b: 10   #032502:  1   #099a09:  1                                  
    ##  #fd4602: 10   #036408:  1   #0acd03:  1                                  
    ##  (Other):141   (Other):210   (Other):210                                  
    ##           trial_type      prop1              prop2            col5_crit  
    ##  learning_trial:216   Min.   :0.001375   Min.   :0.005031   Min.   :-99  
    ##                       1st Qu.:0.257924   1st Qu.:0.285344   1st Qu.:-99  
    ##                       Median :0.472199   Median :0.517731   Median :-99  
    ##                       Mean   :0.497446   Mean   :0.518468   Mean   :-99  
    ##                       3rd Qu.:0.749876   3rd Qu.:0.766488   3rd Qu.:-99  
    ##                       Max.   :0.995712   Max.   :0.999520   Max.   :-99  
    ##                                                                          
    ##       tar2              tar1       
    ##  Min.   :0.00000   Min.   :0.0000  
    ##  1st Qu.:0.00000   1st Qu.:0.0000  
    ##  Median :0.00000   Median :1.0000  
    ##  Mean   :0.07407   Mean   :0.5556  
    ##  3rd Qu.:0.00000   3rd Qu.:1.0000  
    ##  Max.   :1.00000   Max.   :1.0000  
    ## 

Adjusting Dataframe
===================

``` r
#attach(catch_trial_data)
catch_trial_data$question_name <- as.factor(ifelse(catch_trial_data$question=="tar1", "tail", "head"))
catch_trial_data$tar1_logic <- as.logical(catch_trial_data$tar1)
catch_trial_data$tar2_logic <- as.logical(catch_trial_data$tar2)
catch_trial_data$trial_num <- as.factor(catch_trial_data$trial_num)
catch_trial_data$workerid <- as.factor(catch_trial_data$workerid)
catch_trial_data$response_logic <- ifelse(catch_trial_data$response=="Yes", TRUE, FALSE)
catch_trial_data$Correct <- ifelse(catch_trial_data$question_name=="tail", ifelse(catch_trial_data$tar1_logic==catch_trial_data$response_logic, TRUE, FALSE), ifelse(catch_trial_data$tar2_logic==catch_trial_data$response_logic, TRUE, FALSE))
```

Proportion Correct By Subject
=============================

``` r
catch_trial_data_by_subj <- catch_trial_data %>%
  group_by(workerid, trial_num, condition) %>%
  distinct() %>%
  summarise(Total = 1, Correct_trial = ifelse(Correct==TRUE, 1, 0)) %>%
  group_by(workerid, condition) %>%
  summarise(Total_trials = sum(Total), Correct_trials = sum(Correct_trial)) %>%
  mutate(Percentage_correct = Correct_trials/Total_trials) %>%
  select(workerid, Percentage_correct, condition)

#catch_trial_data_by_subj

#xt <- xtable(catch_trial_data_by_subj, type="html", caption = "Percentage of correct catch trials per subject.", label = "catch_trial_data_by_subj")
#names(xt) <- c('Subject', 'Percentage of Correct Trials')
#print(xt, comment=FALSE)

Condition_lab <- c(
  pepsin_detector = 'Pepsin Detector',
  label_book = 'Label Book')

graph_by_subj <- ggplot(catch_trial_data_by_subj, aes(x=workerid, y=Percentage_correct, colour=condition, fill=condition)) +
  geom_bar(stat="identity") +
  scale_x_discrete("Subject Number") +
  scale_y_continuous("Percentage of Trials Correct") +
  scale_colour_discrete(guide=guide_legend("Condition"), labels=Condition_lab) +
  scale_fill_discrete(guide=guide_legend("Condition"), labels=Condition_lab) +
  ggtitle("Accuracy on Catch Trials by Subject") +
  theme_minimal()
graph_by_subj
```

![](CritterGame_DataAnalysis_files/figure-markdown_github-ascii_identifiers/unnamed-chunk-2-1.png)
