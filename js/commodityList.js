/**
 * Created by mengxue on 17/8/9.
 */
$(function(){
    var doc = $(document);
    seajs.use(['common','template','dropload'],function(common,template,dropload){
        var title = common.getQueryString('keyword');
        var businessLineId = common.getQueryString('businessLineId');
        var sendId = common.getQueryString('sendId');
        var commodityNumber = 0;
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

        function init() {
            if (title || businessLineId) {
                if (title) {
                    doc.attr('title', title);
                    $('.search-btn').text(title);
                }
                $('.content').dropload({
                    scrollArea: window,
                    domDown: {
                        domClass: 'dropload-down',
                        domRefresh: '<div class="dropload-refresh">↑上拉加载更多</div>',
                        domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
                        domNoData: '<div class="dropload-noData">-我是有底线的-</div>'
                    },
                    loadDownFn: function (me) {
                        var data = {
                            method: 'home.page.product',
                            params: {
                                keyWord: title,
                                businessLineId: businessLineId,
                                pageNo: commodityNumber,
                                pageSize: 10,
                            }
                        };
                        common.officialAjax(data,function(result){
                            if (result.code == 0) {
                                var html = template('commodityListTpl', {json: result});
                                if (result.data.totalPages - 1 < commodityNumber) {
                                    // 数据加载完锁定
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
            }else if(sendId){
                var data = {
                    method: 'query.mass.send.product',
                    params: {
                        sendId: sendId,
                        token: sessionStorage.getItem('token')
                    },
                    version: localStorage.getItem('version')
                };
                common.officialAjax(data,function(result){
                    if (result.code == 0) {
                        var html = template('massListTpl', {json: result});
                        $('#commodityList').html(html);
                    }
                })
            }
        }
    });
    //一排
    doc.on('click','.J_change1',function(ev){
        ev.stopPropagation();
        $('#commodityList').find('ul').addClass('commodity-list-box').removeClass('shop-list-box');
        $('.J_change2').show();
        $(this).hide();
    });
    //两排
    doc.on('click','.J_change2',function(ev){
        ev.stopPropagation();
        $('#commodityList').find('ul').addClass('shop-list-box').removeClass('commodity-list-box');
        $('.J_change1').show();
        $(this).hide();
    });
    //详情
    doc.on('click','#commodityList li',function(){
        var productId = $(this).data('productId');
        window.location.href = '../html/commodity.html?productId=' + productId;
    })

});
