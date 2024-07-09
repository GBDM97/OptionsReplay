import re

def formatPrice(s):
    if int(s) == 0:
        return "0"
    return str(int(re.sub(r'^0+', '', s.strip()))/100)
        
def run(fileName):
    output = {}
    with open('PythonScripts//data//'+fileName+'.txt') as file:
        linesArray = file.readlines()
        for i,d in enumerate(linesArray):
            current_asset = d[12:24].strip()
            if i == 1620:
                print
            if i == 0 or i > len(linesArray)-2:
                continue
            output[current_asset] = [formatPrice(d[56:69]),formatPrice(d[69:82]),formatPrice(d[82:95]),
                                     formatPrice(d[108:121])]
        return output