import json
from pathlib import Path
import b3Reader
import time

folder_files_names = [file.name.replace('.TXT','') for file in Path('PythonScripts//data').iterdir()]

ordered_dates_arr = sorted([time.strptime(i[1:],"%d%m%Y") for i in folder_files_names],reverse=True)
arr_dates_to_string = [time.strftime("%d%m%Y",i) for i in ordered_dates_arr]
data_folder_dates = arr_dates_to_string

current_json_dates = []
with open('ReactApp//optionsreplay//src//data//data.json') as file:
    file_json_output = json.loads(file.read())
    if file_json_output:
        for i in file_json_output:
            current_json_dates.append(i["dates"]["start"])
            current_json_dates.append(i["dates"]["end"])
        
def getMissingData():
    missing_dates_arr = [item for item in data_folder_dates if item not in current_json_dates]
    dates_data_dicts = [{i:b3Reader.getDataOfDate(i)} for i in missing_dates_arr]
    return dates_data_dicts

def updateJsonOrderly(obj):
    with open('ReactApp//optionsreplay//src//data//data.json') as file:
        current_json_data:list = json.loads(file.read()) 
    if len(current_json_data) != 0:
        for i,v in enumerate(current_json_data):
            if time.strptime(obj['dates']['start'],"%d%m%Y") > time.strptime(v['dates']['start'],"%d%m%Y"):
                current_json_data.insert(i,obj)
            if (time.strptime(obj['dates']['start'],"%d%m%Y") < time.strptime(v['dates']['start'],"%d%m%Y") 
            and len(current_json_data) == i+1):
                current_json_data.insert(i+1,obj)
                break
    with open('ReactApp//optionsreplay//src//data//data.json','w') as fileHandle:
        json.dump(current_json_data or [obj], fileHandle, indent=2)

def buildPeriodOperationObj(start_data:dict,end_data:dict):
    start_date = list(start_data.keys())[0]
    end_date = list(end_data.keys())[0]
    period = start_date+" - "+end_date
    metadata = input("Enter metadata for period "+period+":\n")
    trending_assets = {}
    while True:
        trending_asset = input("Enter trending asset for period "+period+":\n")
        trending_assets[trending_asset] = input(
            "Enter trending asset direction for period "+period+":\n")
        if input("Press 'a' to add another one or any other key to continue: ") != "s":
            break
    return {
        "dates":{
            "start":start_date,
            "end":end_date
        },
        "data":{
            "start":start_data.popitem()[1],
            "end":end_data.popitem()[1]
        },
        "metaData":metadata,
        "trendingAssets":trending_assets
    }

missing_data = getMissingData()
for i,v in enumerate(missing_data):
    if i % 2 == 0:
        period_operation_obj = buildPeriodOperationObj(missing_data[i+1],v)
        updateJsonOrderly(period_operation_obj)
    else:
        continue