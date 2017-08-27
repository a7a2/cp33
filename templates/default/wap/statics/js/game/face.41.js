
face = {41000:{'no':'0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26|27','place':'0'
    ,'codepos':1,'codenum':1,'codeonly':0,'codenum2':0,'title':'特码'},
41127:{'no':'0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26|27','place':'0','codepos':1,'codenum':3,'codeonly':0,'codenum2':3,'title':'包三'},
41201:{'no':'大|小|单|双|大单|小单|大双|小双|极大|极小','place':'0','codepos':1,'codenum':1,'codeonly':0,'codenum2':0,'title':'混合','codetype':'text'},
41301:{'no':'红波|绿波|蓝波','place':'0','codepos':1,'codenum':1,'codeonly':1,'codenum2':0,'title':'波色','codetype':'text'},
41401:{'no':'豹子','place':'0','codepos':1,'codenum':1,'codeonly':0,'codenum2':0,'codetype':'text','title':'豹子'}
};
face41 = face;

hhspid = {'大':'41201','小':'41202','单':'41203','双':'41204','大单':'41205','小单':'41206','大双':'41207','小双':'41208','极大':'41209','极小':'41210'};
bsspid = {'红波':'41301','绿波':'41302','蓝波':'41303'};

function toFaceSpid (tmpSpid) {
    if (tmpSpid >= 41301 && tmpSpid <= 41303) {//波色
        return 41301;
    } else if (tmpSpid >= 41201 && tmpSpid <= 41210) {//混合
        return 41201;
    } else if (tmpSpid >= 41000 && tmpSpid <= 41027) {//特码
        return 41000;
    }
    return tmpSpid;
}