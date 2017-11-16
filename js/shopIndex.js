/**
 * Created by mengxue on 17/8/10.
 */
$(function(){
    seajs.use(['common','dropload','layer','template'],function(common,dropload,layer,template){
        var commodityNumber = 0;
        var doc = $(document);
        var storeId = common.getQueryString('storeId');
        if(sessionStorage.getItem('token')){
            var token = sessionStorage.getItem('token');
            init();
        }else if(common.getQueryString('code')){
            initBefore(common.getQueryString('code'))
        }

        function initBefore(code){
            var data = {
                method:"login",
                params:{
                    code:code
                }
            };
            common.officialAjax(data,function(result){
                if(result.code == 0){
                    sessionStorage.setItem('token',result.data.token);
                    sessionStorage.setItem('userName',result.data.userName);
                    sessionStorage.setItem('avatarUrl',result.data.avatarUrl);
                    sessionStorage.setItem('userId',result.data.userId);
                    init();
                }
            })
        }

        //店铺信息
        function init() {
            getStoreInfo();
            function getStoreInfo() {
                var shopData = {
                    method: 'get.store',
                    params: {
                        storeId:storeId,
                    }
                };
                //数据渲染
                common.officialAjax(shopData,function(result){
                    if (result.code == 0) {
                        $('.name').text(result.data.storeName);
                        $('.avatar img').attr('src', result.data.logo);
                        $('.shop-vermicelli span').text(result.data.fansNum);
                        $('input[name="userId"]').val(result.data.userId);
                        if (result.data.hasFollow) {
                            $('.J_follow').text('已关注');
                        } else {
                            $('.J_follow').text('关注');
                        }
                    }
                });
                //店铺商品信息
                $('.content').dropload({
                    scrollArea: window,
                    domDown: {
                        domClass: 'dropload-down',
                        domRefresh: '<div class="dropload-refresh">↑上拉加载更多</div>',
                        domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
                        domNoData: '<div class="dropload-noData">-我是有底线的-</div>'
                    },
                    loadDownFn: function (me) {
                        var commodityData = {
                            method: 'home.page.product',
                            params: {
                                storeId: storeId,
                                pageNo: commodityNumber,
                                pageSize: 10,
                            }
                        };
                        common.officialAjax(commodityData,function(result){
                            if (result.code == 0) {
                                var html = template('commodityListTpl', {json: result});
                                if (result.data.totalPages - 1 < commodityNumber) {
                                    // 锁定
                                    me.lock();
                                    // 无数据
                                    me.noData();
                                }
                                //延迟1秒加载
                                setTimeout(function () {
                                    $('#commodityList').append(html);
                                    commodityNumber++;
                                    // 每次数据加载完，必须重置
                                    me.resetload();
                                }, 1000);
                            }
                        })
                    }
                });
                //获取分类信息
                var typeData = {
                    method: 'query.store.category',
                    params: {
                        storeId: storeId
                    },
                };
                common.officialAjax(typeData,function(result){
                    var html = template('typeList', {json: result});
                    $('#typeBox').append(html)
                });
            }
        }

        //关注按钮
        doc.on('click','.J_follow',function(){
            if($(this).text() == '关注'){
                var data = {
                    method:'create.follow.store',
                    params:{
                        storeId:storeId,
                    },
                };
                common.officialAjax(data,function(result){
                    if(result.code == 0){
                        $('.J_follow').text('已关注');
                    }
                });
            }else{
                var data = {
                    method:'cancel.follow.store',
                    params:{
                        storeId:storeId
                    }
                };
                common.officialAjax(data,function(result){
                    if(result.code == 0){
                        $('.J_follow').text('关注');
                    }
                });
            }
        });

        doc.on('click','.J_contact',function(){
            var logo = $('.avatar').find('img').attr('src');
            var name = $('.name').text();
            var userId = $('input[name="userId"]').val();
            var hasFollow = $('.J_follow').text();
            if(hasFollow == '已关注'){
                window.location.href = '../html/message.html?way=store&logo=' + logo + '&name=' + name +'&userId=' + userId
            }else{
                //提示
                layer.open({
                    content:'请先关注店铺'
                    ,skin: 'msg'
                    ,time: 3 //2秒后自动关闭
                });
            }
        })
        //店铺介绍跳转
        doc.on('click','.J_store_intro',function(){
            var id = storeId;
            window.location.href = 'shopIntroduction.html?storeId=' + id;
        });
        //获取日期
        function getBeforeDate(n) {
            var d = new Date();
            var year = d.getFullYear();
            var mon = d.getMonth() + 1;
            var day = d.getDate();
            if (day <= n) {
                if (mon > 1) {
                    mon = mon - 1;
                }
                else {
                    year = year - 1;
                    mon = 12;
                }
            }
            d.setDate(d.getDate() - n);
            year = d.getFullYear();
            mon = d.getMonth() + 1;
            day = d.getDate();
            s = year + "-" + (mon < 10 ? ('0' + mon) : mon) + "-" + (day < 10 ? ('0' + day) : day);
            return s;
        }
        //最近新版
        doc.on('click','.J_news',function(){
            var date = new Date();
            var today = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
            var startDate = getBeforeDate(7);
            window.location.href = 'new.html?storeId=' + storeId +'&startDate='+ startDate + '&endDate=' + today;
        });
        //排行榜
        doc.on('click','.J_ranking',function(){
            window.location.href = 'ranking.html?storeId=' + storeId + '&way=ranking';
        });
        //我下过的单
        doc.on('click','.J_orders',function(){
            window.location.href = 'ranking.html?storeId=' + storeId + '&way=orders';
        });
        //商品跳转
        doc.on('click','#commodityList li',function(){
            var productId = $(this).data('productId');
            window.location.href = 'commodity.html?productId=' + productId;
        });
    });
});
