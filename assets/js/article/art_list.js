$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    //定义美化时间的过滤器

    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    //定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }


    //定义一个查询的参数对象，将来请求数据的时候，
    //需要将请求参数对象提交到服务器
    var q = {
        pagenum: '1', //默认页码值为1
        pagesize: '2', //	每页显示多少条数据
        cate_id: '', //	文章分类的 Id
        state: '' //文章的状态，可选值有：已发布、草稿
    }

    initTable()
    initCate()
        //获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                // console.log(res.data)
                //使用模版引擎渲染页面
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)

                //调用渲染分页的方法
                renderPage(res.total)

                //重新渲染下拉列表
                form.render();
            }
        })
    }


    //初始化文章分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章失败')
                }
                var htmlStr = template('tpl-cate', res)

                $('[name=cate_id]').html(htmlStr)
            }
        })
    }


    //为筛选绑定submit事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        //获取表单中选项中的值
        var cate_id = $('[cate_id]').val();
        var state = $('[state]').val();
        //为q中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        //重新渲染表格数据
        initTable()
    })


    //定义渲染分页的方法
    function renderPage(total) {
        //调用laypage.render()方法来渲染页面的结构
        laypage.render({
            elem: 'pageBox', //分页容器的Id
            count: total, //总数据条数
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //设置默认被选中的分页

            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 4, 5, 6, 7],

            //分页发生切换的时候 触发jump回调
            jump: function(obj, first) {
                //通过判断first的值 来判断触发jumpd的方式

                // console.log(obj.curr)
                //把最新的页码值赋值到q这个查询参数对象中   
                q.pagenum = obj.curr;

                //把最新的条目数赋值到查询参数q.pagesize
                q.pagesize = obj.limit;

                if (!first) {
                    initTable();
                }
            }
        })
    }

    //通过代理的形式为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function() {
        //拿到页面上删除按钮的个数
        var len = $('.btn-delete').length;

        //询问用户是否要删除数据
        layer.confirm('确认删除!', { icon: 3, title: '提示' }, function(index) {
            //do something
            //获取当前数据的id
            var id = $(this).attr('data-id')
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败!')
                    }
                    layer.msg('删除文章成功!')

                    //当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                    //如果没有剩余的数据了，则让页码值-1之后
                    //再重新调用initTable();

                    if (len === 1) {
                        //如果len的值等于1，证明删除完毕后，页面上就没有任何数据了
                        //页码值最小为1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }


                    initTable();
                    layer.close(index);
                }
            })

        });
    })
})