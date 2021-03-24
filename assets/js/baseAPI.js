    //注意：每次调用$.get()或$.post()或$.ajax()的时候，
    //会先调用这个函数$.ajaxPrefilter()
    //在这个函数中会拿到我们给Ajax提供的配置对象
    $.ajaxPrefilter(function(options) {

        //在发起真正的Ajax请求之前，统一拼接请求的跟路径
        options.url = 'http://ajax.frontend.itheima.net' + options.url;
        // console.log(options.url)

        //统一为有权限的接口，设置headers 请求头
        if (options.url.indexOf('/my') !== -1) {
            options.headers = {
                Authorization: localStorage.getItem('token') || ''
            }
        }

    })