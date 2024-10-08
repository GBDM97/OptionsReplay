from datetime import datetime, timedelta
import json
from pathlib import Path
import b3Reader
import time
import optionUtils
import pandas as pd
import numpy as np

#TODO FILTER FOR TRENDING ASSETS, I THINK IT CAN BE AT THE FRONTEND

folder_files_names = [file.name.replace('.TXT','').replace("COTAHIST_D","") for file in Path('PythonScripts//data').iterdir()]

ordered_dates_arr = sorted([time.strptime(i,"%d%m%Y") for i in folder_files_names],reverse=True)
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

def verifySheet(start_data:dict,end_data:dict):
    def getSheetTrendingAssets(index):
        trending_assets_dict = dict()
        column_names_list = df.columns.tolist()
        line_arr = df.iloc[index].values[1:]
        for i,v in enumerate(line_arr):
            if i == 16:
                break
            if isinstance(v, str):
                trending_assets_dict[column_names_list[i+1][:4]] = v
        return trending_assets_dict

    start_date = list(start_data.keys())[0]
    end_date = list(end_data.keys())[0]
    target_period = datetime.strptime(start_date,"%d%m%Y") - timedelta(days=1)
    df = pd.read_excel('PythonScripts\\xlsx\\TrendingAssetsData.xlsx')
    def toDatetime(date):
        return pd.Timestamp(date).to_pydatetime()
    sundays_array = [toDatetime(i) for i in df['SUNDAYS'].values]
    if not target_period in sundays_array:
        return
    
    period_index = sundays_array.index(target_period)
    return {
        "dates":{
            "start":start_date,
            "end":end_date
        },
        "data":{
            "start":start_data.popitem()[1],
            "end":end_data.popitem()[1]
        },
        "codes": {
            "call":df['CALL'][period_index], 
            "put":df['PUT'][period_index], 
            "week":df['WEEK'][period_index]
        },
        "trendingAssets":getSheetTrendingAssets(period_index)
    }


def buildPeriodObj(start_data:dict,end_data:dict):
    start_date = list(start_data.keys())[0]
    end_date = list(end_data.keys())[0]
    period = start_date+" - "+end_date
    sheet_data = verifySheet(start_data,end_data)
    if sheet_data:
        return sheet_data
    callCode = input("Enter call code for period "+period+":\n").upper()
    putCode = input("Enter put code for period "+period+":\n").upper()
    weekCode = input("Enter week code for period "+period+":\n").upper()
    trending_assets = {}
    while True:
        trending_asset = input("Enter trending asset for period "+period+":\n").upper()[0:4]
        trending_assets[trending_asset] = input(
            "Direction of "+trending_asset+":\n").upper()
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
        "codes": {
            "call":callCode, 
            "put":putCode, 
            "week":weekCode
        },
        "trendingAssets":trending_assets
    }

