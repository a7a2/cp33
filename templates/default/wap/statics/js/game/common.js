
//对象转数组
function obj2arr(obj) {
    var arr = [];
    for (var item in obj) {
        arr.push(obj[item]);
    }
    return arr;
}

// 交集
function arrIntersect(a, b) { //传字符串
    var result = '';
    for (var i = 0; i < b.length; i++) {
        var temp = b[i];
        for (var j = 0; j < a.length; j++) {
            if (temp === a[j]) {
                result += temp;
                break;
            }
        }
    }
    return result;
}

function Combination(c, b) {
    b = parseInt(b);
    c = parseInt(c);
    if (b < 0 || c < 0) {
        return false
    }
    if (b == 0 || c == 0) {
        return 1
    }
    if (b > c) {
        return 0
    }
    if (b > c / 2) {
        b = c - b
    }
    var a = 0;
    for (var i = c; i >= (c - b + 1); i--) {
        a += Math.log(i)
    }
    for (var i = b; i >= 1; i--) {
        a -= Math.log(i)
    }
    a = Math.exp(a);
    return Math.round(a)
}

function group(nu, groupl, result) {
    var result = result ? result : [];
    var nul = nu.length;
    var outloopl = nul - groupl;

    var nuc = nu.slice(0);

    var item = nuc.shift();
    item = item.constructor === Array ? item : [item];

    (function func(item, nuc) {
        var itemc;
        var nucc = nuc.slice(0);
        var margin = groupl - item.length


        if (margin == 0) {
            result.push(item);
            return;
        }
        if (margin == 1) {
            for (var j in nuc) {
                itemc = item.slice(0);
                if (/function/.test(nuc[j])) {
                    return;
                }
                itemc.push(nuc[j]);
                result.push(itemc);
            }
        }
        if (margin > 1) {
            itemc = item.slice(0);
            itemc.push(nucc.shift());
            func(itemc, nucc);

            if (item.length + nucc.length >= groupl) {
                func(item, nucc);
            }
        }
    })(item, nuc);

    if (nuc.length >= groupl) {
        return group(nuc, groupl, result);
    } else {
        return result;
    }
}

function countRepeat(str, substr, isIgnore) {
    var count;
    var reg = '';
    if (isIgnore == true) {
        reg = '/' + substr + '/gi';
    } else {
        reg = '/' + substr + '/g';
    }
    reg = eval(reg);
    if (str.match(reg) == null) {
        count = 0;
    } else {
        count = str.match(reg).length;
    }
    return count;
}

//冒泡排序
Array.prototype.bubbleSort = function() {
    var array = this,
        i = 0,
        len = array.length,
        j, d;
    for (; i < len; i++) {
        for (j = 0; j < len; j++) {
            if (array[i]['time'] > array[j]['time']) {
                d = array[j];
                array[j] = array[i];
                array[i] = d;
            }
        }
    }
    return array;
}

//包含
function arrContains(arr, obj) {
    var i = arr.length;
    while (i--) {
        if (arr[i] == obj) {
            return true;
        }
    }
    return false;
}

var noBetTrim = new Array(1, 2, 228, 37, 122, 128, 139, 198, 227);//不处理'|'
String.prototype.betTrim = function (spid) {
    if (spid != undefined && arrContains(noBetTrim, spid)) {//定位胆不处理|
        return this.replace(/(^[\s]*)|([\s]*$)/g, '');
    }
    return this.replace(/(^[\s\|]*)|([\s\|]*$)/g, '');
}

//多赔率
morePrizeIds = {58:{0:38,1:37},92:{0:38,1:37},//三星直选组合
    95:{0:62},97:{0:62},99:{0:62},61:{0:62},63:{0:62},65:{0:62},//组三组六的情况
    68:{0:69,1:70},102:{0:69,1:70},//特殊号
    135:{0:136},//任三组选混合组选
    137:{0:138},//任三组选和值
};

sepIn = '&';//separator
sepOut = '|';

function setSlide(spid, curVal) {
    curVal = 1000 - curVal;
    //初始化
    var morePrizeArr = obj2arr(morePrizeIds[spid]);

    if (spid == 68 || spid == 102) {
        morePrizeArr = new Array();
        var betCode = $('#bet_code').val();
        if (/豹子/g.test(betCode)) {
            morePrizeArr[morePrizeArr.length] = spid;
        }
        if (/顺子/g.test(betCode)) {
            morePrizeArr[morePrizeArr.length] = 69;
        }
        if (/对子/g.test(betCode)) {
            morePrizeArr[morePrizeArr.length] = 70;
        }
    }

    var minPrize = prizeData[spid].minPrize;
    var maxPrize = prizeData[spid].maxPrize;
    var maxReward = prizeData[spid].maxReward;
    var per = (maxPrize - minPrize) / maxReward;

    var tmpReward = userReward * curVal / 1000;//全局变量：userReward
    tmpReward = tmpReward.toFixed(1);
    var prizeShow = minPrize + tmpReward * per;
    prizeShow = prizeShow.toFixed(3);
    prizeShow = parseFloat(prizeShow);
    var unit = $('a.money-unit').filter('a.acitve').data('unit');
    var perMoney = $('#bet_per_money').val();
    perMoney = (perMoney == '') ? 2 : perMoney;
    var prizeMoney = prizeShow * perMoney * unit;
    prizeMoney = parseFloat(prizeMoney.toFixed(3));
    var percReward = userReward - tmpReward;
    percReward = percReward.toFixed(1);

    var prizeMoneyMax = prizeMoney;
    var prizeMoneyMin = prizeMoney;

    var prizeTrue = prizeShow;
    var onePrizeTrue = prizeShow;
    if (morePrizeArr.length > 0) {//有多赔率
        if (spid == 68 || spid == 102) {
            prizeShow = '';
            prizeMoney = '';
            prizeMoneyMax = 0;
            prizeMoneyMin = 100000000;
        }
        for (var i = 0; i < morePrizeArr.length; i++) {
            var tmpId = morePrizeArr[i];
            var tmpMinPrize = prizeData[tmpId].minPrize;
            var tmpMaxPrize = prizeData[tmpId].maxPrize;
            var tmpMaxReward = prizeData[tmpId].maxReward;
            per = (tmpMaxPrize - tmpMinPrize) / tmpMaxReward;
            var tmp2Reward = userReward * curVal / 1000;
            tmp2Reward = tmp2Reward.toFixed(1);
            var tmpPrize = tmpMinPrize + tmp2Reward * per;
            if (prizeShow != '') {
                prizeShow += '|';
                prizeTrue += '|';
                prizeMoney += '|';
            }
            prizeShow += parseFloat(tmpPrize.toFixed(3));
            prizeTrue += parseFloat(tmpPrize.toFixed(3));
            var tmpPrizeMoney = parseFloat(tmpPrize.toFixed(3)) * perMoney * unit;
            prizeMoneyMax = (tmpPrizeMoney > prizeMoneyMax) ? tmpPrizeMoney : prizeMoneyMax;
            prizeMoneyMin = (tmpPrizeMoney < prizeMoneyMin) ? tmpPrizeMoney : prizeMoneyMin;
            prizeMoney += tmpPrizeMoney;
        }
        prizeMoney = parseFloat(prizeMoneyMin.toFixed(3)) + '~' + parseFloat(prizeMoneyMax.toFixed(3));
    }
    if (spid == 68 || spid == 102) {//特殊号处理
        prizeTrue = prizeShow;
		 
    }

    if (curVal == 1000) {//初始化滑动条位置
        $( "#slider-range-min" ).slider({value: 0});
    }
    $("#reward_show").val(percReward + '%');
    $("#reward").val((percReward/100).toFixed(3).replace(/[0]+$/,'').replace(/\.$/,''));
    $("#prize_money").text(prizeMoney);
    $("#prize_div").show();
    $("#prize_show").val(prizeShow);//页面显示用
    $("#prize_true").val(prizeTrue);
	
}

