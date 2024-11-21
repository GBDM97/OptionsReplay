import time
import optionUtils
from pathlib import Path
import b3Reader

def get(input_asset, month, side): #generates dataframe for graph according to specific input information of: asset, month, and side
    analysis_span = optionUtils.getDfAnalysisDateSpan(month)
    current_option_codes = optionUtils.monthToOptionCodes(month)
    series = current_option_codes[0] if side == 'CALL' else current_option_codes[1]
    rawData = getDataOfSpan(analysis_span, input_asset, series)

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
    span_file_names = [time.strftime("%d%m%Y",i) for i in enumerate(ordered_dates_arr) if i >= span[0] and i < span[1]]
    return { i:b3Reader.getRawData(i, input_asset, series) for i in span_file_names }

get('ABEV3',11,'CALL')
print
