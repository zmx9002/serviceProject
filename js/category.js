/**
 * Created by mengxue on 17/8/9.
 */
$(function () {
    //获取url中某个字段
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]); return null;
    }
    $('.tab').find('a').eq(0).addClass('hover').siblings().removeClass('hover');
    $('.shop-list').show();
    var storeNumber = 0;
    if(getQueryString('keyWord') || getQueryString('businessLineId')){
        $('.J_search').val(getQueryString('keyWord'));
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
                method: 'home.page.store',
                params: {
                    businessLineId: getQueryString('businessLineId'),
                    keyWord: getQueryString('keyWord'),
                    pageNo: storeNumber,
                    pageSize: 9,
                    token: sessionStorage.getItem('token')
                },
                version: localStorage.getItem('version')
            };

            $.ajax({
                type: 'post',
                url: "http://106.15.205.55/official",
                data: JSON.stringify(data),
                success: function (result) {
                    if (result.code == 0) {
                        var html = template('shopListTpl', {json: result});
                        if (result.data.totalPages - 1 < storeNumber) {
                            // 锁定
                            me.lock();
                            // 无数据
                            me.noData();
                        }
                        //延迟1秒加载
                        setTimeout(function () {
                            $('#shopList').append(html);
                            storeNumber++;
                            // 每次数据加载完，必须重置
                            me.resetload();
                        }, 1000);
                    }
                }
            });
        }
    });
    }else{
       setTimeout(function(){
           $('input').trigger('click').focus();
       },500)
    }

    $(document).on('click','.J_commodity',function(){
        if(getQueryString('keyWord')){
            window.location.href = 'commodityList.html?keyWord='+getQueryString('keyWord');
        }else if(getQueryString('businessLineId')){
            window.location.href = 'commodityList.html?businessLineId='+getQueryString('businessLineId');
        }
    });

    //店铺跳转
    $(document).on('click','.shop-list li',function(){
        var storeId = $(this).data('storeId');
        window.location.href = 'shopIndex.html?storeId=' + storeId;
    });

    //搜索
    $(document).on('click','.J_search_result_btn',function(){
        var val = $('.J_search').val();
        if(val == ''){
            //提示
            layer.open({
                content: '请输入搜索条件'
                ,skin: 'msg'
                ,time: 2 //2秒后自动关闭
            });
        }else{
            var keyWord = $('.J_search').val();
            window.location.href = 'category.html?keyWord=' + keyWord;
            //默认显示店铺列表
            $('.tab').find('a').eq(0).addClass('hover');
            $('.tab-con').eq(0).show();
        }
    });

});
