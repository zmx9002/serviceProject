/**
 * Created by mengxue on 17/11/16.
 */
define(function(require,exports,module){
    module.exports = {
        //获取url中某个字段
        getQueryString:function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return decodeURI(r[2]);
            return null;
        },
        //公众号其它模块接口
        officialAjax:function(data,callback){
            data.version = localStorage.getItem('version');
            data.params.token = sessionStorage.getItem('token');
            $.ajax({
                type:'post',
                url:'http://106.15.205.55/official',
                data:JSON.stringify(data),
                success:function(result){
                    callback(result);
                }
            })
        },
        //订单模块接口
        ordersAjax:function(data,callback){
            data.version = localStorage.getItem('version');
            data.params.token = sessionStorage.getItem('token');
            $.ajax({
                type:'post',
                url:'http://106.15.205.55/order',
                data:JSON.stringify(data),
                success:function(result){
                    callback(result);
                }
            })
        }
    };
});
