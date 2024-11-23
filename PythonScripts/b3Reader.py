import re
import optionUtils

selected_assets = optionUtils.selectedAssets
def formatPrice(s):
    if int(s) == 0:
        return "0"
    return str(int(re.sub(r'^0+', '', s.strip()))/100)

def generateCurrentAssetArray(d):
    return [formatPrice(d[188:201]),formatPrice(d[56:69]),formatPrice(d[69:82]),formatPrice(d[82:95]),
                                     formatPrice(d[108:121])]
        
def getRawData(dateString, series):
    output = {}
    option_comparison_array = [ii[:4] for ii in selected_assets]
    with open('PythonScripts//data//'+dateString[2:]+'//COTAHIST_D'+dateString+'.TXT') as file:
        linesArray = file.readlines()
        for i,d in enumerate(linesArray):
            current_asset = d[12:24].strip()
            if current_asset[:4] == 'ABEV':
                print
            if (i == 0 or i >= len(linesArray) - 2 or current_asset[-1:] in {'F', 'E'}):
                continue
            elif current_asset in selected_assets:
                output[current_asset] = generateCurrentAssetArray(d)
            elif current_asset[:4] in option_comparison_array and ((current_asset[:5] == current_asset[:4] + series[0] and len(current_asset) > 6) 
              or  (current_asset[:5] == current_asset[:4] + series[1] and len(current_asset) > 6)):
                output[current_asset] = generateCurrentAssetArray(d)
        return output