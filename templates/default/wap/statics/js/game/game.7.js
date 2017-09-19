
playtype = {26:{170:'前三直选复式',176:'前三组选复式',182:'前三组选胆拖',
        172:'中三直选复式',178:'中三组选复式',183:'中三组选胆拖',
        174:'后三直选复式',180:'后三组选复式',184:'后三组选胆拖'},//三码
    3:{185:'前二直选复式',189:'前二组选复式',193:'前二组选胆拖',
        187:'后二直选复式',191:'后二组选复式',194:'后二组选胆拖'},//二码
    4:{195:'前三位',196:'中三位',197:'后三位'},//不定位
    1:{198:'定位胆'},//定位胆
    27:{199:'任选一中一',200:'任选二中二',201:'任选三中三',202:'任选四中四',
        203:'任选五中五',204:'任选六中五',205:'任选七中五',206:'任选八中五'},//任选复式
    //28:{168:'标准',169:'胆拖'},//任选单式
    29:{215:'任选二中二',216:'任选三中三',217:'任选四中四',
        218:'任选五中五',219:'任选六中五',220:'任选七中五',221:'任选八中五'}//任选胆拖
};

playtypePk10 = {
    16:{222:'直选复式'},//pk拾前一
    17:{223:'直选复式'},//pk拾前二
    9:{225:'直选复式'},//pk拾前三
    1:{227:'定位胆'}//pk定位胆
};

weiArr = {0: '第一位', 1: '第二位', 2: '第三位', 3: '第四位', 4: '第五位'};

sortSubPlay = {3:{0:185,1:189,2:193,3:187,4:191,5:194}};

