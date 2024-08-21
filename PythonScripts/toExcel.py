import json
import pandas as pd

with open('ReactApp//optionsreplay//src//data//trendingData.json') as file:
    data = json.loads(file.read())
    df = pd.DataFrame(data, columns=['PERIOD', 'ASSET', 'PERCENTAGE', 
                                     'ENTRY PRICE', 'RESULT', 'REVERSE RESULT', 'TREND'])
    df.to_excel('PythonScripts\\xlsx\\output.xlsx', index=False)
