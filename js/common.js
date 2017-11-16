$(function(){
    localStorage.setItem('version','1.0');
    sessionStorage.setItem('token','22dfaa063f9c4311913b50e7964ea472');
    sessionStorage.setItem('userId','9cfabb583d2b4a3d9f6a60394843bc50');
    sessionStorage.setItem('userName','✨梦雪✨');
    sessionStorage.setItem('avatarUrl','http://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eoyGGkQk7yE6ABepPp8XCibQLNRve89ficSUtscpBQWsunon3ZbhmTibvAywIb4sZCY45eHshXDQJmMg/0');
    //解决延迟300sBug
    FastClick.attach(document.body);
    var menu = true;
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

    //侧滑分类按钮
    $(document).on('click','.J_type',function(){
        var num = $('#typeBox').width();
        var typeW = $('.J_type').width();
        var typeBtn = num - (typeW/2)+ 'px';
        if(menu){
            $('body').css('overflow','hidden');
            $('.shade').show();
            $('#typeBox').show().animate({right:'0'});
            $('.J_type').animate({right:typeBtn});
            $('.up').hide();
        }else{
            $('body').css('overflow','auto');
            $('#typeBox').show().animate({right:-num});
            $('.J_type').animate({right:-typeW/2+ 'px'});
            $('.shade').hide();
        }
        menu = !menu;
    });
});



