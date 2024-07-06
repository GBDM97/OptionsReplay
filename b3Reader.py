import re

def formatPrice(s):
    return str(int(re.sub(r'^0+', '', s.strip()))/100)

while True:
    selected_asset = input('Search asset:\n').upper()
    with open('D24062024.txt') as file:
        linesArray = file.readlines()
        for i,d in enumerate(linesArray):
            current_asset = d[12:24].strip()
            if i == 0 or i == len(linesArray)-1:
                continue
            if selected_asset in current_asset and len(current_asset) > 8:
                print('\n'+current_asset+' >>> '+
                        formatPrice(d[56:69])+'|'+formatPrice(d[69:82])+'|'+
                        formatPrice(d[82:95])+'|'+formatPrice(d[108:121]))