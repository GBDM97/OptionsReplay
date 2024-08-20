import re

def formatPrice(s):
    if int(s) == 0:
        return "0"
    return str(int(re.sub(r'^0+', '', s.strip()))/100)
        
def getBasicData(dateString):
    output = {}
    with open('PythonScripts//data//COTAHIST_D'+dateString+'.TXT') as file:
        linesArray = file.readlines()
        for i,d in enumerate(linesArray):
            current_asset = d[12:24].strip()
            if i == 0 or i > len(linesArray)-2 or current_asset[-2] != 'W' or len(current_asset) < 7:
                continue
            output[current_asset] = [formatPrice(d[188:201]),formatPrice(d[56:69]),formatPrice(d[69:82]),formatPrice(d[82:95]),
                                     formatPrice(d[108:121])]
        return output