//响应手机摇一摇
window.doMobileShake = function() {
    //$('div.lot-up-left img').click();
    $.mobileShake();
}





//获取上期开奖号码定时器
timerWait = '';//等待开奖
secWait = 0;//已等待秒数
needWaitSec = 30;//需要等待的秒数，再去ajax请求
function setLastTimer() {
    secWait = 0;//初始化
    clearInterval(timerWait);//删除定时器
    timerWait = window.setInterval(function () {
        var tmpState = $('span#last_open').text();
        if (tmpState != '等待开奖') {//已开奖
            clearInterval(timerWait);
        }
        if (tmpState == '等待开奖' && secWait % needWaitSec == 0) {//25-35秒获取一次
            needWaitSec = Math.floor(Math.random() * 10) + 25;
            getLastPeriod();
        }
        secWait++;
    }, 1000);
}

timeLeave = 2200; //倒计时剩余时间
localTime = 0;//最后一次倒计时的本机时间（毫秒）
var timerno = '';
function setLeaveTimer(timeLeave,gameid) { //启动定时，进行倒计时。
//timeLeave = tmpLocalTime; //倒计时剩余时间
    function format(dateStr) { //格式化时间
        return new Date(dateStr.replace(/[\-\u4e00-\u9fa5]/g, "/"));
    }

    function fftime(n) {
        return Number(n) < 10 ? "" + 0 + Number(n) : Number(n);
    }

    function diff(t) { //根据时间差返回相隔时间
        return t > 0 ? {
            day: Math.floor(t / 86400),
            hour: Math.floor(t / 3600),
            minute: Math.floor(t % 3600 / 60),
            second: Math.floor(t % 60)
        } : {
            day: 0,
            hour: 0,
            minute: 0,
            second: 0
        };
    }

    //timeLeave = 0;//倒计时总秒数
    clearInterval(timerno);//删除定时器
    timerno = window.setInterval(function () {
		//console.log(timeLeave);
        if (timeLeave <= 0) { //结束
			//w.Emit(gameid,"get");
            //clearInterval(timerno);
            //alert($('#current_period').text() + '期已经结束，您的注单即将进入下一期。', '');
            //获取下一期相关数据
//            if (Math.abs(timeLeave)%10 == 0) {
//                getNextPeriod();
//            }
        }
        /*var tmpLocalTime = new Date().getTime() + 0;//本机毫秒数
        if (localTime > 0 && (tmpLocalTime-localTime) > 1500) {//倒计时已不准确，重新获取倒计时
            getNextPeriod(1);
        }
        localTime = tmpLocalTime;*/
        timeLeave--;
        if (timeLeave < 0) {//倒计时小于0，不显示
			w.Emit(gameid,"get");
            return;
        }
		console.log(timeLeave);
        var oDate = diff(timeLeave);
        var ahour = fftime(oDate.hour).toString().split("");
        var aminute = fftime(oDate.minute).toString().split("");
        var asecond = fftime(oDate.second).toString().split("");
        //显示倒计时时间到页面上
        $('#time_h1').text(ahour[0]);
        $('#time_h2').text(ahour[1]);
        $('#time_m1').text(aminute[0]);
        $('#time_m2').text(aminute[1]);
        $('#time_s1').text(asecond[0]);
        $('#time_s2').text(asecond[1]);
		
        var timeShow = ahour[0] + ahour[1] + ':' + aminute[0] + aminute[1] + ':' + asecond[0] + asecond[1];
        $('span#count_down').text(timeShow);
    }, 1000);
}

