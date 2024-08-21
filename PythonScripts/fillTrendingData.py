import json

output = []
file_json_output = []
with open('ReactApp//optionsreplay//src//data//data.json') as file:
    file_json_output = json.loads(file.read())
    for i in file_json_output:
        output.extend(i['data']['trendingData'])
    
with open('ReactApp//optionsreplay//src//data//trendingData.json','w') as fileHandle:
        json.dump(output, fileHandle, indent=2)