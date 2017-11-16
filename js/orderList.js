/**
 * Created by mengxue on 17/11/1.
 */
$(function(){
    var data = {
        method:'query.my.stock.order',
        params:{
            token:sessionStorage.getItem('token')
        },
        version:localStorage.getItem('version')
    };
    $.ajax({
        type:'post',
        url:'http://106.15.205.55/order',
        data:JSON.stringify(data)
    }).done(function(result){
        var html = template('commodityListTpl',{json:result});
        $('#commodityList').html(html)
    });
    //商品跳转
    $(document).on('click','.commodity-list-box li',function(){
        var storeId = $(this).data('storeId');
        window.location.href = 'purchase.html?storeId=' + storeId;
    });
});
