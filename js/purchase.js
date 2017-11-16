/**
 * Created by mengxue on 17/9/11.
 */
$(function(){
    var doc = $(document);
    seajs.use(['common','template','layer'],function(common,template,layer){
        getOrderDetails();
        function getOrderDetails(){
            var data={
                method:'get.my.stock.order',
                params:{
                    storeId:common.getQueryString('storeId'),
                },
            };
            common.ordersAjax(data,function(result){
                var html = template('orderListTpl',{json:result});
                $('#orderListCon').html(html)
            })
        };

        //删除按钮
        doc.on('click','.J_delete',function(){
            var orderBox = $(this).parents('.order-box');
            var data = {
                method:'delete.stock.order.product',
                params:{
                    itemId:$(this).parents('.list-box').data('itemId')
                }
            };
            common.ordersAjax(data,function(result){
                if(result.code == 0){
                    orderBox.remove();
                    total();
                }
            });
        });

        //下单按钮
        doc.on('click','.J_overbooking',function(){
            var totalNum = $('.total-num').text();
            var stockOrderIds = [];
            if(totalNum > 0){
                var products = [];
                for(var i=0; i<$('.J_all_commodity:checked').length;i++){
                    var commodityIndex = $('.J_all_commodity:checked').eq(i).parents('.order-box');
                    var productId = commodityIndex.data('productId');
                    var itemId = commodityIndex.data('itemId');
                    var colorSizeInfo = [];
                    stockOrderIds.push(itemId);
                    for(var j=0; j< commodityIndex.find('.color-list').length; j++){
                        var colorIndex = commodityIndex.find('.color-list').eq(j);
                        if(colorIndex.find('.J_all_color').is(':checked')){
                            var colorName = colorIndex.find('.color-name').text();
                            for(var k=0; k < colorIndex.find('.J_single:checked').length; k++){
                                var sizeIndex = colorIndex.find('.J_single:checked').eq(k);
                                var sizeName = sizeIndex.parents('.size-list').find('.size-name').text();
                                var sizeNum = Number(sizeIndex.parents('.size-list').find('.number').val());
                                var price =  Number(sizeIndex.parents('.size-list').find('.number').val());
                                colorSizeInfo.push({
                                    colorName:colorName,
                                    sizeName:sizeName,
                                    num:sizeNum,
                                    price:price
                                });
                            }
                        }
                    }
                    products.push({
                        colorSizeInfo:colorSizeInfo,
                        productId:productId
                    });
                }
                var data = {
                    method:'create.order',
                    params:{
                        products:products,
                        stockOrderIds:stockOrderIds,
                        token:sessionStorage.getItem('token')
                    },
                    version:localStorage.getItem('version')
                };
                sessionStorage.setItem('immediately',JSON.stringify(data));
                window.location.href = 'addressListOrder.html?immediately';
            }else{
                //提示
                layer.open({
                    content: '请先选择商品'
                    ,skin: 'msg'
                    ,time: 2 //2秒后自动关闭
                });
            }
        });
    });
    //全选本商品所有尺码
    $(document).on('click','.J_all_commodity',function(ev){
        ev.stopPropagation();
        if( $(this).is(':checked')){
            $(this).parents('.order-box').find('input').prop('checked',true)
        }else{
            $(this).parents('.order-box').find('input').prop('checked',false)
        }
    });

    //全选本颜色下所有尺码
    $(document).on('click','.J_all_color',function(){
        //全选此颜色下所有尺码
        if($(this).is(':checked')){
            $(this).parents('.order-box').find('.J_all_commodity').prop('checked',true);
            $(this).parents('.color-list').find('.J_single').prop('checked',true);
        }else{
            $(this).parents('.color-list').find('.J_single').prop('checked',false);
        }
        //所有尺码都没有被选中，此商品不被选中
        var len = $(this).parents('.order-box').find('.J_single:checked').length;
        if(len == 0){
            $(this).parents('.order-box').find('.J_all_commodity').prop('checked',false);
        }

    });

    //单个选择
    $(document).on('click','.J_single',function() {
        //此颜色下所有尺码都没有被选择时，此颜色不被选择
        var sizeCheckedLen = $(this).parents('.color-list').find('.J_single:checked').length;
        var len = $(this).parents('.order-box').find('.J_single:checked').length;
        if(sizeCheckedLen == 0){
            $(this).parents('.color-list').find('.J_all_color').prop('checked',false);
        }
        //所有尺码都没有被选中，此商品不被选中
        if(len == 0){
            $(this).parents('.order-box').find('.J_all_commodity').prop('checked',false);
        }
        //有一个被选择了，所属商品就被选择，所属颜色也被选择
        if($(this).is(':checked')){
            $(this).parents('.order-box').find('.J_all_commodity').prop('checked',true);
            $(this).parents('.color-list').find('.J_all_color').prop('checked',true);
        }
    });

    //选中的商品
    doc.on('click','input[type="checkbox"]',function(){
        total()
    });

    //加
    doc.on('click','.J_add',function(){
        var num = $(this).prev().val();
        num++;
        $(this).prev().val(num);
        total();
    });
    //减
    doc.on('click','.J_sub',function(){
        var num = $(this).next().val();
        num--;
        if(num <= 0){
            $(this).next().val(0);
        }else{
            $(this).next().val(num);
        }
        total();
    });
    //输入
    doc.on('input','.number',function(){
        total();
    });

    //下单总计
    function total(){
        var totalNumber = 0,
            totalPrice = 0,
            price = 0;
        for(var i=0; i < $('.number').length; i++){
            var unit = Number($('.number').eq(i).parents('.order-box').find('.unit-price').text());
            var num = Number($('.number').eq(i).val());
            if($('.number').eq(i).parents('.size-list').find('input[type="checkbox"]').is(':checked')){
                totalNumber += Number($('.number').eq(i).val());
                totalPrice += num * unit;
            }
        }
        $('.total-num').text(totalNumber);
        $('.total-price').text(totalPrice.toFixed(2));
    }

    //侧滑
    var startX = 0;
    var startY = 0;
    doc.on('touchstart','.list',function(ev){
        startX = ev.originalEvent.changedTouches[0].pageX,
        startY = ev.originalEvent.changedTouches[0].pageY;
    });

    doc.on('touchmove','.list',function(ev){
        var moveEndX = ev.originalEvent.changedTouches[0].pageX;
        var moveEndY = ev.originalEvent.changedTouches[0].pageY;
        var X = moveEndX - startX;
        var Y = moveEndY - startY;
        var width = $('.J_delete').outerWidth();
        //由右向左滑
        if( Math.abs(X) > Math.abs(Y) && X < 0 ){
            $('.list').css({
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
    doc.on('click','.J_commodity_details',function(ev){
        ev.stopPropagation();
        var productId = $(this).data('productId');
        window.location.href = 'commodity.html?productId=' + productId;
    })
});