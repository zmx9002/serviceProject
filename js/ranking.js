/**
 * Created by mengxue on 17/11/6.
 */
$(function(){
    seajs.use(['common','template','layer'],function(common,template,layer){
        var storeId = common.getQueryString('storeId');
        var way = common.getQueryString('way');
        if(way == 'ranking'){
            var data ={
                method : 'query.rank.list',
                params:{
                    storeId: storeId,
                }
            };
            common.officialAjax(data,function(result){
                if(result.code == 0){
                    var html = template('commodityListTpl',{json:result});
                    $('#commodityList').html(html);
                }
            })
        }else if(way == 'orders'){
            var data ={
                method : 'query.my.since.order',
                params:{
                    storeId: storeId,
                },
            };
            common.ordersAjax(data,function(result){
                if(result.code == 0){
                    var html = template('commodityListTpl',{json:result});
                    $('#commodityList').html(html);
                }
            })
        }

        //详情
        $(document).on('click','#commodityList li',function(){
            var way = common.getQueryString('way');
            var productId = $(this).data('productId');
            if(way == 'ranking'){
                var hasPermission = $(this).data('hasPermission');
                if(hasPermission == 1){
                    window.location.href = '../html/commodity.html?productId=' + productId;
                }else{
                    //提示
                    layer.open({
                        content: '请联系商家查看'
                        ,skin: 'msg'
                        ,time: 2 //2秒后自动关闭
                    });
                }
            }else{
                window.location.href = '../html/commodity.html?productId=' + productId;
            }
        })
    });
});
