/**
 * Created by mengxue on 17/8/9.
 */
$(function(){
    //获取url中某个字段
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]); return null;
    }
    var title = getQueryString('keyword');
    var businessLineId = getQueryString('businessLineId');
    var sendId = getQueryString('sendId');
    var commodityNumber = 0;
    if(sessionStorage.getItem('token')){
        var token = sessionStorage.getItem('token');
        init();
    }else if(getQueryString('code')){
        initBefore(getQueryString('code'))
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
                $(document).attr('title', title);
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
                            token: sessionStorage.getItem('token')
                        },
                        version: localStorage.getItem('version')
                    };
                    $.ajax({
                        type: 'post',
                        url: 'http://106.15.205.55/official',
                        data: JSON.stringify(data),
                        success: function (result) {
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
                        }
                    });
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
            $.ajax({
                type: 'post',
                url: 'http://106.15.205.55/product',
                data: JSON.stringify(data),
                success: function (result) {
                    if (result.code == 0) {
                        var html = template('massListTpl', {json: result});
                        $('#commodityList').html(html);
                    }
                }
            });
        }
    }

    //一排
    $(document).on('click','.J_change1',function(ev){
        ev.stopPropagation();
        $('#commodityList').find('ul').addClass('commodity-list-box').removeClass('shop-list-box');
        $('.J_change2').show();
        $(this).hide();
    });
    //两排
    $(document).on('click','.J_change2',function(ev){
        ev.stopPropagation();
        $('#commodityList').find('ul').addClass('shop-list-box').removeClass('commodity-list-box');
        $('.J_change1').show();
        $(this).hide();
    });
    //详情
    $(document).on('click','#commodityList li',function(){
        var productId = $(this).data('productId');
        window.location.href = '../html/commodity.html?productId=' + productId;
    })

});
