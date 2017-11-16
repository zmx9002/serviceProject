/**
 * Created by mengxue on 17/10/25.
 */

$(function(){
    var commodityNumber = 0;
    $('.content').dropload({
        scrollArea : window,
        domDown : {
            domClass   : 'dropload-down',
            domRefresh : '<div class="dropload-refresh">↑上拉加载更多</div>',
            domLoad    : '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
            domNoData  : '<div class="dropload-noData">-我是有底线的-</div>'
        },
        loadDownFn : function(me){
            var data = {
                method:'query.follow.store',
                params:{
                    pageNo:commodityNumber,
                    pageSize:10,
                    token:sessionStorage.getItem('token')
                },
                version:localStorage.getItem('version')
            };
            $.ajax({
                type: 'post',
                url: 'http://106.15.205.55/official',
                data: JSON.stringify(data),
                success: function(result){
                    if(result.code == 0){
                        var html = template('commodityListTpl',{json:result});
                        if(result.data.totalPages-1 < commodityNumber){
                            // 数据加载完锁定
                            me.lock();
                            // 无数据
                            me.noData();
                        }
                        //延迟1秒加载
                        setTimeout(function(){
                            $('#commodityList').append(html);
                            commodityNumber++;
                            // 每次数据加载完，必须重置
                            me.resetload();
                        },1000);
                    }
                }
            });
        }
    });


    //侧滑
    var startX = 0;
    var startY = 0;
    $(document).on('touchstart','.commodity-list-box li',function(ev){
        startX = ev.originalEvent.changedTouches[0].pageX,
            startY = ev.originalEvent.changedTouches[0].pageY;
    });

    $(document).on('touchmove','.commodity-list-box li',function(ev){
        var moveEndX = ev.originalEvent.changedTouches[0].pageX;
        var moveEndY = ev.originalEvent.changedTouches[0].pageY;
        var X = moveEndX - startX;
        var Y = moveEndY - startY;
        var width = $('.J_delete').eq(0).width();
        //由右向左滑
        if( Math.abs(X) > Math.abs(Y) && X < 0 ){
            $('.commodity-list-box li').css({
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
    $(document).on('click','.J_delete',function(){
        var _this = $(this).parents('li');
        var data={
            method:'cancel.follow.store',
            params:{
                storeId:$(this).parents('li').data('storeId'),
                token:sessionStorage.getItem('token')
            },
            version:localStorage.getItem('version')
        };
        $.ajax({
            type:'post',
            url:'http://106.15.205.55/official',
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