/**
 * Created by mengxue on 17/8/10.
 */
$(function(){
    var popUrl = null;
    //获取url中某个字段
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]); return null;
    }
    var data = {
        method:'get.product.detail',
        params:{
            productId:getQueryString('productId'),
            token:sessionStorage.getItem('token')
        },
        version:localStorage.getItem('version')
    };
    $.ajax({
        type:'post',
        url:'http://106.15.205.55/official',
        data:JSON.stringify(data),
        success:function(result) {
            if(result.code == 0){
                var commodityHtml = template('commodityTpl', {json: result});
                var popHtml = template('popTpl', {json: result});
                $('#commodityCon').html(commodityHtml);
                $('#popCon').html(popHtml);
                $('.tips').hide();
                banner();
            }else if(result.code == 3001){
                //询问框
                layer.open({
                    content: '您没有访问该商品的权限，是否向店铺发起申请?'
                    ,btn: ['确定', '取消']
                    ,yes: function(index){
                        layer.close(index);
                        var visitData = {
                            method:'apply.product.visible',
                            params:{
                                productId:getQueryString('productId'),
                                token:sessionStorage.getItem('token')
                            },
                            version:localStorage.getItem('version')
                        };
                        $.ajax({
                            type:'post',
                            url:' http://106.15.205.55/official',
                            data:JSON.stringify(visitData),
                            success:function(result) {
                                if (result.code == 0) {
                                    //提示
                                    layer.open({
                                        content: result.message
                                        , skin: 'msg'
                                        , time: 2 //2秒后自动关闭
                                    });
                                }
                            }
                        });
                        history.go(-1);
                    }
                });
            }
        }
    });

    template.helper('toColor', function(colorData){
        var colorArray = colorData.split(',');
        return colorArray
    });
    template.helper('toSize', function(sizeData){
        var sizeArray = sizeData.split(',');
        return sizeArray
    });

    var startX = 0;
    var startY = 0;
    //轮播图片
    function banner(){
        var screenW = $(window).width(); //屏幕宽
        var now = 0; //当前图片索引
        var timer = null; //定时器
        var pageX = 0; //鼠标指针相对于文档的左边缘距离。
        var width = 0; //卷起距离
        var changeX = 0;
        var $dom = $('.pic-list');
        var bannerBoxWidth = $dom.find('li').length * screenW + 'px';
        $dom.css('width',bannerBoxWidth);
        $('.pic-mask').find('.now').text(now + 1);
        $('.pic-mask').find('.banner-total').text($dom.find('li').length);
        function scroll(){
            width = -now * screenW;
            $dom.css({
                'transform':'translateX(' + width + 'px)',
                'transition':'0.5s'
            });
            $('.pic-mask').find('.now').text(now + 1);
        }
        auto();
        function auto(){
            timer = setInterval(function(){
                now++;
                if(now >= $dom.find('li').length){
                    now = 1;
                    $dom.css({left:0});
                }
                scroll();
            },3000);
        }

        $dom.on('touchstart',function(ev){
            clearInterval(timer);
            $dom.css('transition','none');
            var event = ev.targetTouches[0];
            startX = event.pageX;
            startY = event.pageY;
            pageX = event.pageX;
            changeX = width;
        });

        $dom.on('touchmove',function(ev){
            var event = ev.targetTouches[0];
            var moveEndX = event.pageX;
            var moveEndY = event.pageY;
            var X = moveEndX - startX;
            var Y = moveEndY - startY;
            var dis = event.pageX - pageX;
            width = changeX + dis;
            $('.pic-list').css({
                'transform':'translateX('+ width + 'px)'
            });
            if( (Math.abs(X) > Math.abs(Y) && X < 0) || (Math.abs(X) > Math.abs(Y) && X > 0)){
                ev.preventDefault();
            }
        });

        $dom.on('touchend',function(){
            now = width/screenW;
            now =-Math.round(now);
            if(now < 0){
                now = 0;
            }
            if(now >= $dom.find('li').length - 1){
                now = $dom.find('li').length -1;
            }
            scroll();
            auto();
        })
    }
    //加入进货单显示弹窗
    $(document).on('click','.J_addOrder',function(){
        $('.pop').show();
        $('body').css('overflow','hidden');
        $('.pop-con').css({
            'opacity':1,
            'height':9.8 + 'rem'
        });
        $('.color-tag').find('li').eq(0).addClass('active').siblings().removeClass('active');
        $('.size-list').eq(0).addClass('active').siblings().removeClass('active');
    });
    //立即下单弹窗
    $(document).on('click','.J_addOrder_now',function(){
        popUrl = '../html/addressListOrder.html';
        $('.pop').show();
        $('body').css('overflow','hidden');
        $('.pop-con').css({
            'opacity':1,
            'height':9.8 + 'rem'
        });
        $('.color-tag').find('li').eq(0).addClass('active').siblings().removeClass('active');
        $('.size-list').eq(0).addClass('active').siblings().removeClass('active');
    });
    //关闭弹窗
    $(document).on('click','.J_close',function(){
        $('.pop').hide();
        $('body').css('overflow','auto');
        $('.pop-con').css({
            'opacity':0,
            'height':0
        });
        $('.color-tag').find('li').eq(0).addClass('active').siblings().removeClass('active');
        $('.size-list').eq(0).addClass('active').siblings().removeClass('active');
    });

    //收藏
    $(document).on('click','.J_collect',function(ev){
        ev.stopPropagation();
        if($(this).text() == '收藏'){
            var data = {
                method:'create.collect.product',
                params:{
                    productId:getQueryString('productId'),
                    token:sessionStorage.getItem('token')
                },
                version:localStorage.getItem('version')
            };
            $.ajax({
                type:'post',
                url:' http://106.15.205.55/official',
                data:JSON.stringify(data),
                success:function(result){
                    if(result.code == 0) {
                        $('.J_collect').text('已收藏')
                    }
                }
            })
        }else{
            var data = {
                method:'cancel.collect.product',
                params:{
                    productId:getQueryString('productId'),
                    token:sessionStorage.getItem('token')
                },
                version:localStorage.getItem('version')
            };
            $.ajax({
                type:'post',
                url:' http://106.15.205.55/official',
                data:JSON.stringify(data),
                success:function(result){
                    if(result.code == 0){
                        $('.J_collect').text('收藏')
                    }
                }
            })
        }
    });

    //进店看看
    $(document).on('click','.J_store_in',function(){
        var storeId = $('.banner-box').data('storeId');
        window.location.href = 'shopIndex.html?storeId='+storeId
    });

    //选择颜色
    $(document).on('click','.color-tag li',function(){
        $(this).addClass('active').siblings().removeClass('active');
        $('.size').find('ul').eq($(this).index()).addClass('active').siblings().removeClass('active');
    });

    //加
    $(document).on('click','.J_add',function(){
        var val = $(this).prev().val();
        var index = $(this).parents('.size-list').index() - 1;
        val++;
        $(this).prev().val(val);
        totalNumber(index);
        totalPrice();
    });

    //输入
    $(document).on('input','.size-num',function(){
        var index = $(this).parents('.size-list').index() - 1;
        totalNumber(index);
        totalPrice();
    });

    //减
    $(document).on('click','.J_sub',function(){
        var val = $(this).next().val();
        var index = $(this).parents('.size-list').index() - 1;
        val--;
        if(val <0){
            val = 0
        }
        $(this).next().val(val);
        totalNumber(index);
        totalPrice();
    });

    //计算购买数量
    function totalNumber(index){
        var num = 0;
        $('.size-list').eq(index).find('li').each(function(){
            num += Number($(this).find('input[name="number"]').val());
        });
        $('.color-tag li').eq(index).find('.tips').text(num);
        if(num > 0){
            $('.color-tag li').eq(index).find('.tips').show()
        }else{
            $('.color-tag li').eq(index).find('.tips').hide()
        }
    }

    //总计
    function totalPrice(){
        var num = 0;
        var price = 0;
        $('.size').find('li').each(function(){
            num += Number($(this).find('input[name="number"]').val());
            price =  Number($('.size-price').find('i').text()) * num;
        });
        $('.total-num').text(num);
        $('.total-price').text(price.toFixed(2));
    }


    //添加颜色
    $(document).on('click','.J_add_color',function(){
        var content = '<input type="text" placeholder="请输入颜色" class="add-color-text"/>';
        //询问框
        layer.open({
            content: content
            ,btn: ['确定', '取消']
            ,yes: function(index){
                var val = $('.add-color-text').val();
                if(val != ''){
                    var colorHtml = '<li data-color-id=""><span class="color-name">'+$('.add-color-text').val()+'</span><span class="tips">0</span></li>'
                    $('.color-tag').append(colorHtml);
                    $('.color-tag li').eq($('.color-tag li').length -1).find('.tips').hide()
                }
                layer.close(index);
            }
        });
        var html='<ul class="size-list"><li><div class="size-left" data-size-id="">均码</div>'
            +'<div class="size-right">'
            +'<a href="javascript:;" class="size-sub J_sub">-</a>'
            +'<input type="number" value="" name="number" placeholder="0" class="size-num"/>'
            +'<a href="javascript:;" class="size-add J_add">+</a>'
            +'</div></li><a href="javascript:;" class="add-size J_add_size"> + 添加自定义尺码</a></ul>';
        $('.size').append(html);
    });

    //添加尺码
    $(document).on('click','.J_add_size',function(){
        var content = '<input type="text" placeholder="请输入尺码" class="add-size-text"/>';
        var thisParents = $(this).parents('.size-list');
        //询问框
        layer.open({
            content: content
            ,btn: ['确定', '取消']
            ,yes: function(index) {
                var val = $('.add-size-text').val();
                if (val != '') {
                    var text = $('.add-size-text').val();
                    var num = $('.size').find('.active').index() - 1;
                    var html = '<li>'
                        + '<div class="size-left" data-size-id="">'
                        + text
                        + '</div>'
                        + '<div class="size-right">'
                        + '<a href="javascript:;" class="size-sub J_sub">-</a>'
                        + '<input type="number" value="" name="number" placeholder="0" class="size-num"/>'
                        + '<a href="javascript:;" class="size-add J_add">+</a>'
                        + '</div>'
                        + '</li>';
                    thisParents.find('.J_add_size').before(html);
                }
                layer.close(index);
            }
        });
    });


    //提交订单
    $(document).on('click','.J_confirm',function(){
        var totalNum = $('.total-num').text();
        var products = [];
        var colorSizeInfo = [];
        var colorName = '',num ='',sizeName = '';
        if(totalNum > 0){
            for(var i=0; i< $('.color-tag li').length; i++){
                var colorNum = $('.color-tag li').eq(i);
                var sizeNum = $('.size-list').eq(i);
                colorName = colorNum.find('.color-name').text();
                for(var j=0; j< sizeNum.find('li').length; j++){
                    num = sizeNum.find('input[name="number"]').eq(j).val();
                    sizeName = sizeNum.find('.size-left').eq(j).text();
                    if( num > 0 ){
                        colorSizeInfo.push({
                            colorName:colorName,
                            sizeName:sizeName,
                            num:Number(num)
                        });
                    }
                }
            }
            products.push({
                colorSizeInfo:colorSizeInfo,
                productId:$('.name').data('productId')
            });
            var addOrderData = {
                method : 'create.stock.order',
                params:{
                    colorSizeInfo:colorSizeInfo,
                    productId:$('.name').data('productId'),
                    token:sessionStorage.getItem('token')
                },
                version:localStorage.getItem('version')
            };

            var orderData = {
                method : 'create.order',
                params:{
                    products:products,
                    token:sessionStorage.getItem('token')
                },
                version:localStorage.getItem('version')
            };
            if( popUrl == null){
                $.ajax({
                    type:'post',
                    url:'http://106.15.205.55/order',
                    data:JSON.stringify(addOrderData),
                    success:function(result){
                        if(result.code == 0){
                            //提示
                            layer.open({
                                content: '已加入进货单'
                                ,skin: 'msg'
                                ,time: 2 //2秒后自动关闭
                            });
                        }else{
                            //提示
                            layer.open({
                                content: result.message
                                ,skin: 'msg'
                                ,time: 2 //2秒后自动关闭
                            });
                        }
                    }
                });
            }else{
                sessionStorage.setItem('orders',JSON.stringify(orderData));
                window.location.href = popUrl;
            }
            $('.pop').hide();
            $('body').css('overflow','auto');
            $('.pop-con').css({
                'opacity':0,
                'height':0
            })
        }else{
            //提示
            layer.open({
                content: '请先选择商品数量'
                ,skin: 'msg'
                ,time: 2 //2秒后自动关闭
            });
        }
    });
    //联系商家
    $(document).on('click','.J_contact',function(){
        var url = $('.pic-list').find('img').eq(0).attr('src');
        var hasFollow = $('input[name="hasFollow"]').val();
        var storeLogo = $('input[name="storeLogo"]').val();
        var storeName = $('input[name="storeName"]').val();
        var userId = $('input[name="userId"]').val();
        if(hasFollow == 1){
            window.location.href = 'message.html?way=commodity&logo=' + storeLogo + '&name=' + name +'&userId=' + userId +'&url=' + url;
        }else{
            //提示
            layer.open({
                content:'请先关注店铺'
                ,skin: 'msg'
                ,time: 3 //2秒后自动关闭
            });
        }

    })
});