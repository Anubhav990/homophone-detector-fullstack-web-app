from wordhoard import Homophones

def find_homophones(word):
    obj = Homophones(search_string=word)
    
    return obj.find_homophones()