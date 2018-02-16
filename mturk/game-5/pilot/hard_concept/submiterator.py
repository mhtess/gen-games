#!/usr/bin/env python

import csv, codecs, cStringIO
import os, json, re, argparse

import sys
csv.field_size_limit(sys.maxsize)

encoding = "utf-8"

import csv, codecs, cStringIO

class UTF8Recoder:
    """
    Iterator that reads an encoded stream and reencodes the input to UTF-8
    """
    def __init__(self, f, encoding):
        self.reader = codecs.getreader(encoding)(f)

    def __iter__(self):
        return self

    def next(self):
        return self.reader.next().encode("utf-8")

class UnicodeReader:
    """
    A CSV reader which will iterate over lines in the CSV file "f",
    which is encoded in the given encoding.
    """

    def __init__(self, f, dialect=csv.excel, encoding="utf-8", **kwds):
        f = UTF8Recoder(f, encoding)
        self.reader = csv.reader(f, dialect=dialect, **kwds)

    def next(self):
        row = self.reader.next()
        return [unicode(s, "utf-8") for s in row]

    def __iter__(self):
        return self

class UnicodeWriter:
    """
    A CSV writer which will write rows to CSV file "f",
    which is encoded in the given encoding.
    """

    def __init__(self, f, dialect=csv.excel, encoding="utf-8", **kwds):
        # Redirect output to a queue
        self.queue = cStringIO.StringIO()
        self.writer = csv.writer(self.queue, dialect=dialect, **kwds)
        self.stream = f
        self.encoder = codecs.getincrementalencoder(encoding)()

    def writerow(self, row):
        self.writer.writerow([s.encode("utf-8") for s in row])
        # Fetch UTF-8 output from the queue ...
        data = self.queue.getvalue()
        data = data.decode("utf-8")
        # ... and reencode it into the target encoding
        data = self.encoder.encode(data)
        # write to the target stream
        self.stream.write(data)
        # empty queue
        self.queue.truncate(0)

    def writerows(self, rows):
        for row in rows:
            self.writerow(row)

def submiterator_stringify(something):
  if type(something) is str:
    return something.encode('utf-8')
  else:
    return json.dumps(something).encode("utf-8")

def write_csv(data, filename, delimiter=','):
    fieldnames = data[0].keys()
    csvfile = open(filename, 'wb')
    csvwriter = csv.DictWriter(csvfile, fieldnames=fieldnames, delimiter=delimiter)
    csvwriter.writeheader()
    csvwriter.writerows(data)
    csvfile.close()

def main():
    parser = argparse.ArgumentParser(description='Interface with MTurk.')
    parser.add_argument("subcommand", choices=['posthit', 'getresults', 'reformat',
        "preparefiles", "anonymize"],
        type=str, action="store",
        help="choose a specific subcommand.")
    parser.add_argument("nameofexperimentfiles", metavar="label", type=str, nargs="+",
        help="you must have at least one label that corresponds to the " +
        "experiment you want to work with. each experiment has a unique label. " +
        "this will be the beginning of the name of the config file (everything " +
        "before the dot). [label].config.")

    args = parser.parse_args()
    # print args.accumulate(args.integers)

    subcommand = vars(args)["subcommand"]
    labels = vars(args)["nameofexperimentfiles"]

    for label in labels:
        if subcommand == "posthit":
            prepare(label)
            posthit(label)
        elif subcommand == "getresults":
            getresults(label)
            anonymize(label + ".results")
            make_invoice(label)
        elif subcommand == "reformat":
            try:
                try:
                    reformat(label + ".results")
                    make_invoice(label)
                except IOError:
                    reformat(label + "_anonymized.results")
            except IOError:
                print ("\nWARNING: cannot find file `" + label +
                ".results` or its anonymized version `" + label +
                "_anonymized.results`.\nSKIPPING!\n")
        elif subcommand == "preparefiles":
            prepare(label)
        elif subcommand == "anonymize":
            anonymize(label + ".results")

