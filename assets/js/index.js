$(function() {
    //调用getUserInfo 获取用户基本信息
    getUserInfo()

    var layer = layui.layer;

    //点击按钮实现退出功能
    $('#btnLogout').on('click', function() {
        //提示用户是否确认退出
        layer.confirm('确定退出登陆', { icon: 3, title: '提示' }, function(index) {
            //do something
            //1.清空本地存储中的 token
            localStorage.removeItem('token');
            //2.重新跳转到登陆页面
            location.href = '/login.html';

            //3关闭confirm询问框
            layer.close(index);
        });

    })
})

//获取用户基本信息 
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            //调用renderAvatar渲染用户的头像
            renderAvatar(res.data)
        },

        //无论成功还是失败最终都会调用complete函数
        complete: function(res) {
            // console.log(res)
            //在complete回调函数中可以使用res.responseJSON 拿到服务器响应回来的数据
            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                // 1强制清空 token
                localStorage.removeItem('token');
                // 2 强制跳转到登陆页面
                location.href = '/login.html';
            }
        }
    })
}

//渲染用户的头像
function renderAvatar(user) {
    //1.获取用户的名称
    var name = user.nickname || user.username;
    //2.设置欢迎的文本
    $('#welcome').html('欢迎 &nbsp;&nbsp' + name);
    //3.1渲染图片的头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        //3.2渲染文字图像
        $('.layui-nav-img').hide();
        //获取用户名字的第一个字母然后改成大写
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}