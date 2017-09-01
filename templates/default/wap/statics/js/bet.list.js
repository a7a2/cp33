
function showDetail(key) {
    var detail = $('a.'+key).data('detail');
    if (detail == undefined || detail == null || detail == '') {
        return;
    }
    var reg = /close=([0-9]*)/;
    var arr = detail.match(reg);
//    if ($('a.'+key).data('needrevoke') == 0 || arr[1] != 0) {//已关盘或已开奖
//        location.href = '/mine/betDetail.html?'+detail;
//        showStep('list');
//        $('div.beet-tips').hide();
//        return;
//    }
    var posText = '';
    var gameid = '';
    var gname = '';
    var pname = '';
    var subid = '';
    var period = '';
    var opennum = '';
    var winamount = '';
    var codeArr = '';
    var reward = '';
    var win = '';
    var close = '';
    var key = '';
    var status = '';
    var detailArr = detail.split('&');
    for (var i = 0; i < detailArr.length; i++) {
        var tmpArr = detailArr[i].split('=');
        if (tmpArr[0] == 'reward') {
            tmpArr[1] = (tmpArr[1]*100).toFixed(1)+'%';
        }
        $('span#bet_'+tmpArr[0]).text(tmpArr[1]);
        switch (tmpArr[0]) {
            case 'pos':
                posText = tmpArr[1];
                break;
            case 'gid':
                gameid = tmpArr[1];
                break;
            case 'subid':
                subid = tmpArr[1];
                break;
            case 'code':
                codeArr = tmpArr[1];
                break;
            case 'period':
                period = tmpArr[1];
                break;
            case 'gname':
                gname = tmpArr[1];
                break;
            case 'pname':
                pname = tmpArr[1];
                break;
            case 'opennum':
                opennum = tmpArr[1];
                break;
            case 'winamount':
                winamount = tmpArr[1];
                break;
            case 'win':
                win = tmpArr[1];
                break;
            case 'close':
                close = tmpArr[1];
                break;
            case 'key':
                key = tmpArr[1];
                break;
            case 'status':
                status = tmpArr[1];
                break;
            default:
            // ...
        }
    }
    //显示投注号码
    //开奖号码
    if (',9,52'.indexOf(','+gameid+',') > -1) {
        $('div#open_num').addClass('num-more');
    } else {
        $('div#open_num').removeClass('num-more');
    }
    var showOpen = '';
	
    if(opennum != undefined && opennum != null && opennum != '') {
        var openArr = opennum.split(' ');
        if(gameid == 41 || gameid == 42) {
            showOpen = openArr[0]+' + '+openArr[1]+' + '+openArr[2]+' + '+openArr[3];
        } else {
            for (var tmp in openArr) {
                showOpen += '<span>'+tmp+'</span>';
            }
        }
    } else {
        showOpen = '未开奖';
    }
    $('div#open_num').html(showOpen);
    //已中奖
    $('div#win_amt span').text('已中奖，赢'+winamount+'元');
    if (/[0-9\.]+/.test(winamount) && winamount > 0) {
        $('div#win_amt').show();
    } else {
        $('div#win_amt').hide();
    }
    $('img#game_logo').attr('src',resUrl+'/images/icon/'+gameid+'.png');
    $('span.f120').text(gname);
    $('span.f80').text('第'+period+'期');
    if (/undefined/g.test(posText)) {
        posText = '';
    }
    posText = (posText == '') ? '' : '('+posText+')';
    var weiArr = {0:'万位',1:'千位',2:'百位',3:'十位',4:'个位'};//时时彩
    if (gameid == 18) {
        codeArr = codeArr.replace(/and/g,'&').replace(/or/g,'|');
        txtHtml = '<li><div>'+pname+':'+codeArr+posText+'</div></li>';
        $('ul#code').html(txtHtml);
        //return;
    }
    if (',2,3,10,11,16,17,'.indexOf(','+gameid+',') > -1) {
        weiArr = {0: '百位', 1: '十位', 2: '个位'};//快三、福体彩
    } else if (',12,13,14,15,28,'.indexOf(','+gameid+',') > -1) {
        weiArr = {0: '第一位', 1: '第二位', 2: '第三位', 3: '第四位', 4: '第五位'};//11选5、幸运农场
    } else if (',9,52,'.indexOf(','+gameid+',') > -1) {
        weiArr = {0: '冠军', 1: '亚军', 2: '季军', 3: '第四位', 4: '第五位'};//pk10
    }
    if (subid >= 145 && subid <= 160) {
        subid = 145;
    } else if (subid >= 41000 && subid <= 41027) {//北京28特码
        subid = 41000;
    } else if (subid >= 41201 && subid <= 41210) {//北京28混合
        subid = 41201;
    } else if (subid >= 41301 && subid <= 41303) {//北京28波色
        subid = 41301;
    }
    //var jsFaceArr = {1:'s3',2:'s3',3:'s3',4:'4',5:'4',6:'4',7:'4',9:'7',10:'6',11:'6',12:'7',
    //    13:'7',14:'7',15:'7',16:'6',17:'6',28:'15',41:'41',42:'41',51:'4',52:'7'};

    if (',1,4,6,7,51,'.indexOf(','+gameid+',') > -1) {//4
        var titleArr = face4[subid]['title'];
        var placeArr = face4[subid]['place'].split('|');
    } else if (',10,11,16,17,'.indexOf(','+gameid+',') > -1) {//6
        var titleArr = face6[subid]['title'];
        var placeArr = face6[subid]['place'].split('|');
    } else if (',9,12,13,14,15,52,'.indexOf(','+gameid+',') > -1) {//7
        var titleArr = face7[subid]['title'];
        var placeArr = face7[subid]['place'].split('|');
    } else if (',2,3,'.indexOf(','+gameid+',') > -1) {//s3
        var titleArr = faces3[subid]['title'];
        var placeArr = faces3[subid]['place'].split('|');
    } else if (',41,42,'.indexOf(','+gameid+',') > -1) {//41
        var titleArr = face41[subid]['title'];
        var placeArr = face41[subid]['place'].split('|');
    }
    titleArr = (typeof (titleArr) == 'string') ? new Array(titleArr) : titleArr;
    var txtHtml = '';
    if (gameid == 18) {
        codeArr = codeArr.replace(/and/g,'&').replace(/or/g,'|');
        txtHtml = '<li><div>'+pname+':'+codeArr+posText+'</div></li>';
    } else {
        codeArr = codeArr.split('or');
        for (var i = 0; i < placeArr.length; i++) {
            var tmpWei = (titleArr != undefined && titleArr[i] != undefined) ? titleArr[i] : weiArr[placeArr[i]];
            if (gameid == 41 || gameid == 42) tmpWei = "选码";
            if (codeArr[i] == undefined || codeArr[i] == '') {
                continue;
            }
            txtHtml += '<li><div>'+tmpWei+'：'+posText+codeArr[i].replace(/and/g, ',')+'</div></li>';
        }
    }
    $('ul#code').html(txtHtml);
    //取消、返回
    if ($('a.'+key).data('needrevoke') == 0 || close != 0 || ',1,2,3,'.indexOf(','+win+',') > -1) {
        $('button.order-btn').data('key','');
        $('button.order-btn').data('gid',gameid);
        $('button.order-btn').text('再来一注');
    } else {
        $('button.order-btn').data('key',key);
        $('button.order-btn').text('取消投注');
    }
    //状态

    if (status == 0) {
        status = '未开奖1';
    }
	if (win) {
        status = '中奖';
    }else {
        status = '未中奖';
    }
    $('span#bet_status').text(status);
    $('span#bet_close').text((close == '' || close == 0) ? '否' : '是');
}

