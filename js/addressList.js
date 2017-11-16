/**
 * Created by mengxue on 17/10/30.
 */
$(function(){
    $(document).on('click','.address-left',function(){
        window.location.href = 'addressList.html';
    });

    var data = {
        method:'query.receiving.address',
        params:{
            token:sessionStorage.getItem('token')
        },
        version:localStorage.getItem('version')
    };
    $.ajax({
        type:'post',
        url:'http://106.15.205.55/order',
        data:JSON.stringify(data),
        success:function(result){
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
        }
    });

    //获取url中某个字段
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]); return null;
    }

    $(document).on('click','.address-list',function(ev){
        ev.stopPropagation();
        var isDefault = 0;
        if(getQueryString('order')){
            window.location.href = 'orderDetails.html';
        }else{
            var addressId = $(this).data('addressId');
            if($(this).find('.isDefault').data('default') == 1){
                isDefault = 1
            }
            var addressInfo = {
                name : $(this).find('.address-name').text(),
                mobile : $(this).find('.address-mobile').text(),
                address : $(this).find('.address-city').text(),
                fullAddress : $(this).find('.address-full').text(),
                isDefault:isDefault
            };
            sessionStorage.setItem('addressInfo',JSON.stringify(addressInfo));
            window.location.href = 'orderAddress.html?addressId=' + addressId
        }
    })

    //侧滑
    var startX = 0;
    var startY = 0;
    $(document).on('touchstart','.address-list',function(ev){
        startX = ev.originalEvent.changedTouches[0].pageX,
            startY = ev.originalEvent.changedTouches[0].pageY;
    });

    $(document).on('touchmove','.address-list',function(ev){
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

    //删除按钮
    $(document).on('click','.J_delete',function(ev){
        ev.stopPropagation();
        var _this = $(this).parents('.address-list');
        var data={
            method:'delete.receiving.address',
            params:{
                addressId:_this.data('addressId'),
                token:sessionStorage.getItem('token')
            },
            version:localStorage.getItem('version')
        };
        $.ajax({
            type:'post',
            url:'http://106.15.205.55/order',
            data:JSON.stringify(data)
        }).done(function(result){
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
        })
    })

});
