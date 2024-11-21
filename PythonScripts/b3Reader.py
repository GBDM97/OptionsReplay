import re
import optionUtils

selected_assets = ['ABEV3','B3SA3','BBAS3','BBDC4','BBSE3','BOVA11','BRKM5','ELET6','EMBR3','GGBR4','HAPV3','ITSA4','ITUB4','KLBN11','MGLU3','NTCO3','PCAR3','PETR4','PRIO3','SANB11','SMAL11','SUZB3','TAEE11','USIM5','VALE3']

def formatPrice(s):
    if int(s) == 0:
        return "0"
    return str(int(re.sub(r'^0+', '', s.strip()))/100)
        
def getRawData(dateString, selected_asset, series):
    output = {}
    with open('PythonScripts//data//'+dateString[2:4]+'//COTAHIST_D'+dateString+'.TXT') as file:
        linesArray = file.readlines()
        for i,d in enumerate(linesArray):
            current_asset = d[12:24].strip()
            if ((i == 0 or i >= len(linesArray)-2 or current_asset[-1:] == 'F') or (not(current_asset in selected_asset) and 
            not((current_asset[0:5] == selected_asset[0:4] + series) and len(current_asset) > 5))):
                continue
            output[current_asset] = [formatPrice(d[188:201]),formatPrice(d[56:69]),formatPrice(d[69:82]),formatPrice(d[82:95]),
                                     formatPrice(d[108:121])]
        return output