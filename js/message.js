$(function () {
    function getUrlParam(name){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r!=null) return unescape(r[2]); return null; //返回参数值
    }
    //鉴权
    var appkey = "db957da1c5736ef1581e8441",
        random_str = "022cd9fd995849b58b3ef0e943421ed9",
        timestamp = new Date().getTime(),
        secret = "28f5e295ca039489ca220fca",
        signature = hex_md5('appkey=' + appkey + '&timestamp=' + timestamp + '&random_str=' +
            random_str + '&key=' + secret);

    //临时信息保存
    var myUserId = sessionStorage.getItem('userId');    //我的用户名
    var myName = sessionStorage.getItem('userName');    //我的昵称
    var myPassword ='123456';   //我的密码
    var myAvatar = sessionStorage.getItem('avatarUrl');   //我的头像
    var targetName = getUrlParam('name');  //目标用户名
    var targetAvatar = getUrlParam('logo');      //目标头像
    var targetUserId = getUrlParam('userId');      //目标Id


    var JIM = new JMessage();
    //异常断线监听
    JIM.onDisconnect(function(){
        //提示
        layer.open({
            content: '请求超时，请检查网络'
            ,skin: 'msg'
            ,time: 2 //2秒后自动关闭
        });
    });

    //初始化
    init();
    function init() {
        JIM.init({
            "appkey": appkey,//开发者在极光平台注册的IM应用 appkey
            "random_str": random_str,//随机字符串
            "signature": signature,//签名
            "timestamp": timestamp,//当初时间戳
            "flag": 0 //是否启用消息记录漫游，默认 0 否，1 是
        }).onSuccess(function(data) {
            console.log('init is success');
            register();
        }).onFail(function(data) {
            //提示
            layer.open({
                content: '请求超时，请检查网络'
                ,skin: 'msg'
                ,time: 2 //2秒后自动关闭
            });
        });
    }

    //注册
    function register(){
        JIM.register({
            'username' : myUserId,
            'password' : myPassword,
            'nickname' : myName,
            'extras':{
                'avatar':myAvatar
            }
        }).onSuccess(function(data) {
            console.log('register is success')
            login();
        }).onFail(function(data) {
            console.log(JSON.stringify(data))
            console.log('register is fail')
            login();
        });
    }

    //登陆
    function login() {
        JIM.login({
            'username': myUserId,
            'password': myPassword
        }).onSuccess(function (data) {
            console.log('login is success');
            updateSelfInfo();
            //离线消息同步监听
            JIM.onSyncConversation(function (data) {
                console.log(data);
                var userId = getUrlParam('userId');
                var href;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].from_username == userId) {
                        var result = data[i];
                        for (var j = 0; j < result.msgs.length; j++) {
                            var time = Number(result.msgs[j].ctime_ms);
                            var date = getMyDate(time);
                            if (new Date(time).toDateString() === new Date().toDateString()) {
                                time = date.slice(11,16);
                            } else {
                                time = date.slice(5,11).replace(/\-/g,"月").replace(/\s/g, "日");
                            }
                            //如果是图片
                            if (result.msgs[j].content.msg_type == 'image') {
                                var imgHtml = '';
                                var index = 'image' + j;
                                if (result.msgs[j].content.from_id == myUserId) {
                                    imgHtml = '<li class="right ' + index +'"></li>';
                                    $('#messages').append(imgHtml);
                                    //由我发出的图片内容
                                    href = result.msgs[j].content.msg_body.media_id;
                                    sendPicMessages1(href,index,time,myAvatar)
                                } else if (result.msgs[j].content.from_id == userId) {
                                    imgHtml = '<li class="left ' + index +'"></li>';
                                    $('#messages').append(imgHtml);
                                    //我接收到的图片内容
                                    href = result.msgs[j].content.msg_body.media_id;
                                    sendPicMessages1(href,index,time,targetAvatar)
                                }
                            }else if(result.msgs[j].content.msg_type == 'text'){
                                //文本内容
                                var text = result.msgs[j].content.msg_body.text;
                                if (result.msgs[j].content.from_id == myUserId) {
                                    sendMessages('right',time, myAvatar, text);
                                } else {
                                    sendMessages('left',time, targetAvatar, text);
                                }
                            }
                        }
                    }
                }
                setTimeout(function(){
                    //内容过多时,将滚动条放置到最底端
                    $('body,html').scrollTop($('.message-wrap').height() + $('.message-btn').height());
                },1000)
            });
        }).onFail(function (data) {
            console.log('login is fail')
            //提示
            layer.open({
                content: '请求超时，请检查网络'
                ,skin: 'msg'
                ,time: 2 //2秒后自动关闭
            });
        });
    }
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


    //更新个人信息
    function updateSelfInfo(){
        JIM.updateSelfInfo({
            'nickname':myName,
            'extras':{
                'avatar':myAvatar
            }
        }).onSuccess(function(data) {
            console.log('updateSelfInfo is success');
        })
    }

    //function updateSelfInfo(){
    //    var data = null;
    //    var oReq = new XMLHttpRequest();
    //    oReq.open('GET', myAvatar, true);
    //    oReq.responseType = "arraybuffer";
    //    oReq.onreadystatechange = function(){
    //        if(oReq.readyState == oReq.DONE){
    //            var arraybuffer = oReq.response;
    //            var byteArray = new Uint8Array(arraybuffer);
    //            data = new File(byteArray,'avatar.jpg')
    //            console.log(data);
    //        }
    //    };
    //    oReq.send();
    //
    //
    //    JIM.updateSelfAvatar({
    //        'avatar' : data
    //    }).onSuccess(function(data) {
    //       console.log('avatar is success')
    //    }).onFail(function(data) {
    //        console.log('avatar is fails')
    //    });
    //}


    //聊天消息实时监听
    JIM.onMsgReceive(function(data) {
        var time = Number(data.messages[0].ctime_ms);
        var date = getMyDate(time);
        if (new Date(time).toDateString() === new Date().toDateString()) {
            time = date.slice(11,16);
        } else {
            time = date.slice(5,11).replace(/\-/g,"月").replace(/\s/g, "日");
        }
        //如果是文本消息
        if(data.messages[0].content.msg_type == 'text'){
            //文本内容
            var text = data.messages[0].content.msg_body.text;
            if (data.messages[0].content.from_id == myUserId) {
                sendMessages('right',time, myAvatar, text);
            } else {
                sendMessages('left',time, targetAvatar, text);
            }
        }else if(data.messages[0].content.msg_type == 'image'){   //如果是图片消息
            //由我发出的图片内容
            if ( data.messages[0].content.from_id == myUserId) {
                href = data.messages[0].content.msg_body.media_id;
                JIM.getResource({
                    'media_id': href,
                }).onSuccess(function (data) {
                    href = data.url;
                    sendPicMessages('right',time, myAvatar, href);
                })
            } else if (data.messages[0].content.from_id == targetName) {
                //我接收到的图片内容
                href = data.messages[0].content.msg_body.media_id;
                JIM.getResource({
                    'media_id': href,
                }).onSuccess(function (data) {
                    href = data.url;
                    sendPicMessages('left',time, targetAvatar, href);
                });
            }
        }
        //内容过多时,将滚动条放置到最底端
        $('body,html').scrollTop($('.message-wrap').height() + $('.message-btn').height());
    });


    //发送文本信息模版
    function sendMessages(dec,time,src,text) {
        $('#messages').append(
            '<li class="'+ dec +'">'
            +'<div class="time">'+ time +'</div>'
            +'<div class="content-box">'
            +'<div class="avatar"><img src="'+ src + '"/></div>'
            +'<div class="content">'
            +'<i class="iconfont">&#xe68a;</i>'
            +'<p>'+ text +'</p>'
            +'</div>'
            +'</div>'
            +'</li>'
        );
    }

    //聊天记录图片信息模版
    function sendPicMessages1(href,index,time,src) {
        JIM.getResource({
            'media_id': href,
        }).onSuccess(function (data) {
            href = data.url;
            $('#messages').find('.'+ index).html('<div class="time">'+ time +'</div>'
                +'<div class="content-box">'
                +'<div class="avatar"><img src="'+ src + '"/></div>'
                +'<div class="content">'
                +'<div class="content">'
                +'<i class="iconfont">&#xe68a;</i>'
                +'<p><img src="'+ href +'"/></p>'
                +'</div>'
                +'</div>'
            )
        })
    }


    //发送图片信息模版
    function sendPicMessages(dec,time,src,pic) {
        $('#messages').append(
            '<li class="'+ dec + '">'
            +'<div class="time">'+ time +'</div>'
            +'<div class="content-box">'
            +'<div class="avatar"><img src="'+ src + '"/></div>'
            +'<div class="content">'
            +'<div class="content">'
            +'<i class="iconfont">&#xe68a;</i>'
            +'<p><img src="'+ pic +'"/></p>'
            +'</div>'
            +'</div>'
            +'</li>'
        );
    }

    //发送消息按钮
    $(document).on('click','.J_send',function() {
        var msgContent = $('#text').text();
        if (msgContent != '') {
            JIM.sendSingleMsg({
                'target_username': targetUserId,
                'target_nickname': targetName,
                'content': msgContent,
                'appkey': appkey,
                'no_notification': true
            }).onSuccess(function (data) {
                console.log('success:' + JSON.stringify(data));
                var src = '../images/1.jpg';
                var time = Number(data.ctime_ms);
                var date = getMyDate(time);
                if (new Date(time).toDateString() === new Date().toDateString()) {
                    date = date.slice(11,16);
                } else {
                    date = date.slice(5,11).replace(/\-/g,"月").replace(/\s/g, "日");
                }
                sendMessages('right',date,myAvatar,msgContent);
                //内容过多时,将滚动条放置到最底端
                $('body,html').scrollTop($('.message-wrap').height() + $('.message-btn').height());
                $('#text').text('');
            }).onFail(function (data) {
                console.log('fail:' + JSON.stringify(data));
            });
        }
    });

    //发送图片按钮
    $(document).on('change','.J_pic',function() {
        //如果有选择图片则上传图片
        var formData = new FormData();
        var files= $(this).get(0).files;
        console.log(files);
        if(files.length>0){
            formData.append(files[0].name,files[0]);
        }
        JIM.sendSinglePic({
            'target_username': targetUserId,
            'image': formData,
            'appkey': appkey
        }).onSuccess(function (data,msg){
            var msgId = msg.content.msg_body.media_id;
            var time = Number(data.ctime_ms);
            var date = getMyDate(time);
            if (new Date(time).toDateString() === new Date().toDateString()) {
                date = date.slice(11,16);
            } else {
                date = date.slice(5,11).replace(/\-/g,"月").replace(/\s/g, "日");
            }
            JIM.getResource({
                'media_id':msgId,
            }).onSuccess(function(data , msg) {
                href = data.url;
                sendPicMessages('right',date,myAvatar,href);
                //内容过多时,将滚动条放置到最底端
                $('body,html').scrollTop($('.message-wrap').height() + $('.message-btn').height());
            }).onFail(function(data) {
                console.log('图片不存在');
            });
        }).onFail(function (data) {
            console.log('error:' + JSON.stringify(data));
        });
    });

});