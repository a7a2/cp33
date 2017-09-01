//no://号码内容；可数组
//place:1//位置编号
//codepos,//至少在1个位置上选号
//codenum:2//2代表每位至少选2个号码；如果是数组，则每位上几个号码
//codeonly：1,//1代表这个选号不能在其他位上再选 title投注行前面文字描述 pos 显示位置
face = {107:{'no':'0|1|2|3|4|5|6|7|8|9','place':'0|1|2|3|4'
    ,'codepos':5,'codenum':1,'codeonly':0,'codenum2':0},
    105:{'no':'0|1|2|3|4|5|6|7|8|9','place':'1|2|3|4'
        ,'codepos':4,'codenum':1,'codeonly':0,'codenum2':0},
    88:{'no':'0|1|2|3|4|5|6|7|8|9','place':'2|3|4'
        ,'codepos':3,'codenum':1,'codeonly':0,'codenum2':0},
    54:{'no':'0|1|2|3|4|5|6|7|8|9','place':'0|1|2'
        ,'codepos':3,'codenum':1,'codeonly':0,'codenum2':0},
    97:{'no':'1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26'
        ,'place':'0','codepos':1,'codenum':1,'codeonly':0,'codenum2':0,'title':'和值'},
    63:{'no':'1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26'
        ,'place':'0','codepos':1,'codenum':1,'codeonly':0,'codenum2':0,'title':'和值'},
    99:{'no':'0|1|2|3|4|5|6|7|8|9','place':'0','codepos':1,'codenum':1,'codeonly':0,'codenum2':1,'title':'包胆'},
    65:{'no':'0|1|2|3|4|5|6|7|8|9','place':'0','codepos':1,'codenum':1,'codeonly':0,'codenum2':1,'title':'包胆'},
    92:{'no':'0|1|2|3|4|5|6|7|8|9','place':'2|3|4','codepos':3,'codenum':1,'codeonly':0,'codenum2':0,'title':'组和'},
    58:{'no':'0|1|2|3|4|5|6|7|8|9','place':'0|1|2','codepos':3,'codenum':1,'codeonly':0,'codenum2':0},
    90:{'no':'0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26|27'
        ,'place':'0','codepos':1,'codenum':1,'codenum2':0,'title':'和值'},
    56:{'no':'0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26|27'
        ,'place':'0','codepos':1,'codenum':1,'codenum2':0,'title':'和值'},
    91:{'no':'0|1|2|3|4|5|6|7|8|9','place':'0','codepos':1,'codenum':1,'codeonly':0,'codenum2':0,'title':'跨度'},
    57:{'no':'0|1|2|3|4|5|6|7|8|9','place':'0','codepos':1,'codenum':1,'codeonly':0,'codenum2':0,'title':'跨度'},
    93:{'no':'0|1|2|3|4|5|6|7|8|9','place':'0','codepos':1,'codenum':2,'codeonly':0,'codenum2':0,'title':'组三'},
    59:{'no':'0|1|2|3|4|5|6|7|8|9','place':'0','codepos':1,'codenum':2,'codeonly':0,'codenum2':0,'title':'组三'},
    94:{'no':'0|1|2|3|4|5|6|7|8|9','place':'0','codepos':1,'codenum':3,'codeonly':0,'codenum2':0,'title':'组六'},
    60:{'no':'0|1|2|3|4|5|6|7|8|9','place':'0','codepos':1,'codenum':3,'codeonly':0,'codenum2':0,'title':'组六'},
    101:{'no':'0|1|2|3|4|5|6|7|8|9','place':'0','codepos':1,'codenum':1,'codeonly':0,'codenum2':0,'title':'和值尾数'},
    67:{'no':'0|1|2|3|4|5|6|7|8|9','place':'0','codepos':1,'codenum':1,'codeonly':0,'codenum2':0,'title':'和值尾数'},
    38:{'no':'0|1|2|3|4|5|6|7|8|9','place':'0|1','codepos':2,'codenum':1,'codeonly':0,'codenum2':0},
    40:{'no':'0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18'
        ,'place':'0','codepos':1,'codenum':1,'codeonly':0,'codenum2':0,'title':'和值'},
    41:{'no':'0|1|2|3|4|5|6|7|8|9','place':'0','codepos':1,'codenum':1,'codeonly':0,'codenum2':0,'title':'跨度'},
    46:{'no':'0|1|2|3|4|5|6|7|8|9','place':'0','codepos':1,'codenum':2,'codeonly':0,'codenum2':0,'title':'组选'},
    48:{'no':'1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17'
        ,'place':'0','codepos':1,'codenum':1,'codeonly':0,'codenum2':0,'title':'和值'},
    49:{'no':'0|1|2|3|4|5|6|7|8|9','place':'0','codepos':1,'codenum':1,'codeonly':0,'codenum2':1,'title':'包胆'},
    37:{'no':'0|1|2|3|4|5|6|7|8|9','place':'0|1|2|3|4','codepos':0,'codenum':-1,'codeonly':0,'codenum2':0,'title':'定位胆'},
    113:{'no':'0|1|2|3|4|5|6|7|8|9','place':'0','codepos':1,'codenum':1,'codeonly':0,'codenum2':0,'title':'不定位'},
    114:{'no':'0|1|2|3|4|5|6|7|8|9','place':'0','codepos':1,'codenum':2,'codeonly':0,'codenum2':0,'title':'不定位'},
    115:{'no':'0|1|2|3|4|5|6|7|8|9','place':'0','codepos':1,'codenum':1,'codeonly':0,'codenum2':0,'title':'不定位'},
    116:{'no':'0|1|2|3|4|5|6|7|8|9','place':'0','codepos':1,'codenum':2,'codeonly':0,'codenum2':0,'title':'不定位'},
    117:{'no':'0|1|2|3|4|5|6|7|8|9','place':'0','codepos':1,'codenum':1,'codeonly':0,'codenum2':0,'title':'不定位'},
    118:{'no':'0|1|2|3|4|5|6|7|8|9','place':'0','codepos':1,'codenum':2,'codeonly':0,'codenum2':0,'title':'不定位'},
    244:{'no':'0|1|2|3|4|5|6|7|8|9','place':'0','codepos':1,'codenum':1,'codeonly':0,'codenum2':0,'title':'不定位'},
    245:{'no':'0|1|2|3|4|5|6|7|8|9','place':'0','codepos':1,'codenum':2,'codeonly':0,'codenum2':0,'title':'不定位'},
    119:{'no':'0|1|2|3|4|5|6|7|8|9','place':'0','codepos':1,'codenum':1,'codeonly':0,'codenum2':0,'title':'不定位'},
    120:{'no':'0|1|2|3|4|5|6|7|8|9','place':'0','codepos':1,'codenum':2,'codeonly':0,'codenum2':0,'title':'不定位'},
    121:{'no':'0|1|2|3|4|5|6|7|8|9','place':'0','codepos':1,'codenum':3,'codeonly':0,'codenum2':0,'title':'不定位'},
    111:{'no':'大|小|单|双','place':'0|1','codepos':2,'codenum':1,'codeonly':0,'codenum2':0},
    112:{'no':'大|小|单|双','place':'0|1|2','codepos':3,'codenum':1,'codeonly':0,'codenum2':0},
    109:{'no':'大|小|单|双','place':'3|4','codepos':2,'codenum':1,'codeonly':0,'codenum2':0},
    110:{'no':'大|小|单|双','place':'2|3|4','codepos':3,'codenum':1,'codeonly':0,'codenum2':0},
    122:{'no':'0|1|2|3|4|5|6|7|8|9','place':'0|1|2|3|4','codepos':2,'codenum':0,'codeonly':0,'codenum2':0},
    124:{'no':'0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18','place':'0','codepos':1,'codenum':1,'codeonly':0,'codenum2':0,'title':'和值','pos':'00011'},
    125:{'no':'0|1|2|3|4|5|6|7|8|9','place':'0','codepos':1,'codenum':2,'codeonly':0,'codenum2':0,'title':'组选','pos':'00011'},
    127:{'no':'1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17','place':'0','codepos':1,'codenum':1,'codeonly':0,'codenum2':0,'title':'和值','pos':'00011'},
    128:{'no':'0|1|2|3|4|5|6|7|8|9','place':'0|1|2|3|4','codepos':3,'codenum':0,'codeonly':0,'codenum2':0},
    130:{'no':'0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26|27',
        'place':'0','codepos':1,'codenum':1,'codeonly':0,'codenum2':0,'title':'和值','pos':'00111'},
    131:{'no':'0|1|2|3|4|5|6|7|8|9','place':'0','codepos':1,'codenum':2,'codeonly':0,'codenum2':0,'title':'组三','pos':'00111'},
    133:{'no':'0|1|2|3|4|5|6|7|8|9','place':'0','codepos':1,'codenum':3,'codeonly':0,'codenum2':0,'title':'组六','pos':'00111'},
    137:{'no':'1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26',
        'place':'0','codepos':1,'codenum':1,'codeonly':0,'codenum2':0,'title':'和值','pos':'00111'},
    139:{'no':'0|1|2|3|4|5|6|7|8|9','place':'0|1|2|3|4','codepos':4,'codenum':0,'codeonly':0,'codenum2':0},
    141:{'no':'0|1|2|3|4|5|6|7|8|9','place':'0','codepos':1,'codenum':4,'codeonly':0,'codenum2':0,'title':'组选24','pos':'01111'},
    142:{'no':'0|1|2|3|4|5|6|7|8|9','place':'0|1','codepos':2,'codenum':{0:{0:1,1:2}},'codeonly':0,'codenum2':0,'title':{0:'二重号',1:'单号'},'pos':'01111'},
    143:{'no':'0|1|2|3|4|5|6|7|8|9','place':'0','codepos':1,'codenum':2,'codeonly':0,'codenum2':0,'title':'二重号','pos':'01111'},
    144:{'no':'0|1|2|3|4|5|6|7|8|9','place':'0|1','codepos':2,'codenum':1,'codeonly':0,'codenum2':0,'title':{0:'三重号',1:'单号'},'pos':'01111'},
    102:{'no':'豹子|顺子|对子','place':'0','codepos':1,'codenum':1,'codeonly':0,'codenum2':0,'title':'特殊号码',codetype:'text'},
    68:{'no':'豹子|顺子|对子','place':'0','codepos':1,'codenum':1,'codeonly':0,'codenum2':0,'title':'特殊号码',codetype:'text'}
};
face4 = face;
//后三直选和值
var ccZXHZ = {0: 1, 1: 3, 2: 6, 3: 10, 4: 15, 5: 21, 6: 28, 7: 36, 8: 45, 9: 55, 10: 63, 11: 69, 12: 73, 13: 75, 14: 75, 15: 73, 16: 69, 17: 63, 18: 55, 19: 45, 20: 36, 21: 28, 22: 21, 23: 15, 24: 10, 25: 6, 26: 3, 27: 1};
//后三直选跨度
var ccZXKD = {0: 10, 1: 54, 2: 96, 3: 126, 4: 144, 5: 150, 6: 144, 7: 126, 8: 96, 9: 54};
//后三组选和值
var ccZUHZ = {1: 1, 2: 2, 3: 2, 4: 4, 5: 5, 6: 6, 7: 8, 8: 10, 9: 11, 10: 13, 11: 14, 12: 14, 13: 15, 14: 15, 15: 14, 16: 14, 17: 13, 18: 11, 19: 10, 20: 8, 21: 6, 22: 5, 23: 4, 24: 2, 25: 2, 26: 1};
//前二直选和值
var ccQ2ZXHZ = {0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7, 7: 8, 8: 9, 9: 10, 10: 9, 11: 8, 12: 7, 13: 6, 14: 5, 15: 4, 16: 3, 17: 2, 18: 1};
//前二直选跨度
var ccQ2ZXKD = {0: 10, 1: 18, 2: 16, 3: 14, 4: 12, 5: 10, 6: 8, 7: 6, 8: 4, 9: 2};
//前二组选和值
var ccQ2ZUHZ = {0: 0, 1: 1, 2: 1, 3: 2, 4: 2, 5: 3, 6: 3, 7: 4, 8: 4, 9: 5, 10: 4, 11: 4, 12: 3, 13: 3, 14: 2, 15: 2, 16: 1, 17: 1, 18: 0};
//任二直选和值
var ccR2ZXHZ = {0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7, 7: 8, 8: 9, 9: 10, 10: 9, 11: 8, 12: 7, 13: 6, 14: 5, 15: 4, 16: 3, 17: 2, 18: 1};
//任二组选和值
var ccR2ZUHZ = {0: 0, 1: 1, 2: 1, 3: 2, 4: 2, 5: 3, 6: 3, 7: 4, 8: 4, 9: 5, 10: 4, 11: 4, 12: 3, 13: 3, 14: 2, 15: 2, 16: 1, 17: 1, 18: 0};
//任三直选和值
var ccR3ZXHZ = {0: 1, 1: 3, 2: 6, 3: 10, 4: 15, 5: 21, 6: 28, 7: 36, 8: 45, 9: 55, 10: 63, 11: 69, 12: 73, 13: 75, 14: 75, 15: 73, 16: 69, 17: 63, 18: 55, 19: 45, 20: 36, 21: 28, 22: 21, 23: 15, 24: 10, 25: 6, 26: 3, 27: 1};
//任三组选和值
var ccR3ZUHZ = {1: 1, 2: 2, 3: 2, 4: 4, 5: 5, 6: 6, 7: 8, 8: 10, 9: 11, 10: 13, 11: 14, 12: 14, 13: 15, 14: 15, 15: 14, 16: 14, 17: 13, 18: 11, 19: 10, 20: 8, 21: 6, 22: 5, 23: 4, 24: 2, 25: 2, 26: 1};