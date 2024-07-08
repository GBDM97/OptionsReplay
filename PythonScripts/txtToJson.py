import ast
import json
from pathlib import Path
import b3Reader

currentJsonKeys = []
with open('ReactApp//optionsreplay//src//data//data.json') as file:
    currentJsonKeys = list(json.loads(file.read()).keys())
currentFiles = [file.name.replace('.txt','') for file in Path('PythonScripts//data').iterdir()]

def jsonWrite(processedData):
    print(processedData)

for file in currentFiles:
    if file in currentJsonKeys:
        continue
    else:
        jsonWrite(b3Reader.run(file))