function doConfirmOk() {
    var key = $('#revokeKey').val();
    loadingShow();
    $.ajax({
        url: '/mine/ajaxRevoke.html',
        type: 'POST',
        dataType: 'json',
        data: {
            'key' : key
        },
        timeout: 3000,
        success: function (data) {
            loadingHide();
            $('#revokeKey').val('');
            if (data.Code != 200) {
                if (/未登陆/g.test(data.message)) {
					location.href = '/index/login.html?platform='+getCookie("platform");
                }
                msgAlert(data.Desc);
       //         reLogin(data.Desc);
                return;
            }
            $('span#win_state').text('手动退码');
            //改页面参数
            $('a.'+key).data('needrevoke','0');
            $('a.'+key).data('detail',$('a.'+key).data('detail').replace(/status=[0-9]*/g,'status=2').replace(/win=[0-9]*/g,'win=2'));
            $('a.'+key+' div.c-gary span').text('已取消');
            showStep('revokeok');
        }
    });
}

function initLoading() {
    $('a.on-more').hide();
    $('div.mine-message').hide();
}

function getCookie(name)
{
var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
if(arr=document.cookie.match(reg))
return unescape(arr[2]);
else
return null;
}

function getBetList(more) {//1:更多，2:充值
    if (more == 1) {
        pageIndex++;
    } else if (more == 2) {
        pageIndex = 1;
    }
    var weiArr = {0:'万',1:'千',2:'百',3:'十',4:'个'};
    loadingShow();
    $('a.on-more').html("正在获取数据中..");
    $.ajax({
        url: '/mine/ajaxBetList.html',
        type: 'POST',
        dataType: 'json',
        data: {
            'orderType' : orderType,
            'pageIndex' : pageIndex
        },
        timeout: 3000,
        success: function (data) {
            $('ul#bet_list li.loading').remove();
            if (data.code != 200) {
                msgAlert(data.message);
				if (/未登陆/g.test(data.message)) {
					location.href = '/index/login.html?platform='+getCookie("platform");
                }
				
               // reLogin(data.message);
                return;
            }
            var txtHtml = '';
			
            for (var i = 0;data.data!=null && data.data.Records!=null && i < data.data.Records.length; i++) {
                var betCode = data.data.Records[i].BetCode.replace(/\&/g,'and');
                betCode = betCode.replace(/\|/g,'or');
                var posArr = (data.data.Records[i].BetPos == 'null' || data.data.Records[i].BetPos == undefined || data.data.Records[i].BetPos == '') ? '' : data.data.Records[i].BetPos.split('&');

                var posText = '';
                if (posArr != '' && posArr.length > 0) {
                    for (var j = 0; j < posArr.length; j++) {
                        if (posText != '') {
                            posText += ',';
                        }
                        posText += weiArr[posArr[j]]+'位';
                    }
                    posText = '(' + posText + ')';
                }
                var subName = data.data.Records[i].GroupName;
                var subType = data.data.Records[i].SubName;

                if (',10,11,16,17,'.indexOf(','+data.data.Records[i].PlayId+',') > -1 && subName == '和值') {
                    subType = '和值';
                } else if (data.data.Records[i].PlayId == 18) {//六合彩
                    if (/^(特码|正码)$/g.test(subName)) {
                        subType = (/^[0-9]{1,}$/.test(subType)) ? '选码' : '其他';
                        if (subName == '特码' && subType == '选码') {
                            subName += (data.data.Records[i].BetReward == 0) ? 'B' : 'A';
                        }
                    } else if (/^(色波|半波|半半波)$/g.test(subName)) {
                        subType = subName;
                        subName = '色波';
                    } else if (/头尾数/g.test(subName)) {
                        subType = subName;
                    } else if (/^(特|正)肖$/g.test(subName)) {
                        subType = '生肖';
                    } else if (/^正(一|二|三|四|五|六)特$/g.test(subName)) {
                        subType = (/^[0-9]{1,}$/.test(subType)) ? subName : subName.replace('特', '')+'大小';
                    } else if (/^正码(一|二|三|四|五|六)$/g.test(subName)) {
                        subType = subName;
                    } else if (/^(五行|总肖)$/g.test(subName)) {
                        subType = '种类';
                    } else if (/^平特(一肖|尾数)$/g.test(subName)) {
                        subType = subName.substr(2);
                    } else if (/^7色波$/g.test(subType) || /^7色波$/g.test(subName)) {
                        subName = '7色波';
                        subType = '种类';
                    } else if (/^(二|三|四|五|六)连(肖|尾)$/g.test(subName)) {
                        subType = subName;
                    } else if (/^(自选不中|合肖)$/g.test(subName)) {
                        subType = subType;
                    }
                }
                if (data.data.Records[i].PlayId == 41 || data.data.Records[i].PlayId == 42){
                    if(data.data.Records[i].PlayId >= 41000 && data.data.Records[i].PlayId <= 41027){
                        var pName = subName+'-特码';
                    }else if (data.data.Records[i].PlayId == 41127){
                        var pName = subName+'-特码包三';
                    }else{
                        var pName = subName;
                    }
                }else {
                    var pName = subName+'-'+subType;
                }
				var close1="是";
				if (data.data.Records[i].Status==0){
					var close1="否";
				}
				
                var tmpPrize = data.data.Records[i].BetPrize;
//                tmpPrize = (data.data.Records[i].BetPrize != 0) ? tmpPrize+'|'+data.data.Records[i].BetPrize : tmpPrize;
//                tmpPrize = (data.data.Records[i].BetPrize != 0) ? tmpPrize+'|'+data.data.Records[i].BetPrize : tmpPrize;
//                tmpPrize = (data.data.Records[i].BetPrize != 0) ? tmpPrize+'|'+data.data.Records[i].BetPrize : tmpPrize;
				var detail = 'oid='+data.data.Records[i].Id+'&money='+data.data.Records[i].Amount
                    +'&count='+data.data.Records[i].BetCount+'&prize='+tmpPrize
                    +'&reward='+data.data.Records[i].BetReward+'&time='+data.data.Records[i].Ctime
                    +'&win='+data.data.Records[i].IsWin+'&pname='+pName
                    +'&code='+betCode+'&subid='+data.data.Records[i].SubId
                    +'&gname='+data.data.Records[i].GameName+'&winamount='+data.data.Records[i].WinAmount
                    +'&period='+data.data.Records[i].GamePeriod+'&opennum='+data.data.Records[i].OpenNum
                    +'&close='+close1+'&status='+data.data.Records[i].Status
                    +'&gid='+data.data.Records[i].GameId+'&pos='+posText
                    +'&key='+data.data.Records[i].Id;

				var tmpStatus = '未开奖';
               	if (data.data.Records[i].Status == 2) {
                   tmpStatus = '已取消';
                } else if (data.data.Records[i].Status ==1) {//已结算
                    if (data.data.Records[i].IsWin == false) {//未中
                       tmpStatus = '未中奖';
                    } else if (data.data.Records[i].IsWin == true) {//中
                        tmpStatus = '<span style="color: #00bf16;">赢'+data.data.Records[i].WinAmount+'元</span>';
                    }
                }
     
                txtHtml += '<li>'
                    + '<a href="javascript:showStep(\'detail\',\''+data.data.Records[i].Id+'\')" data-detail="'+detail+'" data-needrevoke="'+((tmpStatus == '未开奖') ? 1 : 0)+'" class="'+data.data.Records[i].Id+'">'
                    + '<div class="order-list-tit">'
                    + '<span class="fr c-red">-'+data.data.Records[i].BetMoney+'元</span><span class="order-top-left">'+data.data.Records[i].GameName+'</span>第'+data.data.Records[i].GamePeriod+'期'
                    + '</div>'
                    + '<div class="c-gary"><span class="fr">'+tmpStatus+'</span><p class="order-time">'+data.data.Records[i].Ctime+'</p></div>'
                    + '</a>'
                    + '</li>';
            }
            if (data.data==null || data.data.Records==null || 0 >= data.data.Records.length) {
               $('div.mine-message').show();
            } else {
                $('div.mine-message').hide();
            }
            if (more == 2) {//刷新
                $('ul#bet_list').html(txtHtml);
            } else {
                $('ul#bet_list').append(txtHtml);
            }
			
            $('a.on-more').html("点击加载更多");
            if (data.data!=null && data.data.PageCount!=null && data.data.PageCount > pageIndex) {
                $('a.on-more').show();
            } else {
                $('a.on-more').hide();
            }
            loadingHide();
            // loaded(); //解决iscroll自带 bug (bugID=1858)
        }
    });
}