def prepare(nameofexperimentfiles, output_dir=""):

    config_file = nameofexperimentfiles + ".config"

    settings = open(config_file, 'r')
    json_string = settings.read()
    settings.close()
    dict = json.loads(re.sub("\n", "", json_string))

    locationofCLT = os.environ['MTURK_CMD_HOME']
    # dict={}
    # for line in lines:
    #     if not (line == "\n" or line == ""):
    #         while (line[0] == "\n" or line[0] == "\t" or line[0] == " "):
    #             line = line[1:]
    #         if not (line[0:3] == "###"):
    #             x=line.split("::")
    #             key = x[0]
    #             possvalues = x[1].split("###")
    #             value = possvalues[0]
    #             while (key[0] == "\n" or key[0] == "\t" or key[0] == " "):
    #                 key = key[1:]
    #             while (key[-1] == "\n" or key[-1] == "\t" or key[-1] == " "):
    #                 key = key[:-1]
    #             while (value[0] == "\n" or value[0] == "\t" or value[0] == " "):
    #                 value = value[1:]
    #             while (value[-1] == "\n" or value[-1] == "\t" or value[-1] == " "):
    #                 value = value[:-1]
    #             dict[x[0]] = value

    if not os.path.exists(locationofCLT) or locationofCLT == '/':
        raise Exception("Error: please set your 'MTURK_CMD_HOME' environment variable to your AWS directory.")

    if dict["rewriteProperties"] == "yes":
        old_properties_file = open(locationofCLT + "/bin/mturk.properties", 'r').readlines()
        backup = open(locationofCLT + "/bin/mturk.properties.backup", 'w')
        for line in old_properties_file:
            backup.write(line + '\n')
        backup.close()
        new_properties_file = open(locationofCLT + "/bin/mturk.properties", 'w')
        if (dict["liveHIT"] == "yes"):
            for line in old_properties_file:
                if "://mechanicalturk.sandbox.amazonaws.com/?Service=AWSMechanicalTurkRequester" in line:
                    new_properties_file.write("# service_url=https://mechanicalturk.sandbox.amazonaws.com/?Service=AWSMechanicalTurkRequester\n")
                elif "://mechanicalturk.amazonaws.com/?Service=AWSMechanicalTurkRequester" in line:
                     new_properties_file.write("service_url=https://mechanicalturk.amazonaws.com/?Service=AWSMechanicalTurkRequester\n")
                else:
                    new_properties_file.write(line)
        else:
            for line in old_properties_file:
                if "://mechanicalturk.sandbox.amazonaws.com/?Service=AWSMechanicalTurkRequester" in line:
                    new_properties_file.write("service_url=https://mechanicalturk.sandbox.amazonaws.com/?Service=AWSMechanicalTurkRequester\n")
                elif "://mechanicalturk.amazonaws.com/?Service=AWSMechanicalTurkRequester" in line:
                    new_properties_file.write("# service_url=https://mechanicalturk.amazonaws.com/?Service=AWSMechanicalTurkRequester\n")
                else:
                    new_properties_file.write(line)
        new_properties_file.close()
        print "Old mturk.properties file backed up at " + locationofCLT + "/bin/mturk.properties.backup" 

    # write the .question file, which tells MTurk where to find your external HIT.
    question = open(output_dir + nameofexperimentfiles + ".question", 'w')
    question.write("<?xml version='1.0'?><ExternalQuestion xmlns='http://mechanicalturk.amazonaws.com/AWSMechanicalTurkDataSchemas/2006-07-14/ExternalQuestion.xsd'><ExternalURL>" + dict["experimentURL"] + "</ExternalURL><FrameHeight>"+ dict["frameheight"] +"</FrameHeight></ExternalQuestion>")
    question.close()

    #write the .properties file.
    properties = open(output_dir + nameofexperimentfiles + ".properties", 'w')
    properties.write("title: " + dict["title"] + "\ndescription: " + dict["description"] + "\nkeywords: " + dict["keywords"] + "\nreward: " + dict["reward"] + "\nassignments: " + dict["numberofassignments"] + "\nannotation: ${condition}\nassignmentduration:" + dict["assignmentduration"] + "\nhitlifetime:" + dict["hitlifetime"] + "\nautoapprovaldelay:" + dict["autoapprovaldelay"])
    if (dict["USonly?"] == "y" or dict["USonly?"] == "Y" or dict["USonly?"] == "yes" or dict["USonly?"] == "Yes" or dict["USonly?"] == "true" or dict["USonly?"] == "True" or dict["USonly?"] == "T" or dict["USonly?"] == "1"):
        properties.write("\nqualification.1:00000000000000000071\nqualification.comparator.1:EqualTo\nqualification.locale.1:US\nqualification.private.1:false")
    if (dict["minPercentPreviousHITsApproved"] != "none"):
        properties.write("\nqualification.2:000000000000000000L0\nqualification.comparator.2:GreaterThanOrEqualTo\nqualification.value.2:" + dict["minPercentPreviousHITsApproved"] + "\nqualification.private.2:false")
    properties.close()

    #write the .input file. "conditions::" in the file experiment-settings.txt can be followed by any number of condition names, separated by a comma.
    input = open(output_dir + nameofexperimentfiles + ".input", 'w')
    input.write("condition\n")
    num = 1
    conditions = dict["conditions"]
    conditionlist = conditions.split(",")
    for x in conditionlist:
        input.write(submiterator_stringify(num) + " " + x + " \n")
        num = num + 1
    input.close()

