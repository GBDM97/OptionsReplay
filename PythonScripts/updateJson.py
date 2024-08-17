import json
from pathlib import Path
import b3Reader
import time
import reverseOptionCodes

#TODO FILTER FOR TRENDING ASSETS, I THINK IT CAN BE AT THE FRONTEND

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
    dates_data_dicts = [{i:b3Reader.getBasicData(i)} for i in missing_dates_arr]
    return dates_data_dicts

def updateJsonOrderly(obj):
    def cleanObj(o):
        del o['data']['start']
        del o['data']['end']
        return o
        
    obj = cleanObj(obj)
    with open('ReactApp//optionsreplay//src//data//data.json') as file:
        current_json_data:list = json.loads(file.read()) 
    if len(current_json_data) != 0:
        for i,v in enumerate(current_json_data):
            if time.strptime(obj['dates']['start'],"%d%m%Y") > time.strptime(v['dates']['start'],"%d%m%Y"):
                current_json_data.insert(i,obj)
                break
            if (time.strptime(obj['dates']['start'],"%d%m%Y") < time.strptime(v['dates']['start'],"%d%m%Y") 
            and len(current_json_data) == i+1):
                current_json_data.insert(i+1,obj)
                break
    with open('ReactApp//optionsreplay//src//data//data.json','w') as fileHandle:
        json.dump(current_json_data or [obj], fileHandle, indent=2)

def buildPeriodObj(start_data:dict,end_data:dict):
    start_date = list(start_data.keys())[0]
    end_date = list(end_data.keys())[0]
    period = start_date+" - "+end_date
    metadata = input("Enter metadata for period "+period+":\n")
    trending_assets = {}
    while True:
        trending_asset = input("Enter trending asset for period "+period+":\n")
        trending_assets[trending_asset] = input(
            "Enter trending asset direction for period "+period+":\n")
        if input("Press 'a' to add another one or any other key to continue: ") != "a":
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

def applyAdditonalDataToObj(basic_period_obj):
    basic_period_obj['data']['compiledInfo'] = []
    basic_period_obj['data']['compiledInfo'] = dict()
    basic_period_obj['data']['trendingData'] = dict()

    def filterTrendingAssets(obj):
        for trending_asset in obj['trendingAssets']:
            for asset in obj['data']['compiledInfo']:
                if asset[0:4] == trending_asset[0:4].upper():
                    obj['data']['trendingData'][asset] = obj['data']['compiledInfo'][asset]
        return obj

    def findReverseAsset(input_asset, info_of_input_asset):
        asset_series_to_find = input_asset[:4] + reverseOptionCodes.get(input_asset[4]) + input_asset[-2:]
        least_difference_between_assets = 1000
        output_asset = ""
        for searched_asset, entry_info_of_searched_asset in basic_period_obj['data']['start'].items():
            if output_asset and searched_asset[0:4] != input_asset[0:4]:
                break
            difference_between_searched_and_input = abs(float(entry_info_of_searched_asset[1]) - float(info_of_input_asset[1]))
            if (asset_series_to_find[0:-2] in searched_asset and asset_series_to_find[-2:] in searched_asset and 
            difference_between_searched_and_input < least_difference_between_assets):
                least_difference_between_assets = difference_between_searched_and_input
                output_asset = searched_asset
                open_price_of_output_asset = entry_info_of_searched_asset[1]
        max_price_of_output_asset = basic_period_obj['data']['end'][output_asset][2] if output_asset in basic_period_obj['data']['end'] else 0.01
        if output_asset:
            return { output_asset: {'entry':float(open_price_of_output_asset), 'exit':max_price_of_output_asset}}
        else:
            return {}

    for asset, entry_asset_info in basic_period_obj['data']['start'].items():
        exit_asset_min = basic_period_obj['data']['end'][asset][3] if asset in basic_period_obj['data']['end'] else 0.01 
        strike = entry_asset_info[0]
        entry_asset_open = entry_asset_info[1]
        operation_result = float(entry_asset_info[1])-float(exit_asset_min)
        reverse_asset_info = findReverseAsset(asset,entry_asset_info)
        reverse_asset_name = ""
        reverse_asset_entry = ""
        reverse_asset_exit = ""
        reverse_operation_result = ""
        if reverse_asset_info:
            reverse_asset_name = list(reverse_asset_info.keys())[0]
            reverse_asset_entry = float(list(reverse_asset_info.values())[0]['entry'])
            reverse_asset_exit = float(list(reverse_asset_info.values())[0]['exit'])
            reverse_operation_result = reverse_asset_entry - reverse_asset_exit
        basic_period_obj['data']['compiledInfo'][asset] = [ strike,
                                                                entry_asset_open,
                                                                exit_asset_min,
                                                                operation_result,
                                                                reverse_asset_name, 
                                                                reverse_asset_entry, 
                                                                reverse_asset_exit,
                                                                reverse_operation_result]
    return filterTrendingAssets(basic_period_obj)

def run():
    missing_data = getMissingData()
    for i,v in enumerate(missing_data):
        basic_period_obj = {}
        if i % 2 == 0:
            basic_period_obj = buildPeriodObj(missing_data[i+1].copy(),v.copy())
            complete_obj = applyAdditonalDataToObj(basic_period_obj)
            updateJsonOrderly(complete_obj)
        else:
            continue

run()