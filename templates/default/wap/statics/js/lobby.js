
$(function() {
    //getLastResult();
    getNextPeriod();
});

function getLastResult() {
    $.ajax({
        url: '/draw/ajaxResultList.html',
        type: 'POST',
        dataType: 'json',
        data: {
        },
        timeout: 30000,
        success: function (data) {
            if (data.Result == false) {
                msgAlert(data.Desc);
                reLogin(data.Desc);
                return;
            }
            if (!data.Result || data.RecordCount <= 0) {
                return;
            }
            var txtHtml = '';
            for (var i = 0; i < data.RecordCount; i++) {
                var gid = data.Records[i].iGameId;
                if (nowIds.indexOf(','+gid+',') == -1) {
                    continue;
                }
                var period = data.Records[i].sGamePeriod;
                var opennum = data.Records[i].sOpenNum;
                if (',41,42,'.indexOf(','+gid+',') > -1) {
                    if (opennum != undefined && opennum != '') {
                        opennum = opennum.split('|');
                        opennum = opennum[0]+' + '+opennum[1]+' + '+opennum[2]+' = '+opennum[3];
                    } else {
                        opennum = '正在开奖';
                    }
                } else {
                    opennum = (opennum == undefined || opennum == '') ? '正在开奖' : opennum.replace(/\|/g, ' ');
                }
                if('第'+period+'期' == $('span.last_period_'+gid).text()){
                    $('p.last_open_'+gid).text(opennum);
                }
                //$('span.last_period_'+gid).text('第'+period+'期');
                //$('p.last_open_'+gid).text(opennum);
            }
        }
    });
}

//获取下一期相关数据
lefttimes = {1:'0',2:'0',3:'0',4:'0',5:'0',7:'0',9:'0',
    10:'0',11:'0',12:'0',13:'0',14:'0',15:'0',16:'0',17:'0',18:'0',28:'0',41:'0',42:'0',51:'0',52:'0'};
isCanGetNext = true;
function getNextPeriod(all) {
    if (!isCanGetNext) {
        return;
    }
    isCanGetNext = false;
    var param = '';
    for (var k in lefttimes) {
        if (all != 1 && lefttimes[k] > 1) {
            continue;
        }
        if (param != '') {
            param += ',';
        }
        param += k;
    }
    $.ajax({
        url: '/bet/ajaxNextPeriod.html',
        type: 'POST',
        dataType: 'json',
        data: {
            'gid': param
        },
        timeout: 30000,
        success: function (data) {
            if (data.Result == false) {
                if (data.Desc != undefined && data.Desc.trim() != '') {
                    msgAlert(data.Desc);
                }
                reLogin(data.Desc);
                return;
            }
            if (data.Result == true && data.RecordCount > 0) {
                for (var j = 0; j < data.RecordCount; j++) {
                    var gid = data.Records[j].iGameId;
                    if (nowIds.indexOf(','+gid+',') == -1) {
                        continue;
                    }
                    //$('div.erect-right-'+gid).data('time', data.Records[j].iCloseTime);
                    if (data.Records[j].iStartTime > 0){
                        lefttimes[gid] = data.Records[j].iStartTime;
                        $('p#hot_start_'+gid).css("visibility","visible");
                        $('span.last_period_'+gid).text('即将开盘...');
                        $('span.last_period_'+gid).addClass("start_period");
                        $('span.last_period_'+gid).addClass("last_per_iod_"+gid);
                        $('span.last_per_iod_'+gid).removeClass('last_period_'+gid);
                        $('span#period_show_status_'+gid).text("开盘");
                    }else{
                        lefttimes[gid] = data.Records[j].iCloseTime;
                        $('p#hot_start_'+gid).css("visibility","hidden");
                        if ($('span.last_period_'+gid).length == 1){
                            $('span.last_period_'+gid).text('第'+data.Records[j].sGamePeriodPrior+'期');
                        }else{
                            $('span.last_per_iod_'+gid).removeClass("start_period");
                            $('span.last_per_iod_'+gid).addClass("last_period_"+gid);
                            $("span.last_period_"+gid).removeClass('last_per_iod_'+gid);
                            $('span.last_period_'+gid).text('第'+data.Records[j].sGamePeriodPrior+'期');
                        }
                        $('span#period_show_status_'+gid).text("截止");
                    }
                    $('span.period_show_'+gid).text(data.Records[j].sGamePeriod);
                    //$('div.erect-right-'+gid+' span.period_show').text(data.Records[j].sGamePeriod);
                    //上一期信息

                    var lastnum = data.Records[j].sOpenNumPrior;
                    if (',41,42,'.indexOf(','+gid+',') > -1) {
                        if (lastnum != undefined && lastnum != '') {
                            lastnum = lastnum.split('|');
                            lastnum = lastnum[0]+' + '+lastnum[1]+' + '+lastnum[2]+' = '+lastnum[3];
                        } else {
                            lastnum = '正在开奖';
                        }
                    } else {
                        lastnum = (lastnum == undefined || lastnum == '') ? '正在开奖' : lastnum.replace(/\|/g, ' ');
                    }
                    if(data.Records[j].iStartTime > 0){
                        $('p.last_open_'+gid).html("&nbsp;");
                    }else{
                        $('p.last_open_'+gid).text(lastnum);
                    }
                }
                if (all != 1) {
                    setLeaveTimer();
                }
            } else {
                //alert('错误信息:' + data.Desc);
            }
            isCanGetNext = true;
            if (firstPage != 1) {
                loaded();
            }
            //getLastResult();
        }
    });
}

