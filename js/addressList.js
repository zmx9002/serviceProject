/**
 * Created by mengxue on 17/10/30.
 */
$(function(){
    var doc = $(document);
    seajs.use(['common','template','layer'],function(common,template,layer){
        //加载地址列表
        var data = {
            method:'query.receiving.address',
            params:{}
        };
        common.ordersAjax(data,function(result){
            if(result.code == 0){
                var html = template('addressTpl',{json:result});
                $('#addressCon').html(html);
            }else{
                //提示
                layer.open({
                    content: result.message
                    ,skin: 'msg'
                    ,time: 2 //2秒后自动关闭
                });
            }
        });
        //地址列表跳转判断
        doc.on('click','.address-list',function(ev){
            ev.stopPropagation();
            var isDefault = 0;
            var orderTips = common.getQueryString('order');
            //确认地址并跳转
            if(orderTips){
                window.location.href = 'orderDetails.html';
            }else{
                //编辑地址
                var addressId = $(this).data('addressId');
                if($(this).find('.isDefault').data('default') == 1){
                    isDefault = 1
                }
                var addressInfo = {
                    name : $(this).find('.address-name').text(),
                    mobile : $(this).find('.address-mobile').text(),
                    address : $(this).find('.address-city').text(),
                    fullAddress : $(this).find('.address-full').text(),
                    logistics:$(this).find('.logistics').text(),
                    isDefault:isDefault
                };
                sessionStorage.setItem('addressInfo',JSON.stringify(addressInfo));
                window.location.href = 'orderAddress.html?addressId=' + addressId
            }
        });

        //删除按钮
        doc.on('click','.J_delete',function(ev){
            ev.stopPropagation();
            var _this = $(this).parents('.address-list');
            var data={
                method:'delete.receiving.address',
                params:{
                    addressId:_this.data('addressId')
                }
            };
            common.ordersAjax(data,function(result){
                if(result.code == 0){
                    _this.remove();
                }else{
                    //提示
                    layer.open({
                        content: result.message
                        ,skin: 'msg'
                        ,time: 2 //2秒后自动关闭
                    });
                }
            });
        })
    });
    //侧滑
    var startX = 0;
    var startY = 0;
    doc.on('touchstart','.address-list',function(ev){
        startX = ev.originalEvent.changedTouches[0].pageX;
        startY = ev.originalEvent.changedTouches[0].pageY;
    });
    doc.on('touchmove','.address-list',function(ev){
        var moveEndX = ev.originalEvent.changedTouches[0].pageX;
        var moveEndY = ev.originalEvent.changedTouches[0].pageY;
        var X = moveEndX - startX;
        var Y = moveEndY - startY;
        var width = $('.J_delete').eq(0).width();
        //由右向左滑
        if( Math.abs(X) > Math.abs(Y) && X < 0 ){
            $('.address-list').css({
                'transform':'translateX('+0 +'px)',
                'transition':'0.3s'
            });
            $(this).css({
                'transform':'translateX('+(-width) +'px)',
                'transition':'0.3s'
            });
        }
        //由左向右滑
        if( Math.abs(X) > Math.abs(Y) && X > 0 ){
            $(this).css({
                'transform':'translateX('+ 0 +'px)',
                'transition':'0.3s'
            });
        }
    });
});
