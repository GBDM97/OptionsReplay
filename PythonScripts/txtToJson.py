import ast
import json
from pathlib import Path
import b3Reader

currentJsonKeys = []
dataFileContent = ''
with open('ReactApp//optionsreplay//src//data//data.json') as file:
    dataFileContent = json.loads(file.read())
    currentJsonKeys = list(dataFileContent.keys())
currentFiles = [file.name.replace('.txt','') for file in Path('PythonScripts//data').iterdir()]

def jsonWrite(dateCode,processedData):
    dataFileContent[dateCode] = processedData
    with open('ReactApp//optionsreplay//src//data//data.json','w') as fileHandle:
        json.dump(dataFileContent, fileHandle, indent=2)

for file in currentFiles:
    if file in currentJsonKeys:
        continue
    else:
        jsonWrite(file, b3Reader.run(file))