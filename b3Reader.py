import re

def formatPrice(s):
    return str(int(re.sub(r'^0+', '', s))/100)

while True:
    selected_asset = input('Search asset:\n').upper()
    with open('D24062024.txt') as file:
        for i,d in enumerate(file):
            current_asset = d[12:24].strip()
            if i == 0:
                continue
            if selected_asset in current_asset:
                print('\n'+current_asset+' >>> '+
                        formatPrice(d[56:69])+'|'+formatPrice(d[69:82])+'|'+
                        formatPrice(d[82:95])+'|'+formatPrice(d[108:121]))