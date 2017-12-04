/**
 * Created by mengxue on 17/9/5.
 */
$(function(){
    var doc = $(document);
    seajs.use(['common','template','dropload','layer'],function(common,template,dropload,layer){
        var pageNo = 0;
        var date = new Date();
        var today = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        var tab = common.getQueryString('tab');
        if(tab < 3){
            $('.tab').find('a').eq(tab).addClass('active')
        }else{
            $('input[name="start"]').val(common.getQueryString('startDate'));
            $('input[name="end"]').val(common.getQueryString('endDate'));
        };

        $('.content').dropload({
            scrollArea: window,
            domDown: {
                domClass: 'dropload-down',
                domRefresh: '<div class="dropload-refresh">↑上拉加载更多</div>',
                domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
                domNoData: '<div class="dropload-noData">-我是有底线的-</div>'
            },
            loadDownFn: function (me) {
                var data={
                    method:'query.store.product',
                    params:{
                        startDate:common.getQueryString('startDate'),
                        endDate:common.getQueryString('endDate'),
                        storeId:common.getQueryString('storeId'),
                        pageNo: pageNo,
                        pageSize: 10,
                        category:common.getQueryString('category')
                    }
                };
                common.officialAjax(data,function(result){
                    if (result.code == 0) {
                        var html = template('commodityListTpl',{json:result});
                        if (result.data.totalPages - 1 < pageNo) {
                            // 数据加载完锁定
                            me.lock();
                            // 无数据
                            me.noData();
                        }
                        //延迟1秒加载
                        setTimeout(function () {
                            $('#commodityList').append(html);
                            pageNo++;
                            // 每次数据加载完，必须重置
                            me.resetload();
                        }, 1000);
                    }
                })
            }
        });

        //时间切换
        doc.on('click','.tab a',function(){
            $(this).addClass('active').siblings().removeClass('active');
            var tab = $(this).index();
            var category1 = $('#typeBox').find('.active').text();
            var storeId1 = common.getQueryString('storeId');
            if(tab == 0){
                var seven = getBeforeDate(7);
                window.location.href = 'new.html?storeId=' + storeId1 +'&startDate='+ seven + '&endDate=' + today + '&category=' + category1 + '&tab=0';
            }else if(tab == 1){
                var fifteen = getBeforeDate(15);
                window.location.href = 'new.html?storeId=' + storeId1 +'&startDate='+ fifteen + '&endDate=' + today + '&category=' + category1 + '&tab=1';
            }else if(tab == 2){
                var month = getPreMonth(today);
                window.location.href = 'new.html?storeId=' + storeId1 +'&startDate='+ month + '&endDate=' + today + '&category=' + category1 + '&tab=2';
            }
        });

        //确定查询
        doc.on('click','.J_date_confirm',function(){
            var startDate1 = $('input[name="start"]').val();
            var endDate1 = $('input[name="end"]').val();
            var category1 = $('#typeBox').find('.active').text();
            var storeId1 = common.getQueryString('storeId');
            window.location.href = 'new.html?storeId=' + storeId1 +'&startDate='+ startDate1 + '&endDate=' + endDate1 + '&category=' + category1 + '&tab=3';
        });

        //详情
        doc.on('click','#commodityList li',function(){
            var productId = $(this).data('productId');
            var hasPermission = $(this).data('hasPermission');
            if(hasPermission == 1){
                window.location.href = 'commodity.html?productId='+ productId
            }else{
                //提示
                layer.open({
                    content: '请联系商家查看'
                    ,skin: 'msg'
                    ,time: 2 //2秒后自动关闭
                });
            }
        })
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

    function getPreMonth(date) {
        var arr = date.split('-');
        var year = arr[0]; //获取当前日期的年份
        var month = arr[1]; //获取当前日期的月份
        var day = arr[2]; //获取当前日期的日
        var days = new Date(year, month, 0);
        days = days.getDate(); //获取当前日期中月的天数
        var year2 = year;
        var month2 = parseInt(month) - 1;
        if (month2 == 0) {
            year2 = parseInt(year2) - 1;
            month2 = 12;
        }
        var day2 = day;
        var days2 = new Date(year2, month2, 0);
        days2 = days2.getDate();
        if (day2 > days2) {
            day2 = days2;
        }
        if (month2 < 10) {
            month2 = '0' + month2;
        }
        var t2 = year2 + '-' + month2 + '-' + day2;
        return t2;
    }



    //开始时间不能大于结束时间
    doc.on('input','input[name="start"]',function(){
        val = $(this).val();
        $('input[name="end"]').attr('min',val);
    });



});
