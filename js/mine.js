/**
 * Created by mengxue on 17/10/26.
 */
$(function(){
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r != null) return unescape(r[2]);
        return null; //返回参数值
    }

    if(sessionStorage.getItem('token')){
        var token = sessionStorage.getItem('token');
        init(token)
    }else if(getUrlParam('code')){
        var data = {
            method:"login",
            params:{
                code:getUrlParam('code')
            },
            version:localStorage.getItem('version')
        };
        $.ajax({
            type:'post',
            url:'http://106.15.205.55/official',
            data:JSON.stringify(data),
        }).done(function(result){
            if(result.code == 0){
                sessionStorage.setItem('token',result.data.token);
                sessionStorage.setItem('userName',result.data.userName);
                sessionStorage.setItem('avatarUrl',result.data.avatarUrl);
                sessionStorage.setItem('userId',result.data.userId);
                init(result.data.token);
            }
        });
    }else{
        //提示
        layer.open({
            content: '暂无信息'
            ,skin: 'msg'
            ,time: 2 //2秒后自动关闭
        });
    }

    function init(token){
        var data = {
            method:'query.order.num',
            params:{
                token:token
            },
            version:localStorage.getItem('version')
        };
        $.ajax({
            type:'post',
            url:'http://106.15.205.55/order',
            data:JSON.stringify(data)
        }).done(function(result){
            showTips(result.data.ordered,0);
            showTips(result.data.unPay,1);
            showTips(result.data.unDeliver,2);
            showTips(result.data.unReceiving,3);
            showTips(result.data.finish,4);
            showTips(result.data.cancel,5);
        });
        $('.avatar').find('img').attr('src',sessionStorage.getItem('avatarUrl'));
        $('.name').text(sessionStorage.getItem('userName'));
    }



    function showTips(json,num){
        var list = $('.order-box').find('li');
        if(json){
            list.eq(num).find('.tips').show().text(json);
        }else{
            list.eq(num).find('.tips').hide;
        }
    }

    $(document).on('click','.order-box li',function(){
        var state = $(this).data('state');
        window.location.href = '../html/orderManage.html?orderState=' + state;
    });

    $(document).on('click','.J_loginOut',function(){
        //询问框
        layer.open({
            content: '请定要退出登录？'
            ,btn: ['确定', '取消']
            ,yes: function(index){
                layer.close(index);
            }
        });
    })
});