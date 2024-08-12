import json
from pathlib import Path
import b3Reader
import time

folder_files_names = [file.name.replace('.TXT','') for file in Path('PythonScripts//data').iterdir()]

ordered_dates_arr = sorted([time.strptime(i[1:],"%d%m%Y") for i in folder_files_names],reverse=True)
arr_dates_to_string = [time.strftime("%d%m%Y",i) for i in ordered_dates_arr]
data_folder_dates = arr_dates_to_string

current_json_dates = [] #TODO

def getMissingData():
    missing_dates_arr = list(set(data_folder_dates) - set(current_json_dates))
    dates_data_dicts = [{i:b3Reader.getDataOfDate(i)} for i in missing_dates_arr]
    return dates_data_dicts

def updateJsonOrderly(obj):
    current_json_data = []
    if len(current_json_data) != 0:
        print #TODO
    else:
        with open('ReactApp//optionsreplay//src//data//data.json','w') as fileHandle:
            json.dump(obj, fileHandle, indent=2)


def buildPeriodOperationObj(start_data,end_data):
    start_date = start_data.keys()[0]
    end_date = end_data.keys()[0]
    period = start_date+" - "+end_date
    metadata = input("Enter metadata for period "+period)
    trending_assets = {}
    while True:
        trending_assets
        [input("Enter trending asset for period "+period)] = input
        ("Enter trending asset direction for period "+period)
        if input("Press 's' to add another one or any other key to continue: ") != "s":
            break
    return {
        "dates":{
            "start":start_date,
            "end":end_date
        },
        "data":{
            "start":start_data,
            "end":end_data
        },
        "metaData":metadata,
        "trendingAssets":trending_assets
    }

missing_data = getMissingData()
for i,v in enumerate(missing_data):
    if i % 2 != 0:
        period_operation_obj = buildPeriodOperationObj(v,missing_data[i+1])
        updateJsonOrderly(period_operation_obj)
    else:
        continue