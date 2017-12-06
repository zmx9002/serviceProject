/**
 * Created by mengxue on 17/8/10.
 */
$(function(){
    seajs.use(['common','dropload','layer','template'],function(common,dropload,layer,template){
        var commodityNumber = 0;
        var doc = $(document);
        var storeId = common.getQueryString('storeId');
        var code = common.getQueryString('code');
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
                        var logo = result.data.logo;
                        var sign = result.data.storeSign;
                        $('.name').text(result.data.storeName);
                        $('.shop-vermicelli span').text(result.data.fansNum);
                        $('input[name="userId"]').val(result.data.userId);
                        if(logo){
                            $('.avatar img').attr('src', logo);
                        }else{
                            $('.avatar img').attr('src', '../images/shopLogo.png');
                        }
                        if(sign){
                            $('.avatar-box').css('background-image','url('+ sign +')');
                        }
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
            if(hasFollow == '关注'){
                var data = {
                    method:'create.follow.store',
                    params:{
                        storeId:storeId
                    }
                };
                common.officialAjax(data,function(result){
                    if(result.code == 0){
                        $('.J_follow').text('已关注');
                        window.location.href = '../html/message.html?way=store&logo=' + logo + '&name=' + name +'&userId=' + userId
                    }else{
                        //提示
                        layer.open({
                            content: result.message
                            ,skin: 'msg'
                            ,time: 2 //2秒后自动关闭
                        });
                    }
                });
            }else{
                window.location.href = '../html/message.html?way=store&logo=' + logo + '&name=' + name +'&userId=' + userId
            }

        });
        //店铺介绍跳转
        doc.on('click','.J_store_intro',function(ev){
            ev.stopPropagation();
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
        doc.on('click','.J_news',function(ev){
            ev.stopPropagation();
            var date = new Date();
            var today = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
            var startDate = getBeforeDate(7);
            window.location.href = 'new.html?storeId=' + storeId +'&startDate='+ startDate + '&endDate=' + today;
        });
        //排行榜
        doc.on('click','.J_ranking',function(ev){
            ev.stopPropagation();
            window.location.href = 'ranking.html?storeId=' + storeId + '&way=ranking';
        });
        //我下过的单
        doc.on('click','.J_orders',function(ev){
            ev.stopPropagation();
            window.location.href = 'ranking.html?storeId=' + storeId + '&way=orders';
        });
        //商品跳转
        doc.on('click','#commodityList li',function(ev){
            ev.stopPropagation();
            var productId = $(this).data('productId');
            var hasPermission = $(this).data('hasPermission');
            if(hasPermission == 1){
                window.location.href = 'commodity.html?productId=' + productId;
            }else{
                //提示
                layer.open({
                    content: '请联系商家查看'
                    ,skin: 'msg'
                    ,time: 2 //2秒后自动关闭
                });
            }
        });
        var menu = true;
        //侧滑分类按钮
        $(document).on('click','.J_type',function(){
            var num = $('#typeBox').width();
            var typeW = $('.J_type').width();
            var typeBtn = num - (typeW/2)+ 'px';
            if(menu){
                $('body').css('overflow','hidden');
                $('.shade').show();
                $('#typeBox').show().animate({right:'0'});
                $('.J_type').animate({right:typeBtn});
                $('.up').hide();
            }else{
                $('body').css('overflow','auto');
                $('#typeBox').show().animate({right:-num});
                $('.J_type').animate({right:-typeW/2+ 'px'});
                $('.shade').hide();
            }
            menu = !menu;
        });

        doc.on('click','.shade',function(ev){
            ev.stopPropagation();
            $('.J_type').trigger('click');
        });
        //一排
        doc.on('click','.J_change1',function(ev){
            ev.stopPropagation();
            $('.content').find('ul').addClass('commodity-list-box').removeClass('shop-list-box');
            $('.J_change2').show();
            $(this).hide();
        });
        //两排
        doc.on('click','.J_change2',function(ev){
            ev.stopPropagation();
            $('.content').find('ul').addClass('shop-list-box').removeClass('commodity-list-box');
            $('.J_change1').show();
            $(this).hide();
        });
    });
});
