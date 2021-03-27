$(function() {
    var layer = layui.layer;
    var form = layui.form;
    initArtCatelist()
        //获取文章分类的列表
    function initArtCatelist() {
        $.ajax({
            methd: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    var indexAdd = null
        // 为添加类别按钮绑定点击事件 
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })

    //通过代理的形式为form-add表单绑定submit事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败')
                }
                initArtCatelist()
                layer.msg('新增分类成功')
                    // 根据索引关闭对应的弹出层
                layer.close(indexAdd)
            }
        })
    })


    //通过代理的形式为btn-edit 按钮绑定点击事件
    var indexEdit = null;
    $('tbody').on('click', '.btn-edit', function() {

        //弹出一个修改文章分类信息层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })

        //通过自定义属性获取当前Id
        var id = $(this).attr('data-id')

        //发起请求获取分类数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                form.val('form-edit', res.data)
            }
        })
    })


    //通过代理形式 为修改分类表单绑定submit事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败')
                }
                layer.msg('更新分类数据成功')
                layer.close(indexEdit)
                initArtCatelist()
            }
        })
    })

    //通过代理的形式为 删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id');
        layer.confirm('是否删除', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章分类失败')
                    }
                    layer.msg('删除文章分类成功')
                    layer.close(index);
                    initArtCatelist()
                }
            })


        });
    })
})