//投注按钮
function doBetAdd() {
    try {
        sessionStorage.setItem('testv','testv');
    } catch(e) {
        $('.pop-win').hide();
        msgAlert('本地储存写入错误，请为Safari浏览器关闭无痕浏览模式。');
        return;
    }
    //不可重复点击
    if ($('.odds-btn-ture').attr('disabled') == 'disabled') {
        return;
    }
    $('.odds-btn-ture').attr('disabled', 'true');
    var subName = $('ul#sub_list a.beet-active').text();
    var posStr = '';
    $('input[name="position"]:checked').each(function () {
        if (posStr != '') {
            posStr += '|';
        }
        posStr += $(this).val();
    });
    var eachUnit = $('div.beet-money a.acitve').data('unit');
    var eachMoney = $('#bet_per_money').val();
    if (eachMoney == 0) {
        //设置提交可用
        /*$('.odds-btn-ture').removeAttr('disabled');
        return;*/
        eachMoney = 2;
    }
    eachMoney *= eachUnit;
    var betCode = $('#bet_code').val();
    if (posStr != '') {
        posStr = ',"betPos":"'+posStr+'"';
    }
	
    if (',41,42,'.indexOf(','+$('#game_id').val()+',') > -1) {//pcdd
        var betCodeArr = eval('('+betCode+')');
        for (var i in betCodeArr) {
            var curTime = new Date().getTime()+i;
            betJStr = '{"playId":"'+betCodeArr[i]['playId']+'","subId":"'+betCodeArr[i]['subId']+'","subName":"'+subName+'","betCode":"'+betCodeArr[i]['betCode']+'","betCount":"'
                +betCodeArr[i]['betCount']+'","betMoney":"'+betCodeArr[i]['betMoney']+'","betEachMoney":"'+betCodeArr[i]['betEachMoney']+'",'+'"betPrize":"'
                +betCodeArr[i]['betPrize']+'","betPrizeShow":"'+betCodeArr[i]['betPrize']+'","betReward":"'+0+'"}';
            sessionStorage['betlist['+curTime+']'] = betJStr;
            sessionStorage['gameid'] = $('#game_id').val();
            sessionStorage['gameperiod'] = $('#current_period').text();
            sessionStorage['totalmoney'] = $('#bet_money').text();
        }
    } else if (spid == 18) {
        var hzArr = {3:145,4:146,5:147,6:148,7:149,8:150,9:151,10:152,11:153,12:154,13:155,14:156,15:157,16:158,17:159,18:160};
        var hzPrize = $('#prize_true').val();//5:27.000,0.0%|7:10.800,0.0%
        hzPrize = hzPrize.toString().replace(/%/g, '');
        var hzPrizeArr = hzPrize.split('|');
        var hzCount = hzPrizeArr.length;
        var hzMoney = $('#bet_money_pop').text();
        for (var i = 0; i < hzCount; i++) {
            var betVal = hzPrizeArr[i].split(':');
            var betCode = betVal[0]; //投注号码
            betVal = betVal[1].split(',');
            var curTime = new Date().getTime()+i;
            betJStr = '{"playId":"'+playid+'","subId":"'+hzArr[betCode]+'","subName":"'+subName+'","betCode":"'+betCode+'","betCount":"'
                +1+'","betMoney":"'+(hzMoney/hzCount)+'","betEachMoney":"'+eachMoney+'",'+'"betPrize":"'
                +betVal[0]+'","betPrizeShow":"'+betVal[0]+'","betReward":"'+(betVal[1]/100)+'"}';
            sessionStorage['betlist['+curTime+']'] = betJStr;
            sessionStorage['gameid'] = $('#game_id').val();
            sessionStorage['gameperiod'] = $('#current_period').text();
            sessionStorage['totalmoney'] = $('#bet_money').text();
        }
    } else {
        var curTime = new Date().getTime();
        betJStr = '{"playId":"'+playid+'","subId":"'+spid+'","subName":"'+subName+'","betCode":"'+betCode+'","betCount":"'
            +$('#bet_count_pop').text()+'","betMoney":"'+$('#bet_money_pop').text()+'","betEachMoney":"'+eachMoney+'",'+'"betPrize":"'
            +$('#prize_true').val()+'","betPrizeShow":"'+$('#prize_show').val()+'","betReward":"'+$('#reward').val()+'"'+posStr+'}';
        sessionStorage['betlist['+curTime+']'] = betJStr;
        sessionStorage['gameid'] = $('#game_id').val();
        sessionStorage['gameperiod'] = $('#current_period').text();
        sessionStorage['totalmoney'] = $('#bet_money').text();
    }
    $('.pop-win').hide();
    //清除选号、注数金额
    step1Clear();
    showStep(2);
    if (',41,42,'.indexOf(','+$('#game_id').val()+',') > -1) {//pcdd
        loadBetListPCDD();
    } else {
        loadBetList();
    }
    $('.odds-btn-ture').removeAttr('disabled');
}

