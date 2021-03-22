    //注意：没次调用$.get()或$.post()或$.ajax()的时候，
    //会先调用这个函数$.ajaxPrefilter()
    //在这个函数中会拿到我们给Ajax提供的配置对象
    $.ajaxPrefilter(function(options) {

        //在发起真正的Ajax请求之前，统一拼接请求的跟路径
        options.url = 'http://ajax.frontend.itheima.net' + options.url;
        console.log(options.url)
    })