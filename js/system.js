/**
 * Created by mengxue on 17/11/11.
 */
$(function(){
    seajs.use(['common','dropload','template'],function(common,dropload,template){
        var pageNo = 0;
        $('.content').dropload({
            scrollArea : window,
            domDown : {
                domClass   : 'dropload-down',
                domRefresh : '<div class="dropload-refresh">↑上拉加载更多</div>',
                domLoad    : '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
                domNoData  : '<div class="dropload-noData">-我是有底线的-</div>'
            },
            loadDownFn : function(me){
                var data = {
                    method:'query.my.message',
                    params:{
                        pageNo:pageNo,
                        pageSize:5,
                    }
                };
                common.officialAjax(data,function(result){
                    if(result.code == 0){
                        var html = template('messagesTpl',{json:result});
                        if(result.data.totalPages-1 < pageNo){
                            // 锁定
                            me.lock();
                            // 无数据
                            me.noData();
                        }
                        //延迟1秒加载
                        setTimeout(function(){
                            $('#messagesCon').append(html);
                            pageNo++;
                            // 每次数据加载完，必须重置
                            me.resetload();
                        },1000);
                    }
                })
            }
        });

        template.helper('toTime', function (time) {
            var t = Number(time);
            var date = getMyDate(t);
            return date.slice(5,16).replace(/\-/g,"月").replace(/\s/g, "日");
        });

        function getMyDate(str){
            var oDate = new Date(str),
                oYear = oDate.getFullYear(),
                oMonth = oDate.getMonth()+1,
                oDay = oDate.getDate(),
                oHour = oDate.getHours(),
                oMin = oDate.getMinutes(),
                oSen = oDate.getSeconds(),
                oTime = oYear +'-'+ getzf(oMonth) +'-'+ getzf(oDay) +' '+ getzf(oHour) +':'+ getzf(oMin) +':'+getzf(oSen);//最后拼接时间
            return oTime;
        }
        //补0操作
        function getzf(num){
            if(parseInt(num) < 10){
                num = '0'+num;
            }
            return num;
        }
    });
});

