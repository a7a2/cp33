
playtype = {7: {107: '直选复式'},
    8: {105: '直选复式'},
    11: {88: '直选复式', 92: '后三组合', 90: '直选和值', 91: '直选跨度', 93: '组三复式', 94: '组六复式',
        97:'组选和值',99:'组选包胆',101: '和值尾数', 102:'特殊号'},//后三
    9: {54: '直选复式', 58: '前三组合', 56: '直选和值', 57: '直选跨度', 59: '组三复式', 60: '组六复式',
        63:'组选和值',65:'组选包胆',67: '和值尾数', 68:'特殊号'},//前三
    12: {38: '直选复式', 40: '直选和值', 41: '直选跨度', 46: '组选复式', 48: '组选和值', 49: '组选包胆'},
    1: {37: '定位胆'},
    2: {111: '前二大小单双', 112: '前三大小单双', 109: '后二大小单双', 110: '后三大小单双'},
    4: {113: '前三一码', 114: '前三二码', 115: '后三一码', 116: '后三二码',
        117: '前四一码', 118: '前四二码', 244: '后四一码', 245: '后四二码',
        119: '五星一码', 120: '五星二码', 121: '五星三码'},
    13: {122: '直选复式', 124: '直选和值', 125: '组选复式', 127: '组选和值'},
    14: {128: '直选复式', 130: '直选和值', 131: '组三复式', 133: '组六复式', 137: '组选和值'},
    15: {139: '直选复式', 141: '组选24', 142: '组选12', 143: '组选6', 144: '组选4'}
};

sortSubPlay = {2:{0:111,1:109,2:112,3:110},4:{0:113,1:114,2:115,3:116,4:117,5:118,6:244,7:245,8:119,9:120,10:121}};

//对象转数组
function obj2arr(obj) {
    var arr = [];
    for (var item in obj) {
        arr.push(obj[item]);
    }
    return arr;
}