function shake(spid, isArr) {
    isArr = (isArr == undefined) ? true : false;
    if (',90,56,91,57,97,63,40,48,124,127,130,137,'.indexOf(','+spid+',') > -1) {//时时彩后三直选和值、直选跨度、组选和值,40:前二直选和值,48:前二组选和值
        var tmpArr = face[spid].no.split('|');
        var tmpI = Math.floor(Math.random() * tmpArr.length);//随机取个下标
        var codeArr = new Array();
        codeArr[0] = tmpArr[tmpI];
        return (isArr) ? codeArr : codeArr.join(sepOut).betTrim(spid);
    }
    if (spid == 1 || spid == 2 || spid == 228 || spid == 37) {//定位胆
        var codeArr = (spid == 1 ||spid == 2 || spid == 228) ? new Array('', '', '') : new Array('', '', '', '', '');
        var tmpI = Math.floor(Math.random() * codeArr.length);//随机取个下标
        var tmpArr = face[spid].no.split('|');
        var tmpI2 = Math.floor(Math.random() * tmpArr.length);//随机取个下标
        codeArr[tmpI] = tmpArr[tmpI2];
        return (isArr) ? codeArr : codeArr.join(sepOut);//.betTrim(spid);
    }
    if (spid > 144 && spid < 161) {//快三和值，单独处理
        var codeArr = new Array();
        var tmpI = Math.floor(Math.random() * 15);//随机值
        codeArr[0] = tmpI + 3;
        return (isArr) ? codeArr : codeArr.join(sepOut).betTrim(spid);
    }
    if (typeof (face[spid]['no']) == 'object') {
        var noArr = new Array();
        var nosArr = obj2arr(face[spid]['no']);
        for (var i = 0; i < nosArr.length; i++) {
            nosArr[i] = nosArr[i].split('|');
        }
    } else {
        var noArr = face[spid]['no'].split('|');
    }
    //var noArr = face[spid]['no'].split('|');
    var placeArr = face[spid]['place'].split('|');
    var codepos = face[spid]['codepos'];
    var codenum = face[spid]['codenum'];
    var codenum2 = face[spid]['codenum2'];
    var codeonly = face[spid]['codeonly'];
    if (',170,172,174,225,185,187,223,144,'.indexOf(','+spid+',') > -1) {//11选5的前三、二直选，pk10的前三、二直选、任选四组选4
        codeonly = 1;
    }
    if (spid == undefined || spid == 'undefined') {
        var codeArr = new Array('', '', '', '', '');
    } else {
    	if(!face.hasOwnProperty(spid))
    	{
    		for(var k in face)
    		{
    			if(spid>=k)
    			{
    				spid=k;
    			}    			
    		}    		
    	}
        var len = face[spid]['place'].split('|');
        len = len[len.length - 1];
        len = (len == undefined) ? 5 : parseInt(len) + 1;
        var codeArr = new Array();
        for (var i = 0; i < len; i++) {
            codeArr[i] = '';
        }
    }
    var curPosCount = 0;
    var curCodeNum = 0;
    if (typeof (codenum) == 'object') {
        var codeNumArr = obj2arr(codenum);
        codeNumArr = codeNumArr[0];//使用第一条配置
        var idxArr = new Array();
        for (var pos in codeNumArr) {
            codenum = codeNumArr[pos];
            var curCodeNum = 0;
            if (typeof (face[spid]['no']) == 'object') {
                noArr = nosArr[pos];
            }
            while (curCodeNum < codenum) {
                var tmpI = Math.floor(Math.random() * noArr.length);//随机取个下标
                if ((idxArr.join(',')).indexOf(tmpI) > -1) {//该号已选
                    continue;
                }
                if (codeArr[pos] == '' || !arrContains(codeArr[pos].split(sepIn), noArr[tmpI])) {
                    if (codeArr[pos] != '') {
                        codeArr[pos] += sepIn;
                    }
                    codeArr[pos] += noArr[tmpI];
                    idxArr[idxArr.length] = tmpI;
                    curCodeNum++;
                }
            }
        }
    } else if (spid == 1 || spid == 37 || spid == 198 || spid == 227) {//时时彩定位胆
        var tmpPlace = Math.floor(Math.random() * placeArr.length);//随机取个下标
        var tmpNo = Math.floor(Math.random() * noArr.length);//随机取个值
        codeArr[tmpPlace] = noArr[tmpNo];
    } else if (spid == 122 || spid == 128 || spid == 139) {//任二、三、四直选复式
        if (spid == 122) {
            var tmpPlaceArr = new Array('', '');
        } else if (spid == 128) {
            var tmpPlaceArr = new Array('', '', '');
        } else if (spid == 139) {
            var tmpPlaceArr = new Array('', '', '', '');
        }
        for (var i = 0; i < tmpPlaceArr.length; i++) {
            var tmpI = Math.floor(Math.random() * placeArr.length);//随机取个下标
            while (arrContains(tmpPlaceArr, tmpI)) {
                tmpI = Math.floor(Math.random() * placeArr.length);//随机取个下标
            }
            tmpPlaceArr[i] = tmpI;
            var tmpNo = Math.floor(Math.random() * noArr.length);//随机取个值
            codeArr[tmpI] = tmpNo;
        }
    } else {
        for (var i = 0; i < codeArr.length; i++) {
            //alert(i+':'+placeArr.join('|')+':'+curPosCount+':'+codepos);
            curCodeNum = 0;
            if (arrContains(placeArr, i) && curPosCount < codepos) {
                if (typeof (face[spid]['no']) == 'object') {
                    noArr = nosArr[i];
                }
                while (curCodeNum < codenum) {
                    var tmpI = Math.floor(Math.random() * noArr.length);//随机取个下标
                    if (codeonly == 1 && codeArr.join(sepOut).indexOf(noArr[tmpI]) > -1) {
                        continue;
                    }
                    if (codeArr[i] == '' || !arrContains(codeArr[i].split(sepIn), noArr[tmpI])) {
                        if (codeArr[i] != '') {
                            codeArr[i] += sepIn;
                        }
                        codeArr[i] += noArr[tmpI];
                        curCodeNum++;
                    }
                }
                curPosCount++;
                //alert('curPosCount:'+curPosCount);
            }
        }
    }
    //alert('玩法'+spid+'的随机注:'+codeArr);
    return (isArr) ? codeArr : codeArr.join(sepOut).betTrim(spid);
}

//获取投注号码
function getBetCode(isArr, spidBet) {
    isArr = (isArr == undefined || isArr == false) ? false : true;
    var liObjs = $('div.lot-number-top li, div.lot-number-bottom li');
    if (spid == 227) {//时时乐 定位胆
        var codeArr = new Array('', '', '', '', '', '', '', '', '', '');
    } else if (spid == undefined || spid == 'undefined') {
        var codeArr = new Array('', '', '', '', '');
    } else {
    	if(!face.hasOwnProperty(spid))
    	{
    		for(var k in face)
    		{
    			if(spid>=k)
    			{
    				spid=k;
    			}    			
    		}    		
    	}
        var len = face[spid]['place'].split('|');
        len = len[len.length - 1];
        len = (len == undefined) ? 5 : parseInt(len) + 1;
        var codeArr = new Array();
        for (var i = 0; i < len; i++) {
            codeArr[i] = '';
        }
    }
    for (var i = 0; i < liObjs.length; i++) {
        var reg = /^lt\_place\_(\d+)$/i;
        var arr = reg.exec($(liObjs[i]).attr('name'));
        var wei = arr[1];
        if ($(liObjs[i]).children('span').hasClass('ball-active')) {//选中
            var tmpCode = $(liObjs[i]).children('span').children('a').html();
            if (tmpCode == undefined) {
                tmpCode = $(liObjs[i]).children('span').html();
            }
            if (codeArr[wei] != '') {
                codeArr[wei] += sepIn;
            }
            codeArr[wei] += tmpCode;
        }
    }
    return (isArr == true) ? codeArr : codeArr.join(sepOut);
}

