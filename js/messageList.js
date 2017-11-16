/**
 * Created by mengxue on 17/9/11.
 */
$(function(){
    var data = {
        method:'query.follow.store',
        params:{
            token:sessionStorage.getItem('token')
        },
        version:localStorage.getItem('version')
    };
    $.ajax({
        type:'post',
        url:'http://106.15.205.55/official',
        data:JSON.stringify(data),
        success:function(result){
            if(result.code == 0){
                var html = template('messagesListTpl',{json:result});
                $('#messagesListCon').append(html);
                // 内容过多时,将滚动条放置到最底端
                $('body,html').scrollTop($('.message-wrap').height() + $('.message-btn').height());
            }
        }
    });
    //聊天详情跳转
    $(document).on('click','.J_message',function(){
        var userId = $(this).data('userId');
        var name = $(this).find('.name').text();
        var logo = $(this).find('.logo').attr('src');
        window.location.href = 'message.html?way=commodity&userId='+ userId + '&name=' + name + '&logo=' + logo;
    });
    //系统消息跳转
    $(document).on('click','.J_system',function(){
        var key = $(this).data('key');
        window.location.href = 'system.html?key='+ key;
    });
});