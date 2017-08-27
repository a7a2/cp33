
window.onresize = function() {
    var width = $('.header-banner').width();
    var height = Math.floor(220*(width/640));
    $('.header-banner img').css('height', height);
    $('.header-banner').css('height', height+3);
}

function setBannerTimer() {
    timerBanner = window.setInterval(function () {
        for (var i = 0; i < bannerObjs.length; i++) {
            if (bannerIndex == i) {
                $('img.banner').hide();
                $(bannerObjs[i]).show();
            }
        }
        bannerIndex = (bannerIndex == bannerObjs.length-1) ?  0: bannerIndex+1;
    }, 3000);//2000毫秒
}

$(function() {
    //绑定resize事件
    if( document.createEvent) {
        var event = document.createEvent ("HTMLEvents");
        event.initEvent("resize", true, true);
        window.dispatchEvent(event);
    } else if(document.createEventObject) {
        window.fireEvent("onresize");
    }
    getHorseLamp();
    //banner切换
    bannerObjs = $('img.banner');
    bannerIndex = 1;
    setBannerTimer();
});

$(function() {
    //循环轮播中奖排名 @  2016-09-23
    (function pmCarousel(){
        try {
            var length = 120;
            $("#win_list>div").css("height",length+"px");
            if( $("#win_list ul").height() < length )
            {
                //数据小于5行的时候不用循环轮播
                return;
            }
            var iCount = 0 ;
            function goPaly()
            {
                iCount++;
                if( iCount%6 > 0 )
                {
                    $("#win_list ul").css("top",0 - (iCount%6)*4);
                }
                else
                {
                    var newTr = $("#win_list ul li:eq(0)");
                    $("#win_list ul").append("<li>"+newTr.html()+"</li>");
                    $("#win_list ul").css("top",0);
                    $("#win_list ul  li:eq(0)").remove();
                    iCount = 0;
                }
            }
            window.__sItl_1 = setInterval(goPaly,200);
            $("#prizeUser").bind("touchstart",function(){
                clearInterval( window.__sItl_1);
            });
            $("#prizeUser").bind("touchmove",function(){
                clearInterval( window.__sItl_1);
                event.stopPropagation();
            });
            $("#prizeUser").bind("touchend",function(){
                window.__sItl_1 = setInterval(goPaly,200);
            });
            $("#prizeUser").bind("touchcancle",function(){
                window.__sItl_1 = setInterval(goPaly,200);
            });
        }catch (e){console.log(e);}
    })();
});

function getHorseLamp() {
    $.ajax({
        url: '/index/ajaxHorseLamp.html',
        type: 'POST',
        dataType: 'json',
        data: {
        },
        timeout: 30000,
        success: function (data) {
            if (data.Result == false) {
                return;
            }
            var txtHtml = '';
            for (var i = 0; i < data.RecordCount; i++) {
                if (txtHtml != '') {
                    txtHtml += ' ';
                }
                txtHtml += data.Records[i].sContent;
            }
            if (txtHtml == '') {
                txtHtml = '欢迎您的加入。';
            } else {
                txtHtml = txtHtml.replace(/\<br[\s]*[\/]?\>|\\r|\\n/g, ' ');
            }
            if (txtHtml != '') {
                $('#horse').text(txtHtml);
                try{$("marquee").get(0).stop();$("marquee").get(0).start();}catch(e){}
                //horseInfo = txtHtml;
            }
        }
    });
}