//验证号码规则
function doValidation(spid) {
    var betCodeArr = getBetCode(true);
    var codepos = 0;//face[spid]['codepos'];
    if(!face.hasOwnProperty(spid))
    	{
    		for(var k in face)
    		{
    			if(spid>=k)
    			{
    				spid=k;
    			}    			
    		}    		
    	}
    var codenum = face[spid]['codenum'];
    var codenum2 = face[spid]['codenum2'];
    var codeonly = face[spid]['codeonly'];
    var placeStr = face[spid]['place'].split('|');
    for (var i = 0; i < betCodeArr.length; i++) {
        var tmpCodeArr = new Array();
        if (betCodeArr[i].trim() != '') {
            tmpCodeArr = betCodeArr[i].split(sepIn);
        }
        //需要考虑codenum是不是数组
        if (placeStr.toString().indexOf(i) > -1 && codenum > -1 && tmpCodeArr.length < codenum) {//某个位上的号码不够
            //alert('test1:');
            return false;
        }
        var tmpCodeNum2 = (codenum2[i] == undefined) ? codenum2 : codenum2[i];
        if (tmpCodeNum2 > 0 && tmpCodeArr.length > tmpCodeNum2) {//某位上号码大于最大值
            //alert('test2');
            return '-1'+codeonly;
        }
        if (betCodeArr[i].trim() != '') {
            codepos++;
        }
    }

    //投注位置数是否足够
    if (codepos > 0 && codepos < face[spid]['codepos']) {
        //alert('test3');
        return false;
    }
    //检测一个号码不能在多个位置上选号
    if (codeonly == 1) {
        var tmpBetCodeStr = betCodeArr.join(',');
        if (spid == 167) {//快三,二同号单选
            var noArr = '1|2|3|4|5|6'.split('|');
            tmpBetCodeStr = tmpBetCodeStr.replace('11','1').replace('22','2').replace('33','3');
            tmpBetCodeStr = tmpBetCodeStr.replace('44','4').replace('55','5').replace('66','6');
        } else {
            var noArr = face[spid]['no'].split('|');
        }
        for (var i = 0; i < noArr.length; i++) {
            if (codeonly == 1 && countRepeat(tmpBetCodeStr, noArr[i]) > 1) {
                //alert('test4');
                return '-2';//false;
            }
        }
    }
    return true;
}

betEachMoney = 2;

function initSubPlay(spid) {
    //设置子玩法标题
    //$('span#play_name').html(playtype[playid][spid]);
    //var noArr = face[spid]['no'].split('|');
     if(!face.hasOwnProperty(spid))
    {
    	for(var k in face)
    	{
    		if(spid>=k)
    		{
    			spid=k;
    		}    			
    	}    		
    }
    try{
    	    var placeArr = (face[spid]['place'].indexOf('|') > -1 ) ? face[spid]['place'].split('|') : new Array(face[spid]['place']);
    }catch(e){
    	return;
    }
    var title = face[spid]['title'];
    var pos = face[spid]['pos'];
    var posTxt = '';
    if (typeof (pos) !== "undefined") {
        var posAry = pos.split('');
        var posLen = pos.length;
        posTxt += '<div class="bett-number2">';
        for (var i = 0; i < posLen; i++) {
            var chek = '';
            if (posAry[i] == 1) {
                chek = "checked";
            }
            posTxt += '<label><input onclick="$.positionClk()" id="position_' + i + '" name="position" value="' + i + '" type="checkbox" ' + chek + '>' + weiArr[i] + '</label>';
        }
        posTxt += '</div>';
    }
    var titleArr = new Array();
    if (typeof (title) == 'object') {
        titleArr = title;
    } else if (typeof (title) == 'string') {
        titleArr[0] = title;
    }
    var txtHtml = '';
    for (var i = 0; i < placeArr.length; i++) {
        var place = placeArr[i];
        var liHtml = '';
        if (typeof (face[spid]['no']) == 'object') {
            var liArr = face[spid]['no'][i].split('|');
        } else {
            var liArr = face[spid]['no'].split('|');
        }
        for (var j = 0; j < liArr.length; j++) {
            var tmpFont = '';
            if (spid == 162) {//快三的三同号单选
                tmpFont = 'style="font-size:16px;"';
            }
            liHtml += '<li name="lt_place_' + place + '" class="specific-cell-o code-value-' + liArr[j] + '"><span valplace="0" ' + tmpFont + '>' + liArr[j] + '</span></li>';
        }
        var lotTxt = weiArr[place];
        if (typeof (titleArr[place]) !== "undefined") {
            lotTxt = titleArr[place];
        }
        var txtFont = '';
        if (lotTxt.length > 3) {
            txtFont = 'style="font-size: 11px;"';
        }
        var codeType = (face[spid]['codetype'] == 'text') ? 'three-numball' : 'ball-red';
        txtHtml += '<div class="lot-number-top">'
                + '<div class="lot-number-left">'
                + '<div class="lot-txt" ' + txtFont + '>' + lotTxt + '</div>'
                + '</div>'
                + '<div class="lot-number-right">'
                + '<div class="ch_numball '+ codeType +'">'
                + '<ul class="place-value-' + placeArr[i] + '">'
                + liHtml
                + '</ul>'
                + '</div>'
                + '</div>'
                + '<div class="clear"></div>'
                + '</div>';
    }
    $('#lot_num').html(txtHtml);
    $('#lot_num').append(posTxt);
    loaded();
    //注数金额归零
    $('#bet_sel_count').text(0);
    $('#bet_sel_money').text(0);
}