runSec = 1;//定时器运行了多少秒
objList = '';//时间显示jqery对象
timeLeave = 0; //倒计时剩余时间
localTime = 0;//最后一次倒计时的本机时间（毫秒）
isTimerStarted = false;//是否启动了定时器
function setLeaveTimer() { //启动定时，进行倒计时。
    if (isTimerStarted) {
        return;
    }
    isTimerStarted = true;
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

    //timeLeave = 0//倒计时总秒数
    clearInterval(timerno);//删除定时器
    var timerno = window.setInterval(function () {
        if (firstPage != 1 && runSec < 271) {
            if (runSec%50 == 0) {
                getLastResult();
            }
            runSec++;
        }
        var tmpLocalTime = new Date().getTime() + 0;//本机毫秒数
        if (localTime > 0 && (tmpLocalTime-localTime) > 3000) {//倒计时已不准确，重新获取倒计时
            getNextPeriod(1);
        }
        localTime = tmpLocalTime;
        //对所有倒计时遍历，重新赋值
        if (objList == undefined || objList == '') {
            objList = (firstPage == 1) ? $('div.hot-list-text') : $('div.erect-right');
        }
        for (var i = 0; i < objList.length; i++) {
            //var tmpTimeLeave = $(objList[i]).data('time');
            var tmpGid = $(objList[i]).data('gid');
            if (nowIds.indexOf(','+tmpGid+',') == -1) {
                continue;
            }
            var tmpTimeLeave = lefttimes[tmpGid];
            if (tmpTimeLeave > -1) {
                tmpTimeLeave--;
            }
            lefttimes[tmpGid] = tmpTimeLeave;
            if (isCanGetNext && tmpTimeLeave == 0) {
                getNextPeriod();
                continue;
            }
            tmpTimeLeave = (tmpTimeLeave == undefined || tmpTimeLeave == '') ? 0 : tmpTimeLeave;
            var oDate = diff(tmpTimeLeave);
            var ahour = fftime(oDate.hour).toString().split("");
            var aminute = fftime(oDate.minute).toString().split("");
            var asecond = fftime(oDate.second).toString().split("");
            var timeShow = ahour[0] + ahour[1] + ':' + aminute[0] + aminute[1] + ':' + asecond[0] + asecond[1];
            //$(objList[i]).data('time', tmpTimeLeave);
            //lefttimes[tmpGid] = tmpTimeLeave;
            if (typeof(showLeaveTime) == "function") {//eval(
                showLeaveTime(tmpGid, timeShow);
                continue;
            }
            if (firstPage == 1 || gameShowType == 1) {//列表显示
                $('span.time_show_1_'+tmpGid).text(timeShow);
                //$('div.erect-right-'+tmpGid+' span.time_show').text(timeShow);
            } else {//宫格显示
                $('span.time_show_2_'+tmpGid).text(timeShow);
            }
        }
    }, 1000);
}