def posthit(label):
    os.system(
        """
        HERE=`pwd`
        cd $MTURK_CMD_HOME/bin

        NAME_OF_EXPERIMENT_FILES=""" + label + """
        label=$HERE/$NAME_OF_EXPERIMENT_FILES
        ./loadHITs.sh -label $label -input $label.input -question $label.question -properties $label.properties -maxhits 1
        """
        )

def getresults(label):
    os.system("""
        HERE=`pwd`
        cd $MTURK_CMD_HOME/bin

        NAME_OF_EXPERIMENT_FILES=""" + label + """
        label=$HERE/$NAME_OF_EXPERIMENT_FILES
        ./getResults.sh -successfile $label.success -outputfile $label.results
        """)

def anonymize(original_data_filename):
    workers = {}
    def symb(workerid):
        if workerid in workers:
            return workers[workerid]
        else:
            id_number = str(len(workers)).decode('utf-8')
            workers[workerid] = id_number
            return id_number

    new_data_filename = original_data_filename.split(".results")[0] + "_anonymized.results"
    new_rows = []

    csvfile = open(original_data_filename, 'rb')
    csvreader = csv.DictReader(csvfile, delimiter='\t')
    for row in csvreader:
        trialdata = json.loads(row['Answer.trials'])
        trialstring = json.dumps(trialdata)
        row['Answer.trials'] = trialstring
        workerid = row['workerid']
        row['workerid'] = symb(workerid)
        new_rows.append(row)
    csvfile.close()

    write_csv(new_rows, new_data_filename, delimiter='\t')

    print workers

