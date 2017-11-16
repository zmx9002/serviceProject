/**
 * Created by mengxue on 17/10/30.
 */
$(function(){
    var doc = $(document);
    seajs.use(['common','dropload','template','layer'],function(common,dropload,template,layer){
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
                var data={
                    method:'query.collect.product',
                    params:{
                        pageNo:commodityNumber,
                        pageSize:10
                    }
                };
                common.officialAjax(data,function(result){
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
                })
            }
        });

        //删除按钮
        doc.on('click','.J_delete',function(ev){
            ev.stopPropagation();
            var _this = $(this).parents('li');
            var data={
                method:'cancel.collect.product',
                params:{
                    productId:$(this).parents('li').data('productId')
                }
            };
            common.officialAjax(data,function(result){
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
        });
    });

    //侧滑
    var startX = 0;
    var startY = 0;
    doc.on('touchstart','.commodity-list li',function(ev){
        startX = ev.originalEvent.changedTouches[0].pageX;
        startY = ev.originalEvent.changedTouches[0].pageY;
    });

    doc.on('touchmove','.commodity-list li',function(ev){
        var moveEndX = ev.originalEvent.changedTouches[0].pageX;
        var moveEndY = ev.originalEvent.changedTouches[0].pageY;
        var X = moveEndX - startX;
        var Y = moveEndY - startY;
        var width = $('.J_delete').eq(0).width();
        //由右向左滑
        if( Math.abs(X) > Math.abs(Y) && X < 0 ){
            $('.commodity-list li').css({
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

    //商品跳转
    doc.on('click','.commodity-list li',function(ev){
        ev.stopPropagation();
        var productId = $(this).data('productId');
        window.location.href = 'commodity.html?productId=' + productId;
    });
});
