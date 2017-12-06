/**
 * Created by mengxue on 17/10/26.
 */
$(function () {
    seajs.use(['common','template','dropload','layer'],function(common,template,dropload,layer){
        var stateNum = common.getQueryString('orderState');
        var itemIndex = 0;
        var loadNumber1 = false;
        var loadNumber2 = false;
        var loadNumber3 = false;
        var loadNumber4 = false;
        var loadNumber5 = false;
        var loadNumber6 = false;
        var orderedNum = 0;
        var finishNum = 0;
        var cancelNum = 0;
        var unDeliverNum = 0;
        var unPayNum = 0;
        var unReceivingNum = 0;
        if (stateNum) {
            itemIndex = stateNum - 1;
        }
        $('.order-title').find('li').eq(itemIndex).addClass('active').siblings().removeClass('active');
        $('#orderListCon').find('.tab').eq(itemIndex).show().siblings('.tab').hide();

        //选项卡切换
        $(document).on('click', '.order-title li', function () {
            itemIndex = $(this).index();
            $('.order-title').find('li').eq(itemIndex).addClass('active').siblings().removeClass('active');
            $('#orderListCon').find('.tab').eq(itemIndex).show().siblings('.tab').hide();
            if (itemIndex == '0') {
                if (!loadNumber1) {
                    // 解锁
                    dropload.unlock();
                    dropload.noData(false);
                } else {
                    // 锁定
                    dropload.lock('down');
                    dropload.noData();
                }
            } else if (itemIndex == '1') {
                if (!loadNumber2) {
                    // 解锁
                    dropload.unlock();
                    dropload.noData(false);
                } else {
                    // 锁定
                    dropload.lock('down');
                    dropload.noData();
                }
            } else if (itemIndex == '2') {
                if (!loadNumber3) {
                    // 解锁
                    dropload.unlock();
                    dropload.noData(false);
                } else {
                    // 锁定
                    dropload.lock('down');
                    dropload.noData();
                }
            } else if (itemIndex == '3') {
                if (!loadNumber4) {
                    // 解锁
                    dropload.unlock();
                    dropload.noData(false);
                } else {
                    // 锁定
                    dropload.lock('down');
                    dropload.noData();
                }
            } else if (itemIndex == '4') {
                if (!loadNumber5) {
                    // 解锁
                    dropload.unlock();
                    dropload.noData(false);
                } else {
                    // 锁定
                    dropload.lock('down');
                    dropload.noData();
                }
            } else if (itemIndex == '5') {
                if (!loadNumber6) {
                    // 解锁
                    dropload.unlock();
                    dropload.noData(false);
                } else {
                    // 锁定
                    dropload.lock('down');
                    dropload.noData();
                }
            }
            // 重置
            dropload.resetload();
        });

        // 加载数据
        var dropload = $('.content').dropload({
            scrollArea: window,
            domDown: {
                domClass: 'dropload-down',
                domRefresh: '<div class="dropload-refresh">↑上拉加载更多</div>',
                domLoad: '<div class="dropload-load">○加载中...</div>',
                domNoData: '<div class="dropload-noData">--我是有底线的--</div>'
            },
            loadDownFn: function (me) {
                var data = {
                    method: 'query.my.order',
                    params: {
                        pageSize: 10,
                    }
                };
                // 加载数据
                if (itemIndex == '0') {
                    data.params.status = 1;
                    data.params.pageNo = orderedNum;
                    common.ordersAjax(data,function(result){
                        if (result.code == 0) {
                            var html = template('orderListTpl', {json: result});
                            if (result.data.totalPages - 1 < orderedNum) {
                                // 数据加载完
                                loadNumber1 = true;
                                // 锁定
                                me.lock();
                                // 无数据
                                me.noData();
                            }
                            //延迟1秒加载
                            setTimeout(function () {
                                $('#orderListCon').find('.tab').eq(0).append(html);
                                //计算总价及数量
                                for (i = 0; i < $('.order-box').length; i++) {
                                    var totalNum = 0;
                                    var index = $('.order-box').eq(i);
                                    var price = Number(index.find('.price').text());
                                    for (var j = 0; j < index.find('.size-info').length; j++) {
                                        var sizeIndex = index.find('.size-info').eq(j);
                                        var orderNum = sizeIndex.find('.size-num').text();
                                        totalNum += Number(orderNum);
                                    }
                                    index.find('.product-total-num').text(totalNum);
                                    index.find('.total-price').text(totalNum * price);
                                }
                                orderedNum++;
                                // 每次数据加载完，必须重置
                                me.resetload();
                            }, 1000);
                        }
                    });
                    // 加载商品的数据
                } else if (itemIndex == '1') {
                    data.params.status = 2;
                    data.params.pageNo = unPayNum;
                    common.ordersAjax(data,function(result){
                        if (result.code == 0) {
                            var html = template('orderListTpl', {json: result});
                            if (result.data.totalPages - 1 < unPayNum) {
                                // 数据加载完
                                loadNumber2 = true;
                                // 锁定
                                me.lock();
                                // 无数据
                                me.noData();
                            }
                            //延迟1秒加载
                            setTimeout(function () {
                                $('#orderListCon').find('.tab').eq(1).append(html);
                                unPayNum++;
                                //计算总价及数量
                                for (i = 0; i < $('.order-box').length; i++) {
                                    var totalNum = 0;
                                    var index = $('.order-box').eq(i);
                                    var price = Number(index.find('.price').text());
                                    for (var j = 0; j < index.find('.size-info').length; j++) {
                                        var sizeIndex = index.find('.size-info').eq(j);
                                        var orderNum = sizeIndex.find('.size-num').text();
                                        totalNum += Number(orderNum);
                                    }
                                    index.find('.product-total-num').text(totalNum);
                                    index.find('.total-price').text(totalNum * price);
                                }
                                // 每次数据加载完，必须重置
                                me.resetload();
                            }, 1000);
                        }
                    })
                } else if (itemIndex == '2') {
                    data.params.status = 3;
                    data.params.pageNo = unDeliverNum;
                    common.ordersAjax(data,function(result){
                        if (result.code == 0) {
                            var html = template('orderListTpl', {json: result});
                            if (result.data.totalPages - 1 < unDeliverNum) {
                                // 数据加载完
                                loadNumber3 = true;
                                // 锁定
                                me.lock();
                                // 无数据
                                me.noData();
                            }
                            //延迟1秒加载
                            setTimeout(function () {
                                $('#orderListCon').find('.tab').eq(2).append(html);
                                unDeliverNum++;
                                //计算总价及数量
                                for (i = 0; i < $('.order-box').length; i++) {
                                    var totalNum = 0;
                                    var index = $('.order-box').eq(i);
                                    var price = Number(index.find('.price').text());
                                    for (var j = 0; j < index.find('.size-info').length; j++) {
                                        var sizeIndex = index.find('.size-info').eq(j);
                                        var orderNum = sizeIndex.find('.size-num').text();
                                        totalNum += Number(orderNum);
                                    }
                                    index.find('.product-total-num').text(totalNum);
                                    index.find('.total-price').text(totalNum * price);
                                }
                                // 每次数据加载完，必须重置
                                me.resetload();
                            }, 1000);
                        }
                    })
                } else if (itemIndex == '3') {
                    data.params.status = 4;
                    data.params.pageNo = unReceivingNum;
                    common.ordersAjax(data,function(result){
                        if (result.code == 0) {
                            var html = template('orderListTpl', {json: result});
                            if (result.data.totalPages - 1 < unReceivingNum) {
                                // 数据加载完
                                loadNumber4 = true;
                                // 锁定
                                me.lock();
                                // 无数据
                                me.noData();
                            }
                            //延迟1秒加载
                            setTimeout(function () {
                                $('#orderListCon').find('.tab').eq(3).append(html);
                                unReceivingNum++;
                                //计算总价及数量
                                for (i = 0; i < $('.order-box').length; i++) {
                                    var totalNum = 0;
                                    var index = $('.order-box').eq(i);
                                    var price = Number(index.find('.price').text());
                                    for (var j = 0; j < index.find('.size-info').length; j++) {
                                        var sizeIndex = index.find('.size-info').eq(j);
                                        var orderNum = sizeIndex.find('.size-num').text();
                                        totalNum += Number(orderNum);
                                    }
                                    index.find('.product-total-num').text(totalNum);
                                    index.find('.total-price').text(totalNum * price);
                                }
                                // 每次数据加载完，必须重置
                                me.resetload();
                            }, 1000);
                        }
                    })
                } else if (itemIndex == '4') {
                    data.params.status = 5;
                    data.params.pageNo = finishNum;
                    common.ordersAjax(data,function(result){
                        if (result.code == 0) {
                            var html = template('orderListTpl', {json: result});
                            if (result.data.totalPages - 1 < finishNum) {
                                // 数据加载完
                                loadNumber5 = true;
                                // 锁定
                                me.lock();
                                // 无数据
                                me.noData();
                            }
                            //延迟1秒加载
                            setTimeout(function () {
                                $('#orderListCon').find('.tab').eq(4).append(html);
                                finishNum++;
                                //计算总价及数量
                                for (i = 0; i < $('.order-box').length; i++) {
                                    var totalNum = 0;
                                    var index = $('.order-box').eq(i);
                                    var price = Number(index.find('.price').text());
                                    for (var j = 0; j < index.find('.size-info').length; j++) {
                                        var sizeIndex = index.find('.size-info').eq(j);
                                        var orderNum = sizeIndex.find('.size-num').text();
                                        totalNum += Number(orderNum);
                                    }
                                    index.find('.product-total-num').text(totalNum);
                                    index.find('.total-price').text(totalNum * price);
                                }
                                // 每次数据加载完，必须重置
                                me.resetload();
                            }, 1000);
                        }
                    })
                } else if (itemIndex == '5') {
                    data.params.status = 6;
                    data.params.pageNo = cancelNum;
                    common.ordersAjax(data,function(result){
                        if (result.code == 0) {
                            var html = template('orderListTpl', {json: result});
                            if (result.data.totalPages - 1 < cancelNum) {
                                // 数据加载完
                                loadNumber6 = true;
                                // 锁定
                                me.lock();
                                // 无数据
                                me.noData();
                            }
                            //延迟1秒加载
                            setTimeout(function () {
                                $('#orderListCon').find('.tab').eq(5).append(html);
                                cancelNum++;
                                //计算总价及数量
                                for (i = 0; i < $('.order-box').length; i++) {
                                    var totalNum = 0;
                                    var index = $('.order-box').eq(i);
                                    var price = Number(index.find('.price').text());
                                    for (var j = 0; j < index.find('.size-info').length; j++) {
                                        var sizeIndex = index.find('.size-info').eq(j);
                                        var orderNum = sizeIndex.find('.size-num').text();
                                        totalNum += Number(orderNum);
                                    }
                                    index.find('.product-total-num').text(totalNum);
                                    index.find('.total-price').text(totalNum * price);
                                }
                                // 每次数据加载完，必须重置
                                me.resetload();
                            }, 1000);
                        }
                    })
                }
            }
        });


        //取消订单
        $(document).on('click', '.J_cancel_order', function () {
            var _this = $(this).parents('.order-box');
            var id = $(this).parents('.tab').find('.order-num').data('orderId');
            var data = {
                method: 'cancel.order',
                params: {
                    orderId: id,
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
                    },1500)
                }else{
                    //提示
                    layer.open({
                        content: result.message
                        ,skin: 'msg'
                        ,time: 2 //2秒后自动关闭
                    });
                }
            });
        });

        //支付订单
        $(document).on('click', '.J_pay_order', function () {
            var orderId = $(this).parents('.tab').find('.order-num').data('orderId');
            var _this = $(this).parents('.order-box');
            var data = {
                method: 'pay.order',
                params: {
                    orderId: orderId,
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
                    //提示
                    layer.open({
                        content: result.message
                        ,skin: 'msg'
                        ,time: 2 //2秒后自动关闭
                    });
                }
            });
        });

        //确认订单
        $(document).on('click', '.J_confirm_order', function () {
            var id = $(this).parents('.tab').find('.order-num').data('orderId');
            var _this = $(this).parents('.order-box');
            var data = {
                method: 'confirm.order',
                params: {
                    orderId: id,
                }
            };
            common.ordersAjax(data,function(result){
                if (result.code == 0) {
                    //提示
                    layer.open({
                        content: '确认成功！'
                        ,skin: 'msg'
                        ,time: 2 //2秒后自动关闭
                    });
                    setTimeout(function(){
                        window.location.href = 'orderManage.html?orderState=5'
                    },1500);
                }else{
                    //提示
                    layer.open({
                        content: result.message
                        ,skin: 'msg'
                        ,time: 2 //2秒后自动关闭
                    });
                }
            });
        });

        //删除订单
        $(document).on('click', '.J_delete_order', function () {
            var id = $(this).parents('.tab').find('.order-num').data('orderId');
            var _this = $(this).parents('.order-box');
            var data = {
                method: 'delete.stock.order',
                params: {
                    orderId: id,
                }
            };
            common.ordersAjax(data,function(result){
                if (result.code == 0) {
                    //提示
                    layer.open({
                        content: '删除成功！'
                        ,skin: 'msg'
                        ,time: 2 //2秒后自动关闭
                    });
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
        });

        //订单详情
        $(document).on('click', '.J_order_details', function () {
            var _this = $(this).parents('.order-box');
            var items = [];
            var colorSizeInfo = [];
            for (var i = 0; i < _this.find('.commodity-size-box').length; i++) {
                var size = [];
                var colorInfo = _this.find('.commodity-size-box').eq(i);
                var color = colorInfo.find('.color').text();
                for (var j = 0; j < colorInfo.find('.size-info').length; j++) {
                    var sizeInfo = colorInfo.find('.size-info').eq(j);
                    var sizeName = sizeInfo.find('.size-name').text();
                    var num = sizeInfo.find('.size-num').text();
                    size.push({
                        sizeName: sizeName,
                        num: num
                    })
                }
                colorSizeInfo.push({
                    color: color,
                    size: size
                });
            }

            items.push({
                colorSizeInfo: colorSizeInfo,
                pictureUrl: _this.find('.commodity-pic img').attr('src'),
                productName: '3333',
                productCode: _this.find('.product-code').text(),
                price: _this.find('.price').text(),
            });

            var orderTime = _this.find('input[name="orderTime"]').val();
            var payTime = _this.find('input[name="payTime"]').val();
            var deliverTime = _this.find('input[name="deliverTime"]').val();
            var confirmTime = _this.find('input[name="confirmTime"]').val();
            var delay = _this.find('.goods-state').text();
            if(orderTime){
                orderTime =  getLocalTime(orderTime)
            }else{
                orderTime =  ''
            }
            if(payTime){
                payTime =  getLocalTime(payTime)
            }else{
                payTime =  ''
            }

            if(deliverTime){
                deliverTime =  getLocalTime(deliverTime)
            }else{
                deliverTime =  ''
            }

            if(confirmTime){
                confirmTime =  getLocalTime(confirmTime)
            }else{
                confirmTime =  ''
            }

            var orderDetails = {
                items: items,
                addressId:_this.find('input[name="addressId"]').val(),
                address:_this.find('input[name="address"]').val(),
                fullAddress:_this.find('input[name="fullAddress"]').val(),
                logistics:_this.find('input[name="logistics"]').val(),
                contactName:_this.find('input[name="contactName"]').val(),
                contactMobile:_this.find('input[name="contactMobile"]').val(),
                createTime:_this.find('input[name="createTime"]').val(),
                delay:delay,
                orderTime: orderTime,
                deliverTime:deliverTime,
                confirmTime:confirmTime,
                freight:_this.find('input[name="freight"]').val(),
                logisticsNo:_this.find('input[name="logisticsNo"]').val(),
                logisticsWay:_this.find('input[name="logisticsWay"]').val(),
                logisticsCompany:_this.find('input[name="logisticsCompany"]').val(),
                orderId: _this.find('.order-num').data('orderId'),
                orderNo: _this.find('.order-no').text(),
                payTime: payTime,
                payWay:_this.find('input[name="payWay"]').val(),
                status: _this.find('input[name="status"]').val(),
                storeId: _this.find('input[name="storeId"]').val(),
                storeName: _this.find('.order-name').text(),
                productTotalNum: _this.find('.product-total-num').eq(0).text(),
                totalPrice: _this.find('.total-price').text()
            };
            sessionStorage.setItem('orderDetails', JSON.stringify(orderDetails));
            window.location.href = 'orderDetails.html';
        });
    });
    function getLocalTime(nS) {
        return new Date(parseInt(nS)).toLocaleString().replace(/\//g,"-");
    }

    //放大图片并轮播
    $(document).on('click','.J_show_pic',function(){
        $('.lightbox').show();
        var html = $(this).parents('.order-box').find('.pic-list-con').html();
        $('.pic-con').html(html);
        $('body').css('overflow','hidden');
        bigPic();
        var len = $('.pic-con').find('li').length;
        for(var i=0;  i< len; i++){
            var spanPoint = '<span></span>';
            $('.pic-point').append(spanPoint)
        }
        $('.pic-point').find('span').eq(0).addClass('active');
    });
    function bigPic(){
        var screenW = $(window).width(); //屏幕宽
        var now = 0; //当前图片索引
        var bannerBoxWidth =  $('.pic-con').find('li').length * screenW + 'px';
        var width = 0; //卷起距离
        $('.pic-con').css('width',bannerBoxWidth);

        var startX,startY,pageX,changeX;
        $('.pic-con').on('touchstart',function(ev){
            $('.pic-con').css('transition','none');
            var event = ev.targetTouches[0];
            startX = event.pageX;
            startY = event.pageY;
            pageX = event.pageX;
            changeX = width;
        });

        $('.pic-con').on('touchmove',function(ev){
            var event = ev.targetTouches[0];
            var moveEndX = event.pageX;
            var moveEndY = event.pageY;
            var X = moveEndX - startX;
            var Y = moveEndY - startY;
            var dis = event.pageX - pageX;
            width = changeX + dis;
            $('.pic-con').css({
                'transform':'translateX('+ width + 'px)'
            });
            if( (Math.abs(X) > Math.abs(Y) && X < 0) || (Math.abs(X) > Math.abs(Y) && X > 0)){
                ev.preventDefault();
            }
        });

        $('.pic-con').on('touchend',function(){
            now = width/screenW;
            now =-Math.round(now);
            if(now < 0){
                now = 0;
            }
            if(now >= $('.pic-con').find('li').length - 1){
                now = $('.pic-con').find('li').length -1;
            }
            scroll();
        });

        function scroll(){
            width = -now * screenW;
            $('.pic-con').css({
                'transform':'translateX(' + width + 'px)',
                'transition':'0.5s'
            });
            $('.pic-point').find('span').eq(now).addClass('active').siblings().removeClass('active');
        }
    }
    $(document).on('click','.lightbox',function(){
        $('.lightbox').hide();
        $('.pic-con').html('');
        $('.pic-point').html('');
        $('body').css('overflow','auto');
        $('.pic-con').css({
            'transform':'translateX('+ 0 + 'px)'
        });
    });
});
