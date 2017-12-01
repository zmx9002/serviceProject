$(function(){
    localStorage.setItem('version','1.0');

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