def make_invoice(output_file_label):

  mturk_data_file = output_file_label + ".results"

  def clean_text(text):
    return text

  def write_2_by_2(data, filename):
    with open(filename, 'wb') as csvfile:
      w = UnicodeWriter(csvfile)
      w.writerows(data)
      # w = open(filename, "w")
      # w.write("\n".join(map(lambda x: sep.join(x), data)))
      # w.close()

  workerids_for_invoice = []
  dates_for_invoice = []
  prices_for_invoice = []

  with open(mturk_data_file, 'rb') as csvfile:
    header_labels = []
    header = True
    mturk_reader = UnicodeReader(csvfile, delimiter='\t', quotechar='"', encoding="utf-8")
    for row in mturk_reader:
      if header:
        header = False
        header_labels = row
      else:
        for i in range(len(row)):
          elem = re.sub("'", "&quotechar", row[i])
          label = header_labels[i]
          if label == "workerid":
            workerids_for_invoice.append(elem)
          elif label == "reward":
            prices_for_invoice.append(float(elem[1:]))
          elif label == "assignmentsubmittime":
            dates_for_invoice.append(elem)

  rows = [["date", "workerid", "amount"]]
  for i in range(len(workerids_for_invoice)):
    rows.append([dates_for_invoice[i], workerids_for_invoice[i], submiterator_stringify(prices_for_invoice[i])])
  rows.append(["", "total paid to workers:", "=SUM(c2:c" + submiterator_stringify(len(workerids_for_invoice) + 1) + ")"])
  rows.append(["", "40% paid to Amazon:", "=.4*c" + submiterator_stringify(len(workerids_for_invoice) + 2)])
  rows.append(["", "total:", "=SUM(c" + submiterator_stringify(len(workerids_for_invoice) + 2) + ":c" + submiterator_stringify(len(workerids_for_invoice) + 3)])
  write_2_by_2(rows, output_file_label + "_invoice.csv")

