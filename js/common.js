$(function(){
    localStorage.setItem('version','1.0');
    //sessionStorage.setItem('token','a7931a477f1d4960ad127fea8cb75e48');
    //sessionStorage.setItem('userName','✨梦雪✨');
    //sessionStorage.setItem('avatarUrl','http://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83epCH1CUicb590vOhWftAdF6LVmevbaJKTSNI0Ckmaf55gqE1j4r2OTuVrYPsFFwnEIeDf4BzrreSdg/0');
    //sessionStorage.setItem('userId','abfc3217d1bc4b5c9bcd91ee4db236c6');
    //解决延迟300sBug
    FastClick.attach(document.body);
    //显示返回顶部按钮
    $(window).scroll(function(){
        if ($(window).scrollTop() > 100){
            $('.J_up').show();
        }
        else{
            $('.J_up').hide();
        }
    });
    //返回顶部
    $(".J_up").click(function(){
        $(window).scrollTop(0)
    });
});



