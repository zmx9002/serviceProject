/**
 * Created by mengxue on 17/10/27.
 */
$(function(){
    var doc = $(document);
    seajs.use(['common','layer','template'],function(common,layer,template){
        var session = sessionStorage.getItem('orderDetails');
        var orderDetails = JSON.parse(session);
        var html = template('orderListTpl',{json:orderDetails});
        $('#orderListCon').html(html);

        //取消订单
        doc.on('click', '.J_cancel_order', function () {
            var orderId = $('.order-num').data('orderId');
            var data = {
                method: 'cancel.order',
                params: {
                    orderId: orderId,
                }
            };
            common.ordersAjax(data,function(result){
                if (result.code == 0) {
                    //提示
                    layer.open({
                        content: '取消订单成功！'
                        ,skin: 'msg'
                        ,time: 2 //2秒后自动关闭
                    });
                    setTimeout(function(){
                        window.location.href = 'orderManage.html?orderState=6'
                    },1500);
                }else{
                    //提示
                    layer.open({
                        content: result.message
                        ,skin: 'msg'
                        ,time: 2 //2秒后自动关闭
                    });
                }
            })
        });

        //支付订单
        doc.on('click', '.J_pay_order', function () {
            var orderId = $(this).parents('.order-details').find('.order-num').data('orderId');
            var _this = $(this).parents('.order-details');
            var data = {
                method: 'pay.order',
                params: {
                    orderId: orderId
                }
            };
            common.ordersAjax(data,function(result){
                if (result.code == 0) {
                    //询问框
                    layer.open({
                        content: '是否确认已经给卖家打款?'
                        ,btn: ['确定', '取消']
                        ,yes: function(index){
                            layer.close(index);
                            window.location.href = 'orderManage.html?orderState=3'
                        }
                    });
                }else{
                    alert(result.message)
                }
            })
        });

        //确认订单
        doc.on('click', '.J_confirm_order', function () {
            var orderId = $('.order-details').find('.order-num').data('orderId');
            var data = {
                method: 'confirm.order',
                params: {
                    orderId: orderId,
                },
            };
            common.ordersAjax(data,function(result){
                if (result.code == 0) {
                    //提示
                    layer.open({
                        content: '确认订单成功！'
                        ,skin: 'msg'
                        ,time: 2 //2秒后自动关闭
                    });
                    setTimeout(function(){
                        window.location.href = 'orderManage.html?orderState=5'
                    },1500);
                }
            })
        });

        //删除订单
        doc.on('click', '.J_delete_order', function () {
            var orderId = $('.order-details').find('.order-num').data('orderId');
            var data = {
                method: 'delete.stock.order',
                params: {
                    orderId: orderId,
                },
            };
            common.ordersAjax(data,function(result){
                if (result.code == 0) {
                    //提示
                    layer.open({
                        content: '确认订单成功！'
                        ,skin: 'msg'
                        ,time: 2 //2秒后自动关闭
                    });
                    setTimeout(function(){
                        window.location.href = 'orderManage.html?orderState=6'
                    },1500);
                }
            })
        });
    });
});
