/**
 * Created by mengxue on 17/10/26.
 */
$(function(){
    seajs.use(['common','template','layer'],function(common,template,layer){
        if(sessionStorage.getItem('token')){
            var token = sessionStorage.getItem('token');
            init(token)
        }else if(common.getUrlParam('code')){
            var data = {
                method:"login",
                params:{
                    code:common.getUrlParam('code')
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
                }
            };
            common.ordersAjax(data,function(result){
                showTips(result.data.ordered,0);
                showTips(result.data.unPay,1);
                showTips(result.data.unDeliver,2);
                showTips(result.data.unReceiving,3);
                showTips(result.data.finish,4);
                showTips(result.data.cancel,5);
            })
            $('.avatar').find('img').attr('src',sessionStorage.getItem('avatarUrl'));
            $('.name').text(sessionStorage.getItem('userName'));
        }
    });
    //显示数量
    function showTips(json,num){
        var list = $('.order-box').find('li');
        if(json){
            list.eq(num).find('.tips').show().text(json);
        }else{
            list.eq(num).find('.tips').hide;
        }
    }
    //跳转
    $(document).on('click','.order-box li',function(){
        var state = $(this).data('state');
        window.location.href = '../html/orderManage.html?orderState=' + state;
    });

});