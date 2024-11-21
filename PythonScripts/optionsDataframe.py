import time
import optionUtils
from pathlib import Path
import b3Reader
import pandas as pd
import chart

def get(input_asset, month, side): #generates dataframe for graph according to specific input information of: asset, month, and side
    analysis_span = optionUtils.getDfAnalysisDateSpan(month)
    current_option_codes = optionUtils.monthToOptionCodes(month)
    series = current_option_codes[0] if side == 'CALL' else current_option_codes[1]
    rawData = getDataOfSpan(analysis_span, input_asset, series)
    columns = getAllPeriodOptionCodes(rawData)
    rows = [f"{ii} - {i}" for ii in rawData.keys() for i in ['O','H','L','C']]
    data = []
    for i in rawData.values():
        for ii in range(0,4):
            inner_arr = []
            for iii in columns:
                current_asset = iii
                try:
                    asset_price = i[current_asset][ii+1]
                except KeyError:
                    asset_price = 0
                inner_arr.append(float(asset_price))
            data.append(inner_arr)
    chart.create(pd.DataFrame(data, columns=columns, index=rows))
    # toExcel.write(data, rows, columns)


def getDataOfSpan(span, input_asset, series):
    prev_month = span[0][2:4]
    curr_month = span[1][2:4]
    span = [time.strptime(span[0],"%d%m%Y"),time.strptime(span[1],"%d%m%Y")]
    file_names_arr = [file.name.replace('.TXT','').replace("COTAHIST_D","") 
                    for file in Path('PythonScripts//data//'+prev_month).iterdir()]
    files_names_arr_2 = [file.name.replace('.TXT','').replace("COTAHIST_D","") 
                    for file in Path('PythonScripts//data//'+curr_month).iterdir()]
    file_names_arr.extend(files_names_arr_2)
    ordered_dates_arr = sorted([time.strptime(i,"%d%m%Y") for i in file_names_arr])
    span_file_names = [time.strftime("%d%m%Y",i) for i in ordered_dates_arr if i >= span[0] and i < span[1]]
    return { i:b3Reader.getRawData(i, input_asset, series) for i in span_file_names }

def getAllPeriodOptionCodes(data:dict):
    output_array = []
    for i in data.values():
        output_array.extend(i.keys())
    return list(set(output_array))

get('ABEV3',11,'CALL')