$(function() {
    if (',9,52,'.indexOf(','+$('#game_id').val()+',') > -1) {//pk10
        playtype = playtypePk10;
    }


    //切换玩法大类
    playid = 26;//前三
    spid = 170;

    if (',9,52,'.indexOf(','+$('#game_id').val()+',') > -1) {
        playid = 16;//前一
        spid = 222;
    }

    //$('ul#play_list a').click(function() {
    $('ul#play_list a').bind('touchend', function () {
        $('ul#play_list a').removeClass('beet-active');
        $(this).addClass('beet-active');
        playid = $(this).data('pid');
        $('span#play_title').text($(this).text());
        privSetSubPlayList();
        event.preventDefault();
    });

    //选中大玩法,私有函数
    function privSetPlayList() {
        $('span#play_title').text($('ul#play_list a.play_id_'+playid).text());
        $('ul#play_list a').removeClass('beet-active');
        $('ul#play_list a.play_id_'+playid).addClass('beet-active');
        //$(this).addClass('beet-active');
        //privSetSubPlayList();
    }

    //切换子玩法列表,私有函数
    function privSetSubPlayList(isInitCode) {
        //点亮选中
        var txtHtml = '';
        var isFirst = true;
        var firstSpid = 0;
        var subTitle = '';
        var tmpIndex = 0;
        for(var sid in playtype[playid]) {
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
            txtHtml += '<li><a ' + act + ' href="javascript:;" data-spid="' + sid + '" style="font-size: 14px;">' + playtype[playid][sid] + '</a></li>';
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
            //点亮选中
            $('ul#sub_list a').removeClass('beet-active');
            $(this).addClass('beet-active');
            $('span#sub_title').text($(this).text());
            var pName = $('span#play_title').text().trim();
            pName = (pName == '') ? '-' : pName+'-'+$(this).text();
            if (pName.length > 8) {
                $('span#play_name').css('font-size', '12px');
            } else {
                $('span#play_name').css('font-size', '14px');
            }
            $('span#play_name').html(pName);
            $(this).parent().parent().parent().hide();
            spid = $(this).data('spid');
            setSpid(spid);
            initSubPlay(spid);
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

    weiArr = {0: '第一位', 1: '第二位', 2: '第三位', 3: '第四位', 4: '第五位'};//11选5
    if (',9,52,'.indexOf(','+$('#game_id').val()+',') > -1) {//pk10
        weiArr = {0: '冠军', 1: '亚军', 2: '季军', 3: '第四位', 4: '第五位'};
    }
    //切换子玩法界面,初始化用
    //$('.beet-tips').on('click', 'ul#sub_list a', function() {
    $('.beet-tips ul#sub_list a').bind('touchend', function () {
        //点亮选中
        $('ul#sub_list a').removeClass('beet-active');
        $(this).addClass('beet-active');
        $('span#sub_title').text($(this).text());
        $(this).parent().parent().parent().hide();
        spid = $(this).data('spid');
        setSpid(spid);
        privSetPlayName();
        initSubPlay(spid);
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
        initSubPlay(spid);
        //reBindCode();
    }

    //设置初始化的选中号码
    function setInitCode() {
        if (',9,52,'.indexOf(','+$('#game_id').val()+',') > -1) {//pk10
            var firstSubPlay = {16:222,17:223,9:225,1:227};
        } else {
            var firstSubPlay = {26:170,3:185,4:195,1:198,27:199,29:215};
        }
        var initCode = $('#init_code').val().replace(/or/g, '|').replace(/and/g, '&');
        var initPlayid = $('#init_playid').val();
        var initSpid = $('#init_spid').val();
        initSpid = (initSpid == null || initSpid == undefined || initSpid == '') ? firstSubPlay[initPlayid] : initSpid;
        if (initCode != undefined && initCode != '') {
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

    //绑定号码点击事件,初始化用
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

    //选号时验证规则
    isCodeReady = false;
    function validationRule() {
        var reVal = doValidation(spid);
        if (reVal == -1) {
            return reVal;
        }
        if (reVal == true) {
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

    //取消按钮
    //$('.odds-btn-none').click(function() {
    $('.odds-btn-none').bind('touchend', function () {
        $('.pop-win').hide();
        event.preventDefault();
    });

    //清空按钮
    //$('.btn-none').click(function() {
    $('.btn-none').bind('touchend', function () {
        $('ul li.specific-cell-o span').removeClass('ball-active');
        $('#bet_sel_count').text(0);
        $('#bet_sel_money').text(0);
        event.preventDefault();
    });

    //投注按钮
    //$('.odds-btn-ture').click(function() {
    $('.odds-btn-ture').bind('touchend', function () {
		event.preventDefault();
        doBetAdd();
    });

    //弹出投注框
    //$('.btn-add').click(function () {
    $('.btn-add').bind('touchend', function () {
        event.preventDefault();
        if ($('#step_2').is(":visible")) {
            doBet();
        } else {
            popBet();
        }
    });

    function popBet() {
        var betCount = $('#bet_sel_count').text();
        if(isNaN(betCount) || betCount == 0) {
            //if ($('#last_count').val() > 0) {
                msgAlert('号码选择有误');
                /*$('#tip_pop').show();
                $('.tips-bg').show();*/
            //}
            event.preventDefault();
            $('#last_count').val(betCount);
            return false;
        }
        $('#last_count').val(betCount);
        var betCode = getBetCode();
        if (!isLogin) {//未登陆
            location.href = '/index/login.html?ref_url=' + encodeURIComponent(document.location.href+'&playid='+playid+'&spid='+spid+'&code='+betCode.replace(/\|/g, 'or').replace(/\&/g, 'and'));
            return;
        }
        //var betMoney = betCount * betEachMoney;
        $('#bet_per_money').val(betEachMoney);
        $('div.beet-money a.money-unit').removeClass('acitve');
        $('div.beet-money a.money-yuan').addClass('acitve');
        $('#bet_money_pop').text($('#bet_sel_money').text());
        $('#bet_count_pop').text(betCount);
        $('#bet_code').val(betCode.betTrim(spid));
        $('.pop-win').show();
        //设置提交可用
        $('.odds-btn-ture').removeAttr('disabled');
        setSlide(spid, 0);
    }

    //获取投注注数
    function getBetCount(betCodeArr) {
        if (betCodeArr == undefined) {
            return 0;
        }
        var nums = 0;//注数
        switch (spid) {
            case 170://前三直选复式
            case 172://中三直选复式
            case 174://后三直选复式
            case 185://前二直选复式
            case 187://后二直选复式
            case 222://pk拾前一直选复式
            case 223://pk拾前二直选复式
            case 225://pk拾前三直选复式
                var posArr = {170:{0:0,1:1,2:2},172:{0:1,1:2,2:3},174:{0:2,1:3,2:4},185:{0:0,1:1},
                    187:{0:3,1:4},222:{0:0},223:{0:0,1:1},225:{0:0,1:1,2:2}};
                posArr = obj2arr(posArr[spid]);
                nums = 1;
                var tmpArr = new Array();//用于判断非法的注数
                for (var i = 0; i < posArr.length; i++) {
                    nums *= betCodeArr[posArr[i]].split(sepIn).length;
                    tmpArr[i] = betCodeArr[posArr[i]].split(sepIn);
                }
                if (spid == 170 || spid == 172 || spid == 174 || spid == 225) {
                    for (var i = 0; i < tmpArr[0].length; i++) {
                        for (var j = 0; j < tmpArr[1].length; j++) {
                            for (var k = 0; k < tmpArr[2].length; k++) {
                                if (tmpArr[0][i] == tmpArr[1][j]
                                    && tmpArr[0][i] == tmpArr[2][k]
                                    && tmpArr[1][j] == tmpArr[2][k]) {
                                    nums += 2;
                                }
                                if (tmpArr[0][i] == tmpArr[1][j]) {
                                    --nums;
                                }
                                if (tmpArr[0][i] == tmpArr[2][k]) {
                                    --nums;
                                }
                                if (tmpArr[1][j] == tmpArr[2][k]) {
                                    --nums;
                                }
                            }
                        }
                    }
                }
                if (spid == 185 || spid == 187 || spid == 223) {
                    for (var i = 0; i < tmpArr[0].length; i++) {
                        for (var j = 0; j < tmpArr[1].length; j++) {
                            if (tmpArr[0][i] == tmpArr[1][j]) {
                                --nums;
                            }
                        }
                    }
                }
                break;
            case 176://前三组选复式
            case 178://中三组选复式
            case 180://后三组选复式
                nums = Combination(betCodeArr[0].split(sepIn).length, 3);
                break;
            case 182://前三组选胆拖
            case 183://中三组选胆拖
            case 184://后三组选胆拖
                var danLen = betCodeArr[0].split(sepIn).length;
                var tuoLen = betCodeArr[1].split(sepIn).length;
                nums = Combination(tuoLen, 3-danLen);
                break;
            case 189://前二组选复试
            case 191://后二组选复试
                nums = Combination(betCodeArr[0].split(sepIn).length, 2);
                break;
            case 193://前二组选胆拖
            case 194://后二组选胆拖
                nums = betCodeArr[1].split(sepIn).length;
                break;
            case 195://前三不定位
            case 196://中三不定位
            case 197://后三不定位
                if (betCodeArr[0] != '') {
                    nums = betCodeArr[0].split(sepIn).length;
                }
                break;
            case 198://定位胆
            case 227://定位胆
                for (var i = 0; i < betCodeArr.length; i++) {
                    if (betCodeArr[i] != '') {
                        nums += betCodeArr[i].split(sepIn).length;
                    }
                }
                break;
            case 199://任选一中一复式
            case 200://任选二中二
            case 201://任选三中三
            case 202://任选四中四
            case 203://任选五中五
            case 204://任选六中五
            case 205://任选七中五
            case 206://任选八中五
                var tmpArr = {199:1,200:2,201:3,202:4,203:5,204:6,205:7,206:8};
                nums = Combination(betCodeArr[0].split(sepIn).length, tmpArr[spid]);
                break;
            case 215://任选二中二胆拖
            case 216://任选三中三
            case 217://任选四中四
            case 218://任选五中五
            case 219://任选六中五
            case 220://任选七中五
            case 221://任选八中五
                var tmpArr = {215:2,216:3,217:4,218:5,219:6,220:7,221:8};
                var danLen = betCodeArr[0].split(sepIn).length;
                nums = Combination(betCodeArr[1].split(sepIn).length, tmpArr[spid]-danLen);
                break;
        }
        return nums;
    }

    //$('div.lot-up-left img').click(function() {
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
            if (codeArr[i] != '') {
                var tmpArr = codeArr[i].toString().split(sepIn);
                for (var j = 0; j < tmpArr.length; j++) {
                    $('ul.place-value-' + i + ' li.code-value-' + tmpArr[j] + ' span').addClass('ball-active');
                }
            }
        }
        validationRule();
    }

});

$(function() {
    $( "#slider-range-min" ).slider({
        range: "min",
        value: 0,
        min: 1,
        max: 1000,
        slide: function( event, ui ) {
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