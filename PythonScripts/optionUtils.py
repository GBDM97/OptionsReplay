def getReverseCode(code: str) -> str:
    if code == "A":
        return "M"
    elif code == "B":
        return "N"
    elif code == "C":
        return "O"
    elif code == "D":
        return "P"
    elif code == "E":
        return "Q"
    elif code == "F":
        return "R"
    elif code == "G":
        return "S"
    elif code == "H":
        return "T"
    elif code == "I":
        return "U"
    elif code == "J":
        return "V"
    elif code == "K":
        return "W"
    elif code == "L":
        return "X"
    elif code == "M":
        return "A"
    elif code == "N":
        return "B"
    elif code == "O":
        return "C"
    elif code == "P":
        return "D"
    elif code == "Q":
        return "E"
    elif code == "R":
        return "F"
    elif code == "S":
        return "G"
    elif code == "T":
        return "H"
    elif code == "U":
        return "I"
    elif code == "V":
        return "J"
    elif code == "W":
        return "K"
    elif code == "X":
        return "L"
    else:
        return ''
    
def isCall(code):
    if code == "A":
        return True
    elif code == "B":
        return True
    elif code == "C":
        return True
    elif code == "D":
        return True
    elif code == "E":
        return True
    elif code == "F":
        return True
    elif code == "G":
        return True
    elif code == "H":
        return True
    elif code == "I":
        return True
    elif code == "J":
        return True
    elif code == "K":
        return True
    elif code == "L":
        return True
    else:
        return False
    
def monthToOptionCodes(month):#returns [currentCallCode,currentPutCode]
    if month == 11:
        return ['K','W']
    else:
        return ['C','O']
    
def getDfAnalysisDateSpan(month):#start date inclusive, end date exclusive
    if month == 11:
        return ['25102024','16112024']