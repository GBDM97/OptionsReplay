import re

weekly_assets = ['ABEV','B3SA','BBAS','BBDC','BBSE','BOVA','GGBR','HAPV','ITUB','MGLU','NTCO','PETR','PRIO','SMAL','SUZB','VALE']

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
            if not ((i != 0 or i < len(linesArray)-2 or len(current_asset) > 6) and (current_asset[0:4] in weekly_assets)):
                continue
            output[current_asset] = [formatPrice(d[188:201]),formatPrice(d[56:69]),formatPrice(d[69:82]),formatPrice(d[82:95]),
                                     formatPrice(d[108:121])]
        return output