def reformat(mturk_data_file, workers={}):

  mturk_tag = mturk_data_file[:-8]
  output_data_file_label = mturk_tag


  def clean_text(text):
    return text

  def write_2_by_2(data, filename):
    with open(filename, 'wb') as csvfile:
      w = UnicodeWriter(csvfile)
      w.writerows(data)
      # w = open(filename, "w")
      # w.write("\n".join(map(lambda x: sep.join(x), data)))
      # w.close()

  # workers = json.loads(re.sub("'", '"', re.sub(" u'", " '", sys.argv[2])))

  def symb(workerid):
    if workerid in workers:
      return workers[workerid]
    else:
      id_number = submiterator_stringify(len(workers))
      workers[workerid] = id_number
      return id_number

  def get_column_labels(data_type):
    new_column_labels_from_json = set()
    with open(mturk_data_file, 'rb') as csvfile:
      header_labels = []
      header = True
      mturk_reader = UnicodeReader(csvfile, delimiter='\t', quotechar='"', encoding=encoding)
      for row in mturk_reader:
        if header:
          header = False
          header_labels = row
          if data_type == "mturk":
            return [x for x in header_labels if (not x in ["Answer.trials", "Answer.subject_information", "Answer.check_trials", "Answer.system"])]
        else:
          for i in range(len(row)):
            elem = re.sub("'", "", row[i])
            label = header_labels[i]
            if label == "Answer." + data_type:
              if label == "Answer.trials" or label == "Answer.catch_trials":
                this_is_hacky = "{\"this_is_hacky\":" + elem + "}"
                trials = json.loads(this_is_hacky)["this_is_hacky"]
                for trial in trials:
                  new_column_labels_from_json.update(trial.keys())
              elif label == "Answer.subject_information":
                data = json.loads(elem)
                new_column_labels_from_json.update(data.keys())
              elif label == "Answer.system":
                data = json.loads(elem)
                new_column_labels_from_json.update(data.keys())
    return list(new_column_labels_from_json)

  def make_tsv(data_type):
    new_column_labels = get_column_labels(data_type)
    mturk_output_column_names = []
    output_rows = [["workerid"] + new_column_labels]
    with open(mturk_data_file, 'rb') as csvfile:
      header_labels = []
      header = True
      mturk_reader = UnicodeReader(csvfile, delimiter='\t', quotechar='"', encoding="utf-8")
      for row in mturk_reader:
        if header:
          header = False
          header_labels = row
          mturk_output_column_names = [x for x in header_labels if (not x in ["Answer.trials", "Answer.subject_information", "Answer.check_trials", "Answer.system"])]
          #output_rows.append(output_column_names)
        else:
          subject_level_data = {}
          trial_level_data = {}
          for key in new_column_labels:
            trial_level_data[key] = []
          for i in range(len(row)):
            elem = re.sub("'", "&quotechar", row[i])
            label = header_labels[i]
            if label == "Answer." + data_type:
              if label == "Answer.trials" or label == "Answer.catch_trials":
                this_is_hacky = "{\"this_is_hacky\":" + elem + "}"
                trials = json.loads(this_is_hacky)["this_is_hacky"]
                for trial in trials:
                  for key in new_column_labels:
                    if key in trial.keys():
                      trial_level_data[key].append(submiterator_stringify(trial[key]))
                    else:
                      trial_level_data[key].append("NA")
              else:
                if label == "Answer.subject_information":
                  data = json.loads(elem)
                elif label == "Answer.system":
                  data = json.loads(elem)
                for key in new_column_labels:
                  if key in data.keys():
                    subject_level_data[key] = submiterator_stringify(data[key])
                  else:
                    subject_level_data[key] = "NA"
            elif label == "workerid":
              # if data_type == "subject_information":
              #   workerids_for_invoice.append(elem)
              elem = symb(elem)
              subject_level_data["workerid"] = elem
            else:
              # if label == "reward":
              #   if data_type == "subject_information":
              #     prices_for_invoice.append(float(elem[1:]))
              # elif label == "assignmentsubmittime":
              #   if data_type == "subject_information":
              #     dates_for_invoice.append(elem)
              subject_level_data[label] = submiterator_stringify(elem)
          if len(trial_level_data.keys()) > 0:
            ntrials = len(trial_level_data[trial_level_data.keys()[0]])
          else:
            ntrials = 0
          if ntrials > 0:
            #print ntrials
            for i in range(ntrials):
              output_row = []
              # for key in mturk_output_column_names:
              #   output_row.append(subject_level_data[key])
              output_row.append(subject_level_data["workerid"])
              for key in new_column_labels:
                output_row.append(trial_level_data[key][i])
              output_rows.append(output_row)
          else:
            output_row = []
            # for key in mturk_output_column_names:
            #   output_row.append(subject_level_data[key])
            output_row.append(subject_level_data["workerid"])
            #print data_type
            for key in new_column_labels:
              output_row.append(subject_level_data[key])
            output_rows.append(output_row)
    
    write_2_by_2(output_rows, output_data_file_label + "-" + data_type + ".csv")
    return [[clean_text(elem) for elem in row] for row in output_rows]


  # trial_columns = get_column_labels("trial")
  # check_trial_columns = get_column_labels("check_trial")
  # subject_information_columns = get_column_labels("subject_information")
  # system_columns = get_column_labels("system")

  def make_full_tsv():
    trials = make_tsv("trials")
    catch_trials = make_tsv("catch_trials")
    subject_information = make_tsv("subject_information")
    system = make_tsv("system")
    mturk = make_tsv("mturk")
    big_rows = [
      trials[0] + subject_information[0][1:] + system[0][1:] + mturk[0][1:]
    ]
    workerids = [row[0] for row in mturk][1:]
    for workerid in workerids:
      small_trials = [row for row in trials if row[0] == workerid] #has workerid
      small_catch_trials = [row for row in catch_trials if row[0] == workerid] #has workerid
      small_subject_information = [row[1:] for row in subject_information if row[0] == workerid][0]
      small_system = [row[1:] for row in system if row[0] == workerid][0]
      small_mturk = [row[1:] for row in mturk if row[0] == workerid][0]
      ntrials = len(small_trials)
      if ntrials > 0:
        for trial in small_trials:
          big_row = trial + small_subject_information + small_system + small_mturk
          big_rows.append(big_row)
    write_2_by_2(big_rows, output_data_file_label + ".csv")

  make_full_tsv()

  print workers

# submiterator --preparefiles label [label ...]

# submiterator --posthit label [label ...]

# # submiterator --sandbox
# # submiterator --livehit

# submiterator --getresults label [label ...]

# submiterator --reformat file [file ...] output_dir

main()
