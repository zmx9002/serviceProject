/**
 * Created by mengxue on 17/11/1.
 */
$(function(){
    seajs.use(['common','template'],function(common,template){
        var data = {
            method:'query.my.stock.order',
            params:{},
        };
        common.ordersAjax(data,function(result){
            var html = template('commodityListTpl',{json:result});
            $('#commodityList').html(html)
        })
    });

    //商品跳转
    $(document).on('click','.commodity-list-box li',function(){
        var storeId = $(this).data('storeId');
        window.location.href = 'purchase.html?storeId=' + storeId;
    });
});