function loadBetListPCDD() {
    var txtHtml = '';
    var storage = window.sessionStorage;
    var betListLen = 0;
    var totalCount = 0;
    var totalMoney = 0;
    var betArr = new Array();
    for (var i = 0, len = storage.length; i < len; i++) {
        var key = storage.key(i);
        if (key.indexOf('betlist') == -1) {
            continue;
        }
        //betListLen++;
        var val = storage.getItem(key);
        key = key.replace('betlist[','').replace(']','');
        var tmpIdx = betArr.length;
        betArr[tmpIdx] = eval('('+val+')');
        betArr[tmpIdx]['time'] = key;
    }
    betArr.bubbleSort();
    betListLen = betArr.length;
    for (var i = 0; i < betListLen; i++) {
        totalCount += parseInt(betArr[i]['betCount']);
        totalMoney += parseInt(betArr[i]['betMoney']);
        var showStr = betArr[i]['betCode'];
        var showPrize = betArr[i]['betPrize'];
        txtHtml += '<li class="bet-t-'+betArr[i]['time']+'">'
            + '<a href="javascript:void(0)" class="bet-close" data-t="'+betArr[i]['time']+'"></a>'
            + '<div class="bet-info-li">'
            + '<div class="bet-number">'
            + showStr
            + '</div>'
            + '<p>赔率:'+showPrize+'</p>'
            + '<p>'+betArr[i]['subName']+'</p>'
            + '</div>'
            + '<div class="bet-inp inp-add2">'
            + '<span>输入金额:</span>'
            + '<input class="money" data-t="'+betArr[i]['time']+'" data-count="'+betArr[i]['betCount']+'" data-money="'+betArr[i]['betMoney']+'" type="tel" inputmode="numeric" pattern="[0-9]"  maxlength="8" name="" value="'+((betArr[i]['betEachMoney'] == 0)? '' : betArr[i]['betEachMoney'])+'" placeholder="请输入金额"/>'
            + '<span>元 </span>'
            + '</div>'
            + '</li>';
    }
    //存储数据投注总注数、总金额
    storage['totalcount'] = totalCount;
    storage['totalmoney'] = totalMoney;
    $('span#bet_count').text(totalCount);
    $('span#bet_money').text(totalMoney);
    $('#bet_list').html(txtHtml);
    if (betListLen > 0) {
        $('#bet_time_count').text(betListLen);
        $('div.go-back').show();
    }
    reBindEach();
    bindDel('pcdd');
}

/* betlist 相关 */
function loadBetList() {
    var txtHtml = '';
    var storage = window.sessionStorage;
    var betListLen = 0;
    var totalCount = 0;
    var totalMoney = 0;
    var betArr = new Array();
    for (var i = 0, len = storage.length; i < len; i++) {
        var key = storage.key(i);
        if (key.indexOf('betlist') == -1) {
            continue;
        }
        //betListLen++;
        var val = storage.getItem(key);
        key = key.replace('betlist[','').replace(']','');
        var tmpIdx = betArr.length;
        betArr[tmpIdx] = eval('('+val+')');
        betArr[tmpIdx]['time'] = key;
    }
    //betArr.sort(function(a,b){return a.time<b.time;});//手机上失效
    betArr.bubbleSort();
    betListLen = betArr.length;
    for (var i = 0; i < betListLen; i++) {
        var posAry = {0:'万',1:'千',2:'百',3:'十',4:'个'};
        totalCount += parseInt(betArr[i]['betCount']);
        totalMoney += parseFloat(betArr[i]['betMoney']);
        var posStr = '';
        if (betArr[i]['betPos'] != undefined) {
            var posNumAry = betArr[i]['betPos'].split('|');
            for (var j = 0; j < posNumAry.length; j++) {
                if (posStr != '') {
                    posStr += ',';
                }
                posStr += posAry[posNumAry[j]];
            }
            posStr = '('+posStr+')';
        }
        var showCode = posStr+betArr[i]['betCode'];
        if (showCode.length > 21) {
            showCode = showCode.substr(0,21) + '...';
        }
        txtHtml += '<li class="bet-t-'+betArr[i]['time']+'">'
            + '<a href="javascript:void(0)" class="bet-close" data-t="'+betArr[i]['time']+'" data-money="'+betArr[i]['betMoney']+'" data-count="'+betArr[i]['betCount']+'"></a>'
            + '<div class="bet-info-li">'
            + '<div class="bet-number">'
            + showCode
            + '</div>'
            + '<p>赔率'+betArr[i]['betPrize']+'&nbsp;返利'+(betArr[i]['betReward']*100).toFixed(1)+'%</p>'
            + '<p>'+betArr[i]['subName']+' '+betArr[i]['betCount']+'注 '+betArr[i]['betMoney']+'元</p>'
            + '</div>'
            + '</li>';
    }
    //存储数据投注总注数、总金额
    totalMoney = totalMoney.toFixed(2).replace(/[0]+$/,'').replace(/\.$/,'');
    storage['totalcount'] = totalCount;
    storage['totalmoney'] = totalMoney;
    $('span#bet_count').text(totalCount);
    $('span#bet_money').text(totalMoney);
    $('#bet_list').html(txtHtml);
    if (betListLen > 0) {
        $('#bet_time_count').text(betListLen);
        $('div.go-back').show();
    }
    bindDel();
}