def applyAdditonalDataToObj(basic_period_obj):
    basic_period_obj['data']['compiledInfo'] = dict()
    basic_period_obj['data']['trendingData'] = []

    def getTrendDirection(asset):
        return basic_period_obj['trendingAssets'][asset]
    
    def filterTrendingAssets(obj):
        trending_data = obj['data']['trendingData']
        period = obj['dates']['start']+" - "+obj['dates']['end']
        codes = obj['codes']
        for trending_asset in obj['trendingAssets']:
            for asset in obj['data']['compiledInfo']:
                if (asset[0:4] == trending_asset[0:4] and (asset[-2:] == codes['week'] or (codes['week'] == 'W3' 
                and asset[-2] != 'W')) and (asset[4:5] == codes['call'] or asset[4:5] == codes['put'])):
                    new_asset_list = [period, asset]
                    new_asset_list.extend(obj['data']['compiledInfo'][asset])
                    new_asset_list.append(getTrendDirection(asset[0:4]))
                    trending_data.append(new_asset_list)
        return obj

    def findReverseAsset(input_asset, info_of_input_asset):
        if (input_asset[4] != basic_period_obj['codes']['call'] and 
            input_asset[4] != basic_period_obj['codes']['put']):
            return {}
        asset_series_to_find = (input_asset[:4] + optionUtils.getReverseCode(input_asset[4]) + 
                                input_asset[-2:] if len(input_asset) > 8 else input_asset[0:4] + 
                                optionUtils.getReverseCode(input_asset[4]))
        least_difference_between_assets = 1000
        output_asset = ""
        for searched_asset, entry_info_of_searched_asset in basic_period_obj['data']['start'].items():
            if least_difference_between_assets == 0:
                break
            difference_between_searched_and_input = abs(float(entry_info_of_searched_asset[1]) - float(info_of_input_asset[1]))
            if input_asset == 'MGLUQ180W1':
                print
            if ((len(asset_series_to_find) > 5 and asset_series_to_find[0:-2] in searched_asset 
                 and asset_series_to_find[-2:] in searched_asset and difference_between_searched_and_input < 
                 least_difference_between_assets)
                 or 
                (len(asset_series_to_find) < 6 and asset_series_to_find in searched_asset and 
                 searched_asset[-2] != 'W' and difference_between_searched_and_input < 
                 least_difference_between_assets)):
                
                least_difference_between_assets = difference_between_searched_and_input
                output_asset = searched_asset
                open_price_of_output_asset = entry_info_of_searched_asset[1]
        max_price_of_output_asset = basic_period_obj['data']['end'][output_asset][2] if output_asset in basic_period_obj['data']['end'] else 0.01
        if output_asset:
            return { output_asset: {'entry':float(open_price_of_output_asset), 'exit':max_price_of_output_asset}}
        else:
            return {}
        
    def underlyingInfo(a):
        search_for_asset = ''
        weekly_assets = ['ABEV3','B3SA3','BBAS3','BBDC4','BBSE3','BOVA11','GGBR4','HAPV3','ITUB4','MGLU3','NTCO3','PETR4','PRIO3','SMAL11','SUZB3','VALE3']
        for i in weekly_assets:
            if a[0:4] in i:
                search_for_asset = i
                break
        if search_for_asset == '':
            return ['','']
        return basic_period_obj['data']['start'][search_for_asset] 

   
    for asset, entry_asset_info in basic_period_obj['data']['start'].items():
        exit_asset_min = basic_period_obj['data']['end'][asset][3] if asset in basic_period_obj['data']['end'] else '0.01' 
        underlying_asset_price = str(underlyingInfo(asset)[1])
        strike = entry_asset_info[0]
        percentage_strike_per_price = ''
        if underlying_asset_price:
            percentage_strike_per_price = str(float(strike) / float(underlying_asset_price))
        entry_asset_open = entry_asset_info[1]
        operation_result = str(float(entry_asset_info[1])-float(exit_asset_min))
        reverse_asset_info = findReverseAsset(asset,entry_asset_info)
        reverse_asset_name = ""
        reverse_asset_entry = ""
        reverse_asset_exit = ""
        reverse_operation_result = ""
        if reverse_asset_info:
            reverse_asset_name = list(reverse_asset_info.keys())[0]
            reverse_asset_entry = str(float(list(reverse_asset_info.values())[0]['entry']))
            reverse_asset_exit = str(float(list(reverse_asset_info.values())[0]['exit']))
            reverse_operation_result = str(float(reverse_asset_entry) - float(reverse_asset_exit))
        basic_period_obj['data']['compiledInfo'][asset] = [underlying_asset_price,
                                                            strike,
                                                            percentage_strike_per_price,
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
        print(i)
        basic_period_obj = {}
        if i % 2 == 0:
            basic_period_obj = buildPeriodObj(missing_data[i+1].copy(),v.copy())
            complete_obj = applyAdditonalDataToObj(basic_period_obj)
            updateJsonOrderly(complete_obj)
        else:
            continue

run()