$(function () {
    //切换玩法大类
    playid = 1;//初始五星
    spid = 37;//子玩法id
    //$('ul#play_list a').click(function () {
    $('ul#play_list a').bind('touchend', function () {
        //点亮选中
        $('ul#play_list a').removeClass('beet-active');
        $(this).addClass('beet-active');
        playid = $(this).data('pid');
        $('span#play_title').text($(this).text());
        privSetSubPlayList();
        event.preventDefault();
    });

    //选中大玩法,私有函数,初始化选号时用
    function privSetPlayList() {
        $('span#play_title').text($('ul#play_list a.play_id_'+playid).text());
        $('ul#play_list a').removeClass('beet-active');
        $('ul#play_list a.play_id_'+playid).addClass('beet-active');
        //$(this).addClass('beet-active');
        //privSetSubPlayList();
    }

    //切换子玩法列表,私有函数
    function privSetSubPlayList(isInitCode) {
        var txtHtml = '';
        var isFirst = true;
        var firstSpid = 0;
        var subTitle = '';
        var tmpIndex = 0;
        for (var sid in playtype[playid]) {
            if (sortSubPlay[playid] != undefined) {
                sid = sortSubPlay[playid][tmpIndex++];
            }
            if (isInitCode == 1) {
                var act = (sid == spid) ? 'class="beet-active"' : '';
            } else {
                var act = isFirst ? 'class="beet-active"' : '';
                if (isFirst) {
                    firstSpid = sid;
                }
            }
            isFirst = false;
            txtHtml += '<li><a ' + act + '  data-spid="' + sid + '" style="font-size: 14px;">' + playtype[playid][sid] + '</a></li>';
            if (isInitCode == 1) {
                subTitle = (sid == spid) ? playtype[playid][sid] : subTitle;
            } else {
                subTitle = (subTitle == '') ? playtype[playid][sid] : subTitle;
            }
        }
        $('span#sub_title').text(subTitle);
        $('ul#sub_list').html(txtHtml);
        //切换子玩法界面
        $('.beet-tips ul#sub_list a').bind('touchend', function () {
            //$(".beet-tips").on('click', 'ul#sub_list a', function () {
            //点亮选中
            $('ul#sub_list a').removeClass('beet-active');
            $(this).addClass('beet-active');
            $(this).parent().parent().parent().hide();
            spid = $(this).data('spid');
            setSpid(spid);
            $('span#sub_title').text($(this).text());
            var pName = $('span#play_title').text().trim();
            pName = (pName == '') ? '-' : pName+'-'+$(this).text();
            $('span#play_name').html(pName);
            initSubPlay(spid);
            //对新的号码绑定事件
            reBindCode();
            event.preventDefault();
        });
        //
        if (firstSpid > 0) {//当选中大玩法时，需要初始化第一个子玩法
            setSpid(firstSpid);
            var pName = $('span#play_title').text().trim();
            pName = (pName == '') ? '-' : pName+'-'+subTitle;
            $('span#play_name').html(pName);
            initSubPlay(spid);
            //对新的号码绑定事件
            reBindCode();
        }
        if (obj2arr(playtype[playid]).length == 1) {
            $('.beet-tips').hide();
        }
    }

    weiArr = {0: '万位', 1: '千位', 2: '百位', 3: '十位', 4: '个位'};//默认时时彩
    //切换子玩法界面，初始化用
    $('.beet-tips ul#sub_list a').bind('touchend', function () {
    //$(".beet-tips").on('click', 'ul#sub_list a', function () {
        //点亮选中
        $('ul#sub_list a').removeClass('beet-active');
        $(this).addClass('beet-active');
        $(this).parent().parent().parent().hide();
        spid = $(this).data('spid');
        setSpid(spid);
        $('span#sub_title').text($(this).text());
        privSetPlayName();
        initSubPlay(spid);
        //对新的号码绑定事件
        reBindCode();
        event.preventDefault();
    });

    //设置玩法title
    function privSetPlayName() {
        var pName = $('span#play_title').text().trim();
        pName = (pName == '') ? '-' : pName+'-'+$('span#sub_title').text();
        if (pName.length > 8) {
            $('span#play_name').css('font-size', '12px');
        } else {
            $('span#play_name').css('font-size', '14px');
        }
        $('span#play_name').html(pName);
    }

    //如果有默认号码，默认选中号码
    function setInitSubPlay(pid, sid) {
        playid = pid;
        setSpid(sid);
        privSetPlayList();
        privSetSubPlayList(1);
        privSetPlayName();
        initSubPlay(sid);
        //reBindCode();
    }

    //设置初始化的选中号码
    function setInitCode() {
        var firstSubPlay = {7:107,8:105,9:54,11:88,12:38,2:111,1:37,4:113,13:122,14:128,15:139};
        var initCode = $('#init_code').val().replace(/or/g, '|').replace(/and/g, '&');
        var initPlayid = $('#init_playid').val();
        var initSpid = $('#init_spid').val();
        initSpid = (initSpid == null || initSpid == undefined || initSpid == '') ? firstSubPlay[initPlayid] : initSpid;
        if (initCode != undefined && initCode != '') {//有初始化号码
            $('#init_code').val('');
            $('#init_playid').val('');
            $('#init_spid').val('');
            setInitSubPlay(initPlayid, initSpid);
            doBetShake(initCode);
            popBet();
        } else {
            initPlayid = (initPlayid == undefined || initPlayid == '') ? playid : initPlayid;
            initSpid = (initSpid == undefined || initSpid == '') ? spid : initSpid;
            setInitSubPlay(initPlayid, initSpid);
        }
    }

    setInitCode();

    //设定新的spid
    function setSpid(newSpid) {
        if (newSpid != undefined) {
            spid = parseInt(newSpid);
        }
    }

    isMove = false;//是否点住号码拖动
    //绑定号码点击事件
    function reBindCode() {
        isMove = false;
        $('li.specific-cell-o>span').on("touchstart", function(e) {
            //e.preventDefault();
            startX = e.originalEvent.changedTouches[0].pageX;
            startY = e.originalEvent.changedTouches[0].pageY;
        });

        $('li.specific-cell-o>span').on("touchmove", function(e) {
            moveEndX = e.originalEvent.changedTouches[0].pageX;
            moveEndY = e.originalEvent.changedTouches[0].pageY;
            X = moveEndX - startX;
            Y = moveEndY - startY;
            isMove = (X != 0 || Y != 0) ? true : false;
        });

        $('li.specific-cell-o>span').bind('touchend', function () {
            if (isMove) {
                isMove = false;
                return;
            }
            var reg = /^lt\_place\_(\d+)$/i;
            var arr = reg.exec($(this).parent().attr('name'));
            var wei = arr[1];
            $(this).toggleClass('ball-active');
            //进行规则验证，得出注数和金额
            isCodeReady = false;
            var reVal = validationRule();
            if (reVal.toString().indexOf('-1') == 0) {//横向冲突
                var objs = $(this).closest('ul').find('span.ball-active').not(this);
                var tmpI = Math.floor(Math.random() * objs.length);//随机取个下标
                $(objs[tmpI]).removeClass('ball-active');
                //$(this).toggleClass('ball-active');
                if (reVal.indexOf('-11') == 0) {//有纵向冲突
                    var tmpCode = $(this).html();
                    var objs = $('li.code-value-'+tmpCode+' span.ball-active').removeClass('ball-active');
                    $(this).addClass('ball-active');
                }
                validationRule();
            }
            if (reVal == '-2') {//纵向冲突
                var tmpCode = $(this).html();
                var objs = $('li.code-value-'+tmpCode+' span.ball-active').removeClass('ball-active');
                $(this).addClass('ball-active');
                validationRule();
            }
            event.preventDefault();
        });
    }

    //对新的号码绑定事件,只做初始化用
    isMove = false;
    $('li.specific-cell-o>span').on("touchstart", function(e) {
        //e.preventDefault();
        startX = e.originalEvent.changedTouches[0].pageX;
        startY = e.originalEvent.changedTouches[0].pageY;
    });

    $('li.specific-cell-o>span').on("touchmove", function(e) {
        moveEndX = e.originalEvent.changedTouches[0].pageX;
        moveEndY = e.originalEvent.changedTouches[0].pageY;
        X = moveEndX - startX;
        Y = moveEndY - startY;
        isMove = (X != 0 || Y != 0) ? true : false;
    });

    $('li.specific-cell-o>span').bind('touchend', function () {
        if (isMove) {
            isMove = false;
            return;
        }
        var reg = /^lt\_place\_(\d+)$/i;
        var arr = reg.exec($(this).parent().attr('name'));
        var wei = arr[1];
        $(this).toggleClass('ball-active');
        //进行规则验证，得出注数和金额
        isCodeReady = false;
        var reVal = validationRule();
        if (reVal == -1) {//撤销选号
            $(this).toggleClass('ball-active');
        }
        event.preventDefault();
    });

    $.positionClk = function () {
        var betCodeArr = getBetCode(true);
        var betCount = getBetCount(betCodeArr);
        $('#bet_sel_count').text(betCount);
        $('#bet_sel_money').text(betEachMoney * betCount);
    }

    //选号时验证规则
    isCodeReady = false;
    function validationRule() {
        var reVal = doValidation(spid);
        if (reVal == -1) {
            return reVal;
        }
        if (reVal) {
            isCodeReady = true;
            var betCodeArr = getBetCode(true);
            var betCount = getBetCount(betCodeArr);
            $('#bet_sel_count').text(betCount);
            $('#bet_sel_money').text(betEachMoney * betCount);
        } else {
            //alert('规则验证不通过!');
            $('#bet_sel_count').text(0);
            $('#bet_sel_money').text(0);
        }
        return reVal;
    }

    //获得位置方案组合个数
    function getPosCount() {
        var pos = face[spid]['pos'];
        var posAry = pos.split('');
        var posLen = posAry.length;
        var needC = 0;//需要位置数
        if (typeof (pos) == 'undefined') {
            return 0;
        }
        needC = pos.toString().replace(/0/g, '').length;
        var selC = 0;//选择位置数
        $('input[name="position"]:checked').each(function () {
            selC++;
        });
        return (selC < needC) ? 0 : Combination(selC, needC);
    }

    //取消按钮
    //$('.odds-btn-none').click(function () {
    $('.odds-btn-none').bind('touchend', function () {
        $('.pop-win').hide();
        event.preventDefault();
    });

    //清空按钮
    //$('.btn-none').click(function () {
    $('.btn-none').bind('touchend', function () {
        $('ul li.specific-cell-o span').removeClass('ball-active');
        $('#bet_sel_count').text(0);
        $('#bet_sel_money').text(0);
        event.preventDefault();
    });

    //投注按钮
    //$('.odds-btn-ture').click(function () {
    $('.odds-btn-ture').bind('touchend', function () {
        event.preventDefault();
        doBetAdd();
    });

    //弹出投注框
    //$('.btn-add').click(function () {
    $('.btn-add').bind('touchend', function () {
        event.preventDefault();
	
        if ($('#step_2').is(":visible")) {
			//console.log($('#step_2'));		
         	  doBet();
      		} else {
            popBet();
        }
    });

    function popBet() {
        var count = $('#bet_sel_count').text();
		
        if(isNaN(count) || count == 0){
			
            //if ($('#last_count').val() > 0) {
                msgAlert('号码选择有误!');
                /*$('#tip_pop').show();
                $('.tips-bg').show();*/
            //}
            event.preventDefault();
            $('#last_count').val(count);
            return false;
        }
		
        $('#last_count').val(count);
        var betCode = getBetCode();
       // if (!isLogin) {//未登陆
          //  location.href = '/index/login.html?ref_url=' + document.location.href+'_a_playid='+playid+'_a_spid='+spid+'_a_code='+betCode.replace(/\|/g, 'or').replace(/\&/g, 'and');
         //   return;
       // }
        $('#bet_per_money').val(betEachMoney);
        $('div.beet-money a.money-unit').removeClass('acitve');
        $('div.beet-money a.money-yuan').addClass('acitve');
        $('#bet_money_pop').text($('#bet_sel_money').text());
        $('#bet_count_pop').text(count);
        $('#bet_code').val(betCode.betTrim(spid));
        $('.pop-win').show();
        //设置提交可用
        $('.odds-btn-ture').removeAttr('disabled');
		console.log(count);
        setSlide(spid, 0);
    }

    //获取投注注数
    function getBetCount(betCodeArr) {
        if (betCodeArr == undefined) {
            return 0;
        }
        var nums = 0;//注数
        switch (spid) {
            case 107://五星直选
            case 105://四星直选
            case 88://后三直选
            case 54://前三直选
            case 38://前二直选
            case 109://后二大小单双
            case 110://后三大小单双
            case 111://前二大小单双
            case 112://前三大小单双
                if (spid == 107) {
                    var start = 0, end = 5;
                } else if (spid == 105) {
                    var start = 1, end = 5;
                } else if (spid == 88) {
                    var start = 2, end = 5;
                } else if (spid == 54) {
                    var start = 0, end = 3;
                } else if (spid == 38 || spid == 111) {
                    var start = 0, end = 2;
                } else if (spid == 109) {
                    var start = 3, end = 5;
                } else if (spid == 110) {
                    var start = 2, end = 5;
                } else if (spid == 112) {
                    var start = 0, end = 3;
                } else {
                    return 0;
                }
                nums = 1;
                for (var i = start; i < end; i++) {
                    nums = (betCodeArr[i] == '') ? 0 : nums * betCodeArr[i].split(sepIn).length;
                    /*if (betCodeArr[i] == '') {
                     nums *= 0;
                     } else {
                     nums *= betCodeArr[i].split(sepIn).length;
                     }*/
                }
                break;
            case 90://后三直选和值
            case 56://前三直选和值
            case 91://后三直选跨度
            case 57://前三直选跨度
            case 40://前二直选和值
            case 41://前二直选跨度
            case 48://前二组选和值
            case 124://任二直选和值
            case 127://任二组选和值
            case 130://任三直选和值
            case 137://任三组选和值
                if (spid == 90 || spid == 56) {
                    var cc = {0: 1, 1: 3, 2: 6, 3: 10, 4: 15, 5: 21, 6: 28, 7: 36, 8: 45, 9: 55, 10: 63, 11: 69, 12: 73, 13: 75, 14: 75, 15: 73, 16: 69, 17: 63, 18: 55, 19: 45, 20: 36, 21: 28, 22: 21, 23: 15, 24: 10, 25: 6, 26: 3, 27: 1};
                } else if (spid == 91 || spid == 57) {
                    var cc = {0: 10, 1: 54, 2: 96, 3: 126, 4: 144, 5: 150, 6: 144, 7: 126, 8: 96, 9: 54};
                } else if (spid == 40) {
                    var cc = {0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7, 7: 8, 8: 9, 9: 10, 10: 9, 11: 8, 12: 7, 13: 6, 14: 5, 15: 4, 16: 3, 17: 2, 18: 1};
                } else if (spid == 41) {
                    var cc = {0: 10, 1: 18, 2: 16, 3: 14, 4: 12, 5: 10, 6: 8, 7: 6, 8: 4, 9: 2};
                } else if (spid == 48) {
                    var cc = {0: 0, 1: 1, 2: 1, 3: 2, 4: 2, 5: 3, 6: 3, 7: 4, 8: 4, 9: 5, 10: 4, 11: 4, 12: 3, 13: 3, 14: 2, 15: 2, 16: 1, 17: 1, 18: 0};
                } else if (spid == 124) {
                    var cc = {0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7, 7: 8, 8: 9, 9: 10, 10: 9, 11: 8, 12: 7, 13: 6, 14: 5, 15: 4, 16: 3, 17: 2, 18: 1};
                } else if (spid == 127) {
                    var cc = {0: 0, 1: 1, 2: 1, 3: 2, 4: 2, 5: 3, 6: 3, 7: 4, 8: 4, 9: 5, 10: 4, 11: 4, 12: 3, 13: 3, 14: 2, 15: 2, 16: 1, 17: 1, 18: 0};
                } else if (spid == 130) {
                    var cc = {0: 1, 1: 3, 2: 6, 3: 10, 4: 15, 5: 21, 6: 28, 7: 36, 8: 45, 9: 55, 10: 63, 11: 69, 12: 73, 13: 75, 14: 75, 15: 73, 16: 69, 17: 63, 18: 55, 19: 45, 20: 36, 21: 28, 22: 21, 23: 15, 24: 10, 25: 6, 26: 3, 27: 1};
                } else if (spid == 137) {
                    var cc = {1: 1, 2: 2, 3: 2, 4: 4, 5: 5, 6: 6, 7: 8, 8: 10, 9: 11, 10: 13, 11: 14, 12: 14, 13: 15, 14: 15, 15: 14, 16: 14, 17: 13, 18: 11, 19: 10, 20: 8, 21: 6, 22: 5, 23: 4, 24: 2, 25: 2, 26: 1};
                } else {
                    return 0;
                }
                var tmpArr = betCodeArr[0].split(sepIn);
                for (var i = 0; i < tmpArr.length; i++) {
                    nums += cc[tmpArr[i]];
                }
                if (isNaN(nums)) {
                    nums = 0;
                }
                if (spid == 124 || spid == 127 || spid == 130 || spid == 137) {
                    var posC = getPosCount();
                    nums *= posC;
                }
                break;
            case 49://前二组选包胆
                nums = (betCodeArr[0].split(sepIn).length == 1) ? 9 : 0;
                break;
            case 93://后三组三复试
            case 59://前三组三复试
            case 94://后三组六复试
            case 60://前三组六复试
            case 46://前二组选复试
            case 125://任二组选复试
            case 131://任三组三复试
            case 133://任三组六复试
            case 141://任四组选24
            case 143://任四组选6
            case 114://前三二码不定位
            case 116://后三二码不定位
            case 118://前四二码不定位
            case 245://后四二码不定位
            case 120://五星二码不定位
            case 121://五星三码不定位
                if (spid == 93 || spid == 59 || spid == 46 || spid == 114 || spid == 116 || spid == 118
                        || spid == 120 || spid == 245 || spid == 125 || spid == 131 || spid == 143) {
                    var tmp = 2;
                } else if (spid == 94 || spid == 60 || spid == 121 || spid == 133) {
                    var tmp = 3;
                } else if (spid == 141) {
                    var tmp = 4;
                } else {
                    return 0;
                }
                var tmpArr = betCodeArr[0].split(sepIn);
                nums = Combination(tmpArr.length, tmp);
				console.log(tmpArr.length+"			"+tmp);
                if (spid == 93 || spid == 59 || spid == 131) {//组三
                    nums *= 2;
                }
                if (spid == 125 || spid == 131 || spid == 133 || spid == 141 || spid == 143) {
                    var posC = getPosCount();//方案个数
                    nums *= posC;
                }
                break;
            case 142://任四组选12
            case 144://任四组选4
                var needArr = new Array(1, 2);
                if (spid == 144) {
                    needArr[1] = 1;
                }
                var posC = getPosCount();//方案个数
                if (betCodeArr[0].length >= needArr[0] && betCodeArr[1].length >= needArr[1]) {
                    var h = arrIntersect(betCodeArr[0].split(sepIn).join(''), betCodeArr[1].split(sepIn).join('')).length; //多少个交集数字
					console.log("h:"+h+"	betCodeArr[0].split(sepIn).join(''):"+betCodeArr[0].split(sepIn).join('')+"	"+betCodeArr[1].split(sepIn).length+"	needArr[1]:"+needArr[1]);
                    var tmpNums = Combination(betCodeArr[0].split(sepIn).length, needArr[0]) * Combination(betCodeArr[1].split(sepIn).length, needArr[1]);
        			console.log(tmpNums);
		            if (h > 0) {
                        //C(m,1)*C(n,2)-C(h,1)*C(n-1,1)
                        if (spid == 142) {
                            tmpNums -= Combination(h, 1) * Combination(betCodeArr[1].split(sepIn).length - 1, 1);
                        } else if (spid == 144) { //C(m,1)*C(n,1)-C(h,1)
                            tmpNums -= Combination(h, 1);
                        }
                    }
                    nums += tmpNums;
                }
                nums *= posC;
                break;
            case 101://后三和值尾数
            case 67://前三和值尾数
            case 113://前三一码不定位
            case 115://后三一码不定位
            case 117://前四一码不定位
            case 244://后四一码不定位
            case 119://五星一码不定位
                nums = betCodeArr[0].split(sepIn).length;
                break;
            case 37://定位胆
                for (var i = 0; i < 5; i++) {
                    if (betCodeArr[i] != '') {
                        nums += betCodeArr[i].split(sepIn).length;
                    }
                }
                break;
            case 122://任二直选复式
            case 128://任三直选复式
            case 139://任四直选复式
                if (spid == 122) {
                    var tmp = 2;
                } else if (spid == 128) {
                    var tmp = 3;
                } else if (spid == 139) {
                    var tmp = 4;
                } else {
                    return 0;
                }
                var idxArr = new Array(0, 1, 2, 3, 4);
                var combArr = group(idxArr, tmp); //根据玩法，参数不同
				console.log(combArr);
                for (var i = 0; i < combArr.length; i++) {
                    var tmpCount = 1;
                    for (var j = 0; j < combArr[i].length; j++) {
                        if (betCodeArr[combArr[i][j]] == '') {
                            tmpCount = 0;
                            break;
                        }
						//console.log(combArr[i].length);
						//console.log(betCodeArr[combArr[i][j]]);
                       tmpCount *= betCodeArr[combArr[i][j]].split(sepIn).length;
                    }
                    nums += tmpCount;
                }
                break;
            case 92://后三组合
			  	var nums3 = 1;
                for (var i = 2; i < 5; i++) {
                    nums3 = (betCodeArr[i] == '') ? 0 : nums3 * betCodeArr[i].split(sepIn).length;
                }
				var nums2 = 1;
				for (var i = 3; i < 5; i++) {
                    nums2 = (betCodeArr[i] == '') ? 0 : nums2 * betCodeArr[i].split(sepIn).length;
                }
				var nums0 = 0;
                nums =  nums3+nums2+betCodeArr[4].split(sepIn).length;
                break;
            case 58://前三组合
                nums = betCodeArr[0].split(sepIn).length * betCodeArr[1].split(sepIn).length
                    * betCodeArr[2].split(sepIn).length * 3;
                break;
            case 97://后三组选和值
            case 63://前三组选和值
                cc = {1: 1, 2: 2, 3: 2, 4: 4, 5: 5, 6: 6, 7: 8, 8: 10, 9: 11, 10: 13, 11: 14, 12: 14, 13: 15, 14: 15, 15: 14, 16: 14, 17: 13, 18: 11, 19: 10, 20: 8, 21: 6, 22: 5, 23: 4, 24: 2, 25: 2, 26: 1};
                var tmpArr = betCodeArr[0].split(sepIn);
                for (var i = 0; i < tmpArr.length; i++) {
                    nums += cc[tmpArr[i]];
                }
                break;
            case 99://后三组选包胆
            case 65://前三组选包胆
                nums = (betCodeArr[0] != '' && betCodeArr[0].split(sepIn).length > 0) ? 54 : 0;
                break;
            case 102://后三特殊号
            case 68://前三特殊号
                nums = (betCodeArr[0] == '') ? 0 : betCodeArr[0].split(sepIn).length;
                break;
        }
        return nums;
    }

    //$('div.lot-up-left img').click(function () {
    $('div.lot-up-left img').bind('touchend', function () {
        doBetShake();
        event.preventDefault();
    });

    $.mobileShake = function(code) {
        doBetShake(code);
        popBet();
        doBetAdd();
    }

    function doBetShake(code) {
        var codeArr = (code != undefined && code != '') ? code.split(sepOut) : shake(spid);
        //var codeArr = shake(spid);
        $('ul li.specific-cell-o span').removeClass('ball-active');
        for (var i = 0; i < codeArr.length; i++) {
            if (codeArr[i].toString() != '') {
                var tmpArr = codeArr[i].toString().split(sepIn);
                for (var j = 0; j < tmpArr.length; j++) {
                    $('ul.place-value-' + i + ' li.code-value-' + tmpArr[j] + ' span').addClass('ball-active');
                }
            }
        }
        validationRule();
    }

    $("#slider-range-min").slider({
        range: "min",
        value: 0,
        min: 1,
        max: 1000,
        slide: function (event, ui) {
            setSlide(spid, ui.value);
        }
    });

    $('#slide_a').bind('touchmove', function () {
        //var left = $('div#slider-range-min').position().left;
        var left2 = $('div#slider-range-min').offset().left;
        var width = $('div#slider-range-min').width();
        //var now = event.pageX;
        var now = event.targetTouches[0].pageX;//兼容android
        var tmpV = parseInt(1000 * (now-left2)/width);
        tmpV = (tmpV < 0) ? 0 : tmpV;
        tmpV = (tmpV > 1000) ? 1000 : tmpV;
        $( "#slider-range-min" ).slider({value: tmpV});
        setSlide(spid, tmpV);
        event.preventDefault();
    });

   
    setSlide(spid, 0);//初始化
});