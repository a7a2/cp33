var myScroll;
var myScroll2;
function loaded () {
	try{
		//myScroll = new IScroll('#wrapper_1', { mouseWheel: true,click: false });
	}catch(e){
		console.log(e);
	}

   // myScroll2 = new IScroll('#wrapper_2', { mouseWheel: true,click: true });
}
//下面代码影响页面所有的点击事件
isLogin = false;
//弹窗
$(function(){
	//$('.ui-betting-title').click(function(){
    $('.ui-betting-title').bind('touchend', function () {
        event.preventDefault();
        if (location.href.indexOf('/mine/betList.html?onlyWin=1') > -1) {
            return;
        }
        if (location.href.indexOf('/bet/') > -1 && $('.beet-odds-tips').css('display') != 'none') {
            return;
        }
	    $('.beet-tips').toggle();
        $('.beet-rig').hide();
	});
	
    $('.bett-heads').click(function(){
        $('.tips-bg').toggle();
    });

    $('.bett-head').click(function(){
        $('.beet-tips').hide();
		$('.beet-rig').toggle();
        return false;
	});
    
    $('.beet-tips').bind("click",function(){
    	//console.log($(this).css('display'));
    	if($(this).css('display')!='none'){
    		event.stopPropagation();
    	}
    });

    // click anywhere toggle off
    $(window).bind("load",function(){
        $(document).on("click",function() {
            if($('.beet-rig').is(':visible')) {
                $('.beet-rig').toggle();
            }
            else {
                $('.beet-rig').css('display','none');
            }
            if($('.beet-tips').is(':visible')) {
                $('.beet-tips').toggle();
            }
            else {
                $('.beet-tips').css('display','none');
            }
            
        });
        
        $('li.specific-cell-o>span').bind('touchend', function () {
            if($('.beet-rig').is(':visible')) {
                $('.beet-rig').toggle();
            }
            else {
                $('.beet-rig').css('display','none');
            }
            if($('.beet-tips').is(':visible')) {
                $('.beet-tips').toggle();
            }
            else {
                $('.beet-tips').css('display','none');
            }
        });

        $('#wrapper_1').bind('touchend', function () {
            if($('.beet-rig').is(':visible')) {
                $('.beet-rig').toggle();
            }
            else {
                $('.beet-rig').css('display','none');
            }
            if($('.beet-tips').is(':visible')) {
                $('.beet-tips').toggle();
            }
            else {
                $('.beet-tips').css('display','none');
            }
        });
    });
	// end
   
    // scroll toggle off
    $(document).scroll(function() {
      if($('.beet-rig').is(':visible')) {
        $('.beet-rig').toggle();
      }
      else {
        $('.beet-rig').css('display','none');
      }
      if($('.beet-tips').is(':visible')) {
          $('.beet-tips').toggle();
        }
        else {
          $('.beet-tips').css('display','none');
        }
    });
    // end

    //  hide address bar
    window.addEventListener("load",function() {
        // Set a timeout...
        /*setTimeout(function(){
            // Hide the address bar!
            window.scrollTo(0, 1);
        }, 0);*/
    });

    $('.bett-odd a').click(function(){
		$('.bett-odd').toggleClass('bett-odd-r')
	});
    timeOld = 0;//记录上次点击事件
    timeNew = 0;//判断是否恶意点击
    $('button#reveal-left, button#back_to_bet').click(function() {
    //$('button#reveal-left, button#back_to_bet').bind('touchend', function () {
        //event.preventDefault();
        timeNew = new Date().getTime() + 0;
        if (timeNew - timeOld < 1000) {
            return;
        }
        timeOld = timeNew;
        var tmpCount = $('i#bet_time_count').text();
        //先判断投注单数
        if (tmpCount != null && tmpCount != undefined && tmpCount != '' && tmpCount > 0) {
            msgConfirm("退出页面会清空购物篮里的注单, 是否退出？",function(){
                sessionStorage.clear();
                $('div.go-back').hide();
                goBackOfBetPage();
            });
            return;
        }
        var tmpSelCount = $('span#bet_sel_count').text();
        //从投注页返回上一页,时时彩
        if (!/\/index\/login.html/g.test(location.href) && (/\/bet\/[\w\d]*.html/g.test(location.href) || /\/bet\/[\w\d]*.html/g.test(location.href))
            && location.href.indexOf('bet_url') == -1) {
            if (!$('#step_1').is(':visible')) {
                showStep(1);
                return;
            }
            var tmpSelCount = $('span#bet_sel_count').text();
            //判断已选注数
            if (tmpSelCount != null && tmpSelCount != undefined && tmpSelCount != '' && tmpSelCount > 0) {
                msgConfirm("是否放弃所选的号码？",function(){
                    goBackOfBetPage();
                });
            }else{
                goBackOfBetPage();
            }
            return;
        }
        //检测是否登陆
        //走势返回到首页。如果上一页是充值结束，则进入首页
        if (location.href.indexOf('/mine/index.html') > -1
            //|| location.href.indexOf('/trend/index.html') > -1
            || document.referrer.indexOf('/index/registerOk.html') > -1) {
            location.href = '/';
            return;
        }
        //充值后返回
        if (document.referrer.indexOf('/deposit/end.html') > -1
            || location.href.indexOf('/deposit/end.html') > -1
            || document.referrer.indexOf('/mine/withdrawOk.html') > -1
            || location.href.indexOf('/mine/withdrawOk.html') > -1) {
            location.href = '/mine/index.html';
            return;
        }
        if (location.href.indexOf('/deposit/index.html') > -1){
            history.go(-1);
            return;
        }
        if (location.href.indexOf('/deposit/index.html') > -1
            ||location.href.indexOf('/deposit/wechat.html') > -1
            ||location.href.indexOf('/deposit/alipay.html') > -1
            ||location.href.indexOf('/deposit/bank.html') > -1 ){
            msgConfirm("您的支付未完成，是否放弃充值？",function(){
                window.history.go(-1);
                return;
            });
            return;
        }
        //个人中心、走势、充值提款页面，需要检测登陆
        if (document.referrer.indexOf('/mine/') > -1
            || document.referrer.indexOf('/trend/') > -1
            || document.referrer.indexOf('/deposit/') > -1
            || document.referrer.indexOf('/index/login.html') > -1) {
          //  checkLogin(location.href,document.referrer);	
            return;
        }

        //红包
        if (location.href.indexOf('/luckymoney/index.html') > -1
            ||location.href.indexOf('/luckymoney/lshb.html') > -1
            ||location.href.indexOf('/luckymoney/ok.html') > -1) {
            location.href = '/luckymoney/qhb.html';
            return;
        }

        //我的红包
        if (location.href.indexOf('/luckymoney/myList.html') > -1) {
            //console.log(document.referrer);return
            if($(this).attr('data-gotourl')){
                console.log(decodeURIComponent($(this).attr('data-gotourl')));
                location.href = decodeURIComponent($(this).attr('data-gotourl'));
                return;
            }
        }
        if(location.href.indexOf('/luckymoney/qhb') > -1){
            location.href = '/lobby/index.html';
            return;
        }
        if(location.href.indexOf('/lobby/index.html') > -1){
            location.href = '/';
            return;
        }
        window.history.go(-1);
        return;
    });

    //清除投注session
    var nowGameId = $('#game_id').val();
    if (/^[0-9]+$/.test(nowGameId) && nowGameId != sessionStorage.getItem('gameid')) {
        sessionStorage.clear();
    }
});

function reLogin(desc) {
    if (/未指定具体帐号|帐号不存在|该帐号需要验证|请重新登录|请重新登陆|请登录|请登陆/g.test(desc)) {
        location.href = '/index/login.html?clear=1&ref_url=' + location.href;
        return true;
    }
}

function goBackOfBetPage() {
    if (document.referrer.indexOf('/index/login.html') > -1 && isLogin == true) {
        location.href = '/mine/index.html';
    } else {
        history.go(-1);
    }
}

