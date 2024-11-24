import time
import optionUtils
from pathlib import Path
import b3Reader

def get(): #generates json for graph for all months on the folders and their respective opts
    data = []
    all_data = {}
    all_dates_per_month = {}
    all_dates = set()
    all_options = set()
    option_series = optionUtils.optionSeries()
    analysis_spans = optionUtils.getAnalysisSpans()
    for month,span in analysis_spans.items():
        span_data = getSpanData(span, option_series[month])
        all_dates_per_month[month] = span_data[0]
        raw_data = span_data[1]
        span_options = getAllPeriodOptionCodes(raw_data)
        all_dates.update(span_data[0])
        all_options.update(span_options)
        all_data = deepMergeNestedStructure(all_data, raw_data)
    all_dates = sorted(all_dates)

    for opt in sorted(all_options):
        month = optionUtils.toMonth(opt[4])
        dates_to_use = all_dates_per_month[month] if len(opt) > 6 else all_dates
        x = [f"{dToStr(ii)} - {i}" for ii in dates_to_use for i in ['O', 'H', 'L', 'C']]
        option_chart_obj = chartObjInitialState(opt,x)
        span = [
                    toTime(analysis_spans[month][0]),
                    toTime(analysis_spans[month][1])
               ] if len(opt) > 6 else None
        for date in dates_to_use:
            date_data = all_data[dToStr(date)]
            option_chart_obj['strike'] = float(date_data[opt][0]) if opt in date_data and date_data[opt][0] != "0" else None
            for i in range(1,5):
                price = float(date_data[opt][i]) if opt in date_data else 0
                option_chart_obj['y'].append(price)
        data.append(option_chart_obj)
        print(opt) if len(opt) < 7 else None
    optionUtils.exportToReact(data)

def getSpanData(span, series):#returns an array, the first element contains all the dates of a span and the second is its respective asset data
    prev_month = span[0][2:]
    curr_month = span[1][2:]
    span = [toTime(span[0]),toTime(span[1])]
    file_names_arr = [file.name.replace('.TXT','').replace("COTAHIST_D","") 
                    for file in Path('PythonScripts//data//'+prev_month).iterdir()]
    files_names_arr_2 = [file.name.replace('.TXT','').replace("COTAHIST_D","") 
                    for file in Path('PythonScripts//data//'+curr_month).iterdir()]
    file_names_arr.extend(files_names_arr_2)
    ordered_dates_arr = sorted([toTime(i) for i in file_names_arr])
    span_file_dates = [i for i in ordered_dates_arr if i >= span[0] and i < span[1]]
    return [span_file_dates,{dToStr(i):b3Reader.getRawData(dToStr(i), series) 
                              for i in span_file_dates}]
def getAllPeriodOptionCodes(data:dict):
    output_array = []
    for i in data.values():
        output_array.extend(i.keys())
    return output_array

def deepMergeNestedStructure(el1, el2):#merges the dict of dicts of current data into the dict of dicts of all data
    for k,v in el2.items():
        if k in el1:
            el1[k].update(v)
        else:
            el1[k]=v
    return el1

def chartObjInitialState(opt,x):
    return {
            'name':opt,
            'undelyingAsset': optionUtils.getUnderlyingAsset(opt),
            'x':x,
            'y':[],
            'side': 'CALL'if len(opt) > 6 and optionUtils.isCall(opt[4]) else
                     'PUT' if len(opt) > 6 and optionUtils.isCall(opt[4]) else None,
            'month': optionUtils.toMonth(opt[4]) if len(opt) > 6 else None,
            'week': opt[-2:] if len(opt) > 8 else 'W3' if len(opt) > 6 else None,
            'type': 'scatter',
            'mode': 'lines+markers'
        }

def toTime(date):
    return time.strptime(date,"%d%m%Y")

def dToStr(date):
    return time.strftime("%d%m%Y",date)

get()