/* betlist 相关 */
function bindDel(type) {
    //$(document).on('click', 'a.bet-close, button.btn-none', function() {
    $('a.bet-close, button.btn-none').bind('touchend', function () {
        //$('a.bet-close, button.btn-none').click(function() {
        event.preventDefault();
        if ($(this).hasClass('btn-none')) {
            sessionStorage.clear();
            $('ul#bet_list').html('');
            $('span#bet_count').text(0);
            $('span#bet_money').text(0);
            $('i#bet_time_count').text(0);
        } else {
            if (type == 'pcdd') {
                var delKey = $(this).data('t');
                sessionStorage.removeItem('betlist['+delKey+']');
                $('li.bet-t-'+delKey).remove();
                var tmpCount = $(this).parent().find('input').data('count');
                $('span#bet_count').text(parseInt($('span#bet_count').text())-tmpCount);
                var tmpMoney = $(this).parent().find('input').val().trim();
                tmpMoney = (tmpMoney == '') ? 0 : tmpMoney;//单注金额
                tmpMoney = $('span#bet_money').text()-tmpMoney*tmpCount;//总金额
                $('span#bet_money').text(tmpMoney);
                sessionStorage.setItem('totalmoney',tmpMoney);
                tmpCount = sessionStorage.getItem('totalcount') - tmpCount;
                tmpCount = (tmpCount < 0) ? 0 : tmpCount;
                sessionStorage.setItem('totalcount',tmpCount);
                $('i#bet_time_count').text($('i#bet_time_count').text() - 1);
            } else {
                var delKey = $(this).data('t');
                sessionStorage.removeItem('betlist['+delKey+']');
                $('li.bet-t-'+delKey).remove();
                var tmpCount = $('span#bet_count').text()-$(this).data('count');
                var tmpMoney = $('span#bet_money').text()-$(this).data('money');
                tmpMoney = tmpMoney.toFixed(2).replace(/[0]+$/,'').replace(/\.$/,'');
                $('span#bet_count').text(tmpCount);
                sessionStorage.setItem('totalcount',tmpCount);
                $('span#bet_money').text(tmpMoney);
                sessionStorage.setItem('totalmoney',tmpMoney);
                $('i#bet_time_count').text($('i#bet_time_count').text() - 1);
            }
        }
        if ($('i#bet_time_count').text() < 1) {
            $('div.go-back').hide();
        }
    });
}

function betClear() {
    var storage = window.sessionStorage;
    for (var i = 0, len = storage.length; i < len; i++) {
        var key = storage.key(i);
        if (key.toString().indexOf('betlist') > -1) {
            storage.removeItem(key);
            len--;
            i--;
        }
    }
}

isBet = false;
isNext = false;
function doBet(next) {
    if (isNext) {//投注下一期只一次
        isNext = undefined;
        isBet = false;
        return;
    }
    isNext = (next == true) ? true : false;
    if (!isNext && isBet) {//投注只一次
        return;
    }
    isBet = true;
    next = (next == true) ? 1 : 0;
    /*if (betList == '' || betAmount == 0) {
     msgAlert('没有投注数据，请返回添加一注！');
     window.history.go(-1);
     return;
     }*/
    var betMore = $('#bet_more').val();
    betMore = (betMore == undefined || betMore == '') ? 1 : betMore;
	if (betMore > 100) {//追号投注，最大追期数100
       	msgAlert('最大追100期！');
		betMore=100;
		return;
    }
    if (betMore > 1) {//追号投注，需在服务端获取当前期数
        next = 1;
    }
    var betWinStop = $('#bet_win_stop').prop("checked") ? 1 : 0;
    //获取数组
    var storage = window.sessionStorage;
    var betlistArr = new Array();
    var betAllAmount = 0;
    var kIndex = 0;
    var isBetZero = false;//检查投注金额是否为0
    for (var i = 0, len = storage.length; i < len; i++) {
        var key = storage.key(i);
        if (key.indexOf('betlist') == -1) {
            continue;
        }
        /*var reg = /^betlist\[(\d+)\]$/i;
         var tmpArr = reg.exec(key);
         key = tmpArr[1];*/
        betlistArr[kIndex] = eval('(' + storage.getItem(key) + ')');
        betAllAmount += parseFloat(betlistArr[kIndex]['betMoney']);
        kIndex++;
        if (betlistArr[kIndex-1]['betMoney'] == 0) {
            isBetZero = true;
            break;
        }
    }
    var betGameId = storage['gameid'].trim();
    if (betGameId == null || betGameId == undefined || betGameId == '') {
        betGameId = $('#game_id').val();
    }
    if (isBetZero) {//pcdd
        msgAlert('单注金额不能为0');
        isBet = false;
        return;
    }
	
    loadingShow("加载中...");
	
    $.ajax({
        url: '/doBet/ajaxBet.html',
        type: 'POST',
        dataType: 'json',
        data: {
            game_id: betGameId,
            game_period: storage['gameperiod'],
            bet_next: next,
            amount: betAllAmount,
            bet_list: betlistArr,
            bet_more: betMore,
            bet_win_stop : betWinStop
        },
        timeout: 3000,
        success: function (data) {
			console.log(data);
            loadingHide();
            isBet = false;
            /*if (data.Result == false) {
                msgAlert(data.Desc);
                return false;
            }*/
			
            if (data.code == 200) {
                betClear();
                //storage['gameperiod'] = data.betPeriod;
                //$('span#bet_period').html(data.betPeriod);
                $('ul#bet_list').html('');
                $('#bet_sel_count').html(0);
                $('#bet_sel_money').html(0);
                betList = '';
                betCount = 0;
                betMoney = 0;
                $('i#bet_time_count').text(0);
                $('div.go-back').hide();
                showStep(3);
                return;
            } else {
				msgAlert(data.message);
				return;
                if (betMore < 2 && /当前期数已经关盘|本期已开奖/g.test(data.Desc)) {
                    confirmType = 1;
                    msgConfirm(storage['gameperiod'] + '期已经关盘,是否投注到下一期?',function doBetNext(){
                        doBet(true);
                    });
                    /*var reVal = confirm(gamePeriod+'期已经关盘,是否投注到下一期?');
                     if (reVal == true) {
                     doBet(true);
                     } else {
                     doDel(-1, 0, 0);
                     }*/
                } else {
                    isBet = false;
                    var tmpDesc = data.Desc;
                    if (/余额不足/g.test(tmpDesc)) {
                        confirmType = 2;
                        msgConfirm('抱歉，您的余额不足，是否前去充值？',function goCharge() {
                            location.href = '/deposit/index.html';
                        });
                        return false;
                    }
                    if (betMore > 1 && /已经关盘|已关盘/g.test(tmpDesc)) {//追号投注失败
                        tmpDesc = '因期数已关盘，该追号投注失败，请重新投注!';
                    }
                    msgAlert(tmpDesc);
                    //判断是否重新登陆
                    reLogin(data.Desc);
                    return false;
                }
            }
        }
    });
    return;
}