$(function () {
    $('div.ui-bett-refresh').click(function() {
        initLoading();
        getBetList(2);
    });

    $('a.on-more').click(function() {
        getBetList(1);
    });

    $('div.beet-tips a').click(function() {
        $('div.beet-tips a').removeClass('beet-active');
        $('div.beet-tips').hide();
        $(this).addClass('beet-active');
        $('span#order_type').text($(this).text());
        orderType = $(this).data('type');
        initLoading();
        getBetList(2);
    });

    $('div.bett-top').click(function(event) {
        if (onlyWin == 1) {
            event.stopPropagation();
            getBetList();
        }
    });

    $('button.order-btn').click(function() {
        var key = $(this).data('key');
        if (key != undefined && key != null && key != '') {
            $('#revokeKey').val(key);
            msgConfirm('是否确认要撤单？');
        } else {//非撤单，显示详情
            return;
            var gameid = $(this).data('gid');
            var gArr = {1:'fcsd',2:'tcps',3:'ssl',4:'tjssc',5:'cqssc'
                ,6:'jxssc',7:'xjssc',8:'',9:'pk10',10:'jsks'
                ,11:'ahks',12:'elevensd',13:'elevensh',14:'elevenjx',15:'elevengd'
                ,16:'jlks',17:'gxks',28:'xync',41:'xy28',42:'xjp28',51:'sfc',52:'twpk10'};
            var op = gArr[gameid];
            var url = '/bet/'+op+'.html';
            if (gameid == 18) {
                url = '/betSix/index.html';
            }
            if (op == undefined && gameid != 18) {
                return;
            }
            location.href = url;
            showStep('list');
        }
    });

    getBetList();
});