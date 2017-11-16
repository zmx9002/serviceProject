/**
 * Created by mengxue on 17/11/6.
 */
$(function(){
    //获取url中某个字段
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]); return null;
    }
    var storeId = getQueryString('storeId');
    var way = getQueryString('way');
    if(way == 'ranking'){
        var data ={
            method : 'query.rank.list',
            params:{
                storeId: storeId,
                token:sessionStorage.getItem('token')
            },
            version:localStorage.getItem('version')
        };
        $.ajax({
            type:'post',
            url: 'http://106.15.205.55/official',
            data: JSON.stringify(data),
            success: function(result){
                if(result.code == 0){
                    var html = template('commodityListTpl',{json:result});
                    $('#commodityList').html(html);
                }
            }
        });
    }else if(way == 'orders'){
        var data ={
            method : 'query.my.since.order',
            params:{
                storeId: storeId,
                token:sessionStorage.getItem('token')
            },
            version:localStorage.getItem('version')
        };
        $.ajax({
            type:'post',
            url: 'http://106.15.205.55/order',
            data: JSON.stringify(data),
            success: function(result){
                if(result.code == 0){
                    var html = template('commodityListTpl',{json:result});
                    $('#commodityList').html(html);
                }
            }
        });
    }

    //详情
    $(document).on('click','#commodityList li',function(){
        var productId = $(this).data('productId');
        window.location.href = '../html/commodity.html?productId=' + productId;
    })
});
