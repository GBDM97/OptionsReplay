import json
import optionUtils

output = []
file_json_output = []

def applyFilter(data):
    #filter for reverse direction, some unused info and winning operations
    #initial format received:
    #Period - Asset - Underlying Price - Strike - Strike per Underlying Price - Entry Open Price - Exit Min Price - Result - Reverse Asset - Reverse Entry Price - Reverse Exit Price - Reverse Result - Trend Direction
    for i,v in enumerate(data):
          data[i].pop(10)
          data[i].pop(9)
          data[i].pop(8)
          data[i].pop(6)
          data[i].pop(3)
          data[i].pop(2)
          if (((data[i][-1] == 'UP' and optionUtils.isCall(data[i][1][4])) or
               (data[i][-1] == 'DN' and not optionUtils.isCall(data[i][1][4]))) or
               (data[i][4] == '0.0') or #result
               (not data[i][5]) or #reverse result
               (float(data[i][4]) + float(data[i][5]) < -0.1)): #result comparison
            data[i]=[]
            continue
    data = [array for array in data if array]
    return data

with open('ReactApp//optionsreplay//src//data//data.json') as file:
    file_json_output = json.loads(file.read())
    for i in file_json_output:
        trending_data = i['data']['trendingData']
        filtered_data = applyFilter(trending_data)
        output.extend(filtered_data)
            
with open('ReactApp//optionsreplay//src//data//trendingData.json','w') as fileHandle:
        json.dump(output, fileHandle, indent=2)