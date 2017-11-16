/**
 * Created by mengxue on 17/11/6.
 */
$(function(){
    seajs.use(['common','template'],function(common,template){
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
    });

    //详情
    $(document).on('click','#commodityList li',function(){
        var productId = $(this).data('productId');
        window.location.href = '../html/commodity.html?productId=' + productId;
    })
});
