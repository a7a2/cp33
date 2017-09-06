
$(function () {
    //定义预准备函数
    var imgs = new Array('', '', '');
    //判断手机是否运动支持传感器
    if (window.DeviceMotionEvent) {
        var speed = 10;//定义默认加速度，达到这个速度才执行摇一摇
        //x,y 表示当前的左边
        //lastX,lastY 表示摇一摇后最后停留的坐标
        var x = y = z = lastX = lastY = lastZ = 0;
        //监听设备运动事件
        window.addEventListener('devicemotion', function () {
            var acceleration = event.accelerationIncludingGravity;//获取设备的加速度
            x = acceleration.x;//获取加速度的x轴，用于计算水平水平加速度
            y = acceleration.y;//获取加速度的y轴，用于计算垂直方向的加速度，同时计算正玄值

            //计算当前的加速度是否大于默认加速度
            if (Math.abs(x - lastX) > speed || Math.abs(y - lastY) > speed) {
                //摇一摇换logo
                doMobileShake();
            }
            //重新记录最后一次值，作为下一次开始坐标
            lastX = x;
            lastY = y;
        }, false);
    }
});