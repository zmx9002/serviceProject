/**
 * Created by mengxue on 17/8/9.
 */
$(function(){
    seajs.use(['common','dropload','template','layer'],function(common,dropload,template,layer){
        var doc = $(document);
        var itemIndex = 0; //选项卡索引值
        var tab1LoadEnd = false; //店铺列表数据加载是否完成
        var tab2LoadEnd = false; //商品列表数据加载是否完成
        //https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx5cbbfebdc5854c63&redirect_uri=http://www.mengxue-web.cn/serviceProject/html/index.html&appid=wx5cbbfebdc5854c63&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect
        //https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx158a2d2aa408aa0f&redirect_uri=http://www.mengxue-web.cn/serviceProject/html/shopIndex.html?storeId=a413918cbe534d9d9f9d8e721b41efe4&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect
        //https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx158a2d2aa408aa0f&redirect_uri=http://www.mengxue-web.cn/serviceProject/html/commodityList.html?sendId=a413918cbe534d9d9f9d8e721b41efe4&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect
        var code = common.getQueryString('code');ftp://byw2900360001:@byw2900360001.my3w.com/serviceProject/js/index.js
        if(sessionStorage.getItem('token')){
            var token = sessionStorage.getItem('token');
            init();
        }else if(code){
            initBefore(code)
        }
        function initBefore(code){
            var data = {
                method:"login",
                params:{
                    code:code
                },
                version:localStorage.getItem('version')
            };
            $.ajax({
                type:'post',
                url:'http://106.15.205.55/official',
                data:JSON.stringify(data),
            }).done(function(result){
                if(result.code == 0){
                    sessionStorage.setItem('token',result.data.token);
                    sessionStorage.setItem('userName',result.data.userName);
                    sessionStorage.setItem('avatarUrl',result.data.avatarUrl);
                    sessionStorage.setItem('userId',result.data.userId);
                    init();
                }
            });
        }
        function init(){
            // tab
            doc.on('click','.tab a',function(){
                var $this = $(this);
                itemIndex = $this.index();
                $this.addClass('hover').siblings().removeClass('hover');
                $('.content div').eq(itemIndex).show().siblings('.tab-con').hide();
                // 如果选中店铺
                if(itemIndex == '0'){
                    // 如果数据没有加载完
                    if(!tab1LoadEnd){
                        // 解锁
                        dropload.unlock();
                        dropload.noData(false);
                    }else{
                        // 锁定
                        dropload.lock('down');
                        dropload.noData();
                    }
                    // 如果选中商品
                }else if(itemIndex == '1'){
                    // 如果数据没有加载完
                    if(!tab2LoadEnd){
                        // 解锁
                        dropload.unlock();
                        dropload.noData(false);
                    }else{
                        // 锁定
                        dropload.lock('down');
                        dropload.noData();
                    }
                }
                // 重置
                dropload.resetload();
            });

            var storeNumber = 0;
            var commodityNumber = 0;
            // 加载数据
            var dropload = $('.content').dropload({
                scrollArea : window,
                domDown:{
                    domClass : 'dropload-down',
                    domRefresh : '<div class="dropload-refresh">↑上拉加载更多</div>',
                    domLoad : '<div class="dropload-load">○加载中...</div>',
                    domNoData : '<div class="dropload-noData">--我是有底线的--</div>'
                },
                loadDownFn : function(me){
                    // 加载店铺的数据
                    if(itemIndex == '0'){
                        var data = {
                            method: 'home.page.store',
                            params: {
                                pageNo: storeNumber,
                                pageSize: 9
                            }
                        };
                        common.officialAjax(data,function(result){
                            if(result.code == 0){
                                var html = template('shopListTpl', {json: result});
                                if(result.data.totalPages-1 < storeNumber){
                                    // 数据加载完
                                    tab1LoadEnd = true;
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
                        })
                        // 加载商品的数据
                    }else if(itemIndex == '1'){
                        var data = {
                            method: 'home.page.product',
                            params: {
                                pageNo: commodityNumber,
                                pageSize: 10
                            }
                        };
                        common.officialAjax(data,function(result){
                            if(result.code == 0) {
                                var html = template('commodityListTpl', {json: result});
                                if (result.data.totalPages - 1 < commodityNumber) {
                                    // 数据加载完
                                    tab2LoadEnd = true;
                                    // 锁定
                                    me.lock();
                                    // 无数据
                                    me.noData();
                                }
                                // 为了测试，延迟1秒加载
                                setTimeout(function () {
                                    $('#commodityList').append(html);
                                    commodityNumber++;
                                    // 每次数据加载完，必须重置
                                    me.resetload();
                                }, 1000);
                            }
                        })
                    }
                }
            });
            $('.tab').find('a').eq(0).addClass('hover');
            $('.tab-con').eq(0).show();

            //分类跳转
            doc.on('click','.link-box li',function(){
                var businessLineId = $(this).data('businessLineId');
                window.location.href = 'category.html?businessLineId=' + businessLineId;
            });
            //店铺跳转
            doc.on('click','.shop-list li',function(){
                var id = $(this).data('storeId');
                window.location.href = 'shopIndex.html?storeId=' + id;
            });
            //商品跳转
            doc.on('click','.commodity-list li',function(){
                var productId = $(this).data('productId');
                window.location.href = 'commodity.html?productId=' + productId;
            });
        }

        //搜索
        doc.on('click','.J_search_result_btn',function(){
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
});
