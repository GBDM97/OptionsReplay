import json

selectedAssets = ['ABEV3','B3SA3','BBAS3','BBDC4','BBSE3','BOVA11','BRKM5','ELET6','EMBR3','GGBR4','HAPV3','ITSA4','ITUB4','KLBN11','MGLU3','NTCO3','PCAR3','PETR4','PRIO3','SANB11','SMAL11','SUZB3','TAEE11','USIM5','VALE3']

def getReverseCode(code: str) -> str:
    reverse_mapping = {
        "A": "M", "B": "N", "C": "O", "D": "P", "E": "Q", "F": "R", 
        "G": "S", "H": "T", "I": "U", "J": "V", "K": "W", "L": "X",
        "M": "A", "N": "B", "O": "C", "P": "D", "Q": "E", "R": "F", 
        "S": "G", "T": "H", "U": "I", "V": "J", "W": "K", "X": "L"
    }
    return reverse_mapping.get(code, '')

def isCall(code):
    return code in "ABCDEFGHIJKL"
    
def toMonth(code):
    month_mapping = {
        "A": 1, "M": 1,
        "B": 2, "N": 2,
        "C": 3, "O": 3,
        "D": 4, "P": 4,
        "E": 5, "Q": 5,
        "F": 6, "R": 6,
        "G": 7, "S": 7,
        "H": 8, "T": 8,
        "I": 9, "U": 9,
        "J": 10, "V": 10,
        "K": 11, "W": 11,
        "L": 12, "X": 12
    }
    return month_mapping.get(code, '')

    
def optionSeries():#returns [currentCallCode,currentPutCode]
    return {
        7:['G','S'],
        8:['H','T'],
        9:['I','U'],
        10:['J','V'],
        11:['K','W'],
    }
    
def getAnalysisSpans():#start date inclusive, end date exclusive
    return {
        7:['01072024','27072024'],
        8:['22072024','31082024'],
        9:['19082024','28092024'],
        10:['23092024','26102024'],
        11:['21102024','16112024'],
    }

def exportToReact(data):
    with open('ReactApp//optionsreplay//src//data//chart.json','w') as fileHandle:
        json_string = json.dumps(data, indent=2)
        fileHandle.write(json_string)
        print('Data Exported!')

def getUnderlyingAsset(opt):
    mapping = {
        'ABEV': 'ABEV3',
        'B3SA': 'B3SA3',
        'BBAS': 'BBAS3',
        'BBDC': 'BBDC4',
        'BBSE': 'BBSE3',
        'BOVA': 'BOVA11',
        'BRKM': 'BRKM5',
        'ELET': 'ELET6',
        'EMBR': 'EMBR3',
        'GGBR': 'GGBR4',
        'HAPV': 'HAPV3',
        'ITSA': 'ITSA4',
        'ITUB': 'ITUB4',
        'KLBN': 'KLBN11',
        'MGLU': 'MGLU3',
        'NTCO': 'NTCO3',
        'PCAR': 'PCAR3',
        'PETR': 'PETR4',
        'PRIO': 'PRIO3',
        'SANB': 'SANB11',
        'SMAL': 'SMAL11',
        'SUZB': 'SUZB3',
        'TAEE': 'TAEE11',
        'USIM': 'USIM5',
        'VALE': 'VALE3'
    }
    return mapping.get(opt[:4], None)
