import re
import json
import csv

#output_file must be the file resieved from running a getresults request from Mturk
# json_file_name is the name of the json file that will save your outputs
def parse( output_file, json_file_name ):
    with open( output_file, 'r' ) as f:
        # split to remove tabs, 
        first_line = f.readline().strip().replace('"', '').split()
        # compile string in order to get each enclosed string in quotes so as to correctly organize the info
        regex = re.compile( '"[^"]*"' )
        output = []
        for line in f:
            line.replace('""', '') # Replace double quotes with nothing (this is present in JSON Serialized Objcects)
            result = {}
            # matching string with quotes around
            results_info = regex.findall( line )


            if ( len(results_info) > 0 ):
                for x in range(0, len(first_line)):
                    key = first_line[x]
                    value = results_info[x].replace('"', '')


                    print key, value

                    # the answers are wrapped in one giant quote
                    if key == 'answers[question_id':
                        # split the value string and loop over the result for all answers submitted
                        answers = value.split()
                        for answer in answers:
                            # split by equal sign to have a list of question name and corresponding answer
                            a = answer.split('=')
                            if ( len(a) > 1 ):
                                key = a[0]
                                value = a[1]
                                result[key] = value
                    else:
                        result[key] = value
                output.append(result)
        # dump the results to a json file 
        json_output = json.dumps(output, indent=2)
        json_file = open(json_file_name, 'w')
        json_file.write(json_output + "\n")
        json_file.close()

# save the mturk result json file in a csv format
# answer list should be the order of the answers in the csv file
def save_to_csv( json_file, answer_list ):
    with open( json_file ) as data_file:  
        data = json.load(data_file)
        with open("result.csv",'w') as csv_results:
            # answer list is the header of the csv
            writer = csv.DictWriter(csv_results, answer_list)
            writer.writeheader()
            # loop over each result in the json file
            for d in data:
                # iterate through each key-answer for that result
                for k in d.keys():
                    # if they key isn't in the result list del it from the dict
                    # this needs to be done so that the data passed into writerow does
                    # not have any keys that are not in answer_list
                    if k not in result_list: 
                        del d[k]
                writer.writerow(d)

parse('game-5.results', 'game-5-results.json')