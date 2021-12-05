def LaNamNhuan(nam): 
    if not ((nam > 0)): 
        return        
    if ((nam % 4) != 0): 
        kq = False
    else: 
        if (((nam % 400) != 0) and ((nam % 100) == 0)): 
            kq = False
        else: 
            if (((nam % 4) == 0) and ((nam % 100) != 0)): 
                kq = True
            else: 
                if ((nam % 400) == 0): 
                    kq = True                    
    return kq
nam = input() 

print(LaNamNhuan(int (nam)))