function step1Clear() {
    $('ul li.specific-cell-o span').removeClass('ball-active');
    $('#bet_sel_count').text(0);
    $('#bet_sel_money').text(0);
}

$(function () {
    $('#bet_per_money').keyup(function () {
    //$('#bet_per_money').bind('touchend', function () {
        //event.preventDefault();
        var tmpVal = $(this).val().trim();
        if (/[0-9]{1,}/g.test(tmpVal)) {
            tmpVal = parseInt(tmpVal);
            $(this).val(tmpVal);
        } else {
            tmpVal = 2;
            $(this).val('');
        }
        if (tmpVal == 0) {
            tmpVal = 2;
            $(this).val('');
        }

        if (',10,11,16,17,'.indexOf($('#game_id').val()) > -1 && spid == 18) {//快三和值
            setKsSlide($('#slider-range-min').slider('value'));
            return;
        }
        //设置金额
        var unit = $('a.money-unit').filter('a.acitve').data('unit');
        var money = $('#bet_count_pop').text() * tmpVal * unit;
        var prizeMoney = $('#prize').val() * tmpVal * unit;
        $('#bet_money_pop').text(parseFloat(money.toFixed(3)));
        $("#prize_money").text(parseFloat(prizeMoney.toFixed(3)));
        setSlide(spid, $('#slider-range-min').slider('value'));
    });

    //单位按钮
    //$('.money-unit').click(function () {
    $('.money-unit').bind('touchend', function () {
        event.preventDefault();
        $('.money-unit').removeClass('acitve');
        $(this).addClass('acitve');
        if (',10,11,16,17,'.indexOf($('#game_id').val()) > -1 && spid == 18) {//快三和值
            setKsSlide($('#slider-range-min').slider('value'));
            //event.preventDefault();
            return;
        }
		
        var eachMoney = $('#bet_per_money').val();
        eachMoney = (eachMoney == null || eachMoney == undefined || eachMoney == '' || eachMoney == 0) ? 2 : eachMoney;
        var unit = $('a.money-unit').filter('a.acitve').data('unit');
        var money = $('#bet_count_pop').text() * eachMoney * unit;
        var prizeMoney = $('#prize').val() * eachMoney * unit;
        $('#bet_money_pop').text(parseFloat(money.toFixed(3)));
        $("#prize_money").text(parseFloat(prizeMoney.toFixed(3)));
        setSlide(spid, $('#slider-range-min').slider('value'));
        //event.preventDefault();
    });

    //返回购彩清单按钮
    //$('div.go-back').click(function() {
    /*$('div.go-back').bind('touchend', function () {
        //$(this).hide();
        event.preventDefault();
        var tmpUrl = '/bet/betList.html?bet_url='+location.href.replace(/\?/g,'&');
        if (/his\_idx\=[0-9]+/g.test(tmpUrl)) {
            tmpUrl = tmpUrl.replace(/his\_idx\=[0-9]+/g, 'his_idx='+(parseInt($('#his_idx').val())+1));
        } else {
            tmpUrl = '/bet/betList.html?bet_url='+location.href+'&his_idx='+(parseInt($('#his_idx').val())+1);
        }
        location.href = tmpUrl;
    });*/

    var codeInit = $('#code_init').val();
    if (codeInit != undefined && codeInit != '') {
        $('#code_init').val('');
        $.mobileShake(codeInit);
    }

    //判断是否有可用玩法
    if ($('ul#play_list').html().trim() == '') {
        var tmpGameName = $('#game_name').val().trim();
        if (tmpGameName == undefined || tmpGameName == null || tmpGameName == '') {
            tmpGameName = '该彩种';
        }
        msgAlert(tmpGameName+'没有可用玩法，请联系在线客服！',function () {
            $('button#reveal-left').click();
        });
    }

});



/*
 * 用法 ： _confim("确定")    _confim("提示文字的内容",function(){alert("点击了确认")},function(){alert("点击了取消")})
 * */
try{
     //自定义confim
        window._confim = function(content_,okFun_,cancelFun_){
            var content,title,okFun;
            if ( ! ( typeof content_ == "string" || typeof content_ == "number") ) {
                content = "温馨提示";
            }else{
                content = content_;
            }
            if ( ! ( typeof title_ == "string" || typeof title_ == "number") ) {
                title = "温馨提示";
            }else{
                title = title_;
            }
            if(  ! (okFun_ instanceof Function)  ){
                okFun_ = function(){};
            }
            if(  ! (cancelFun_ instanceof Function)  ){
                cancelFun_ = function(){};
            }
            window.___okFun_confim = okFun_;
            window.___cFun_confim = cancelFun_;
            var newDom = document.getElementById("_confim_");
            if( !newDom )
            {
                var htmlStr = "<div id=\"_confim_\"><div class=\"_confim_\"><div class=\"title\"><span></span><div class=\"btn_close\"><span></span></div></div><p></p><div class=\"btn_div\"><button class=\"btn_ok\">确定</button><button class=\"btn_cancel\">取消</button></div></div></div>";
                $("body").append(htmlStr);
                $("#_confim_  .title .btn_close,#_confim_ .btn_cancel").click(function(){//取消执行的函数
                    ___cFun_confim();
                    $("#_confim_").css("display","none");
                    $("#_confim_ ._confim_").removeClass("anim");
                    delete  window.___cFun_confim;
                    try{if(event.preventDefault){event.preventDefault();}else{event.returnValue = false;}}catch(e){}
                });
                $("#_confim_ .btn_ok").click(function(){//确定执行的函数
                    ___okFun_confim();
                    $("#_confim_").css("display","none");
                    $("#_confim_ ._confim_").removeClass("anim");
                    delete  window.___okFun_confim;
                    try{if(event.preventDefault){event.preventDefault();}else{event.returnValue = false;}}catch(e){}
                });
            }
            $("#_confim_  ._confim_>p").html(content);
            $("#_confim_").show();
            $("#_confim_  ._confim_").addClass("anim");
            $("#_confim_  .title>span").text(title);
        };
}catch( e ){ console.log(e); }