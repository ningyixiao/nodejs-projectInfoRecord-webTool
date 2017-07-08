function getHostPath() {
    //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
    var fullPath = window.document.location.href;
    //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
    var pathName = window.document.location.pathname;
    var pos = fullPath.indexOf(pathName);
    //获取主机地址，如： http://localhost:8083
    var localhostPath = fullPath.substring(0, pos);
    return localhostPath;
}
$(function() {
    // 全局变量
    var global_data = {
        "state": false,
        "add_item_btn": true
    };
    // 标题编辑模态框的相关事件
    $("#editTitle").click(function() {
        $("#editTitleModal").css("display", "block");
    });
    $("#title_cancel_btn").click(function() {
        $("#editTitleModal").css("display", "none");
    });
    $("#title_confirm_btn").click(function() {
        // 先替换标题的文字内容，再关闭模态框
        var title_content = $("#title_content").val();
        if (title_content.length == 0) {
            title_content = "未命名";
        }
        $("#editTitle").html(title_content);
        $("#editTitleModal").css("display", "none");
    });
    // 底部选择列数picker的相关事件
    $("#add_item_btn").click(function() {
        $("#colNumPicker").css("display", "block");
    });
    $("#picker_cancel_btn").click(function() {
        $("#colNumPicker").css("display", "none");
    });
    $(".picker-items").on("click", ".picker-item", function(e) {
            var idx = parseInt($(e.target).data("idx"));
            // 关闭picker的模态框，先判断显示哪一种item模态框，再打开item模态框
            $("#colNumPicker").css("display", "none");
            switch (idx) {
                case 1:
                    $("#oneColItemModal").css("display", "block");
                    break;
                case 2:
                    $("#twoColItemModal").css("display", "block");
                    break;
                case 3:
                    $("#threeColItemModal").css("display", "block");
                    break;
                default:
                    console.log("unknow idx");
            }
        })
        //一列模态框的相关事件
    $("#oneCol_cancel_btn").click(function() {
        $("#oneColItemModal").css("display", "none");
    });
    $("#oneCol_confirm_btn").click(function() {
        // 获取input输入数据
        var key1 = $("input[name='one_key1']").val();
        var value1 = $("input[name='one_value1']").val();
        // 判空
        if (key1.length == 0 || value1.length == 0) {
            return;
        }
        var html = `
            <div class="item item-1">
                <div class="item-col">
                    <div class="item-key-wrap">
                        <p class="item-col-key">${key1}：</p>
                        <span></span>
                    </div>
                    <p class="item-col-value">${value1}</p>
                </div>
            </div>
        `;
        if (global_data.state) {
            $("#item_list").append(html);
        } else {
            $("#item_list").html(html);
            global_data.state = true;
        }
        $("#oneColItemModal").css("display", "none");
    });
    //二列模态框的相关事件
    $("#twoCol_cancel_btn").click(function() {
        $("#twoColItemModal").css("display", "none");
    });
    $("#twoCol_confirm_btn").click(function() {
        // 获取input输入数据
        var key1 = $("input[name='two_key1']").val();
        var value1 = $("input[name='two_value1']").val();
        var key2 = $("input[name='two_key2']").val();
        var value2 = $("input[name='two_value2']").val();
        // 判空
        if (key1.length == 0 || value1.length == 0) {
            return;
        }
        if (key2.length == 0 || value2.length == 0) {
            return;
        }
        var key_arr = [key1, key2];
        var value_arr = [value1, value2];
        var html = "";
        for (var i = 0; i < 2; i++) {
            html += `
                <div class="item-col">
                    <div class="item-key-wrap">
                        <p class="item-col-key">${key_arr[i]}：</p>
                        <span></span>
                    </div>
                    <p class="item-col-value">${value_arr[i]}</p>
                </div>`;
        }
        html = `
            <div class="item item-2">  
                ${html}
            </div>`;
        if (global_data.state) {
            $("#item_list").append(html);
        } else {
            $("#item_list").html(html);
            global_data.state = true;
        }
        $("#twoColItemModal").css("display", "none");
    });
    //三列模态框的相关事件 
    $("#threeCol_cancel_btn").click(function() {
        $("#threeColItemModal").css("display", "none");
    });
    $("#threeCol_confirm_btn").click(function() {
        // 获取input输入数据
        var key1 = $("input[name='three_key1']").val();
        var value1 = $("input[name='three_value1']").val();
        var key2 = $("input[name='three_key2']").val();
        var value2 = $("input[name='three_value2']").val();
        var key3 = $("input[name='three_key3']").val();
        var value3 = $("input[name='three_value3']").val();
        // 判空
        if (key1.length == 0 || value1.length == 0) {
            return;
        }
        if (key2.length == 0 || value2.length == 0) {
            return;
        }
        if (key3.length == 0 || value3.length == 0) {
            return;
        }
        var key_arr = [key1, key2, key3];
        var value_arr = [value1, value2, value3];
        var html = "";
        for (var i = 0; i < 3; i++) {
            html += `
                <div class="item-col">
                    <div class="item-key-wrap">
                        <p class="item-col-key">${key_arr[i]}：</p>
                        <span></span>
                    </div>
                    <p class="item-col-value">${value_arr[i]}</p>
                </div>`;
        }
        html = `
            <div class="item item-3">  
                ${html}
            </div>`;
        if (global_data.state) {
            $("#item_list").append(html);
        } else {
            $("#item_list").html(html);
            global_data.state = true;
        }
        $("#threeColItemModal").css("display", "none");
    });
    // 添加项目按钮的相关事件
    $(".btn").hover(function(e) {
        e.stopPropagation();
        $(this).toggleClass("btn_hover");
    });
    // 隐藏添加项目按钮的相关事件
    $(".btn_hidden").click(function(e) {
        e.stopPropagation();
        if (global_data.add_item_btn) {
            $("#add_item_btn").css("display", "none");
            $(this).html("显示");
            global_data.add_item_btn = false;
        } else {
            $("#add_item_btn").css("display", "inline-block");
            $(this).html("隐藏");
            global_data.add_item_btn = true;
        }
    });
    // 保存html按钮相关事件
    $(".btn_html").click(function() {
        $("#setHtmlNameModal").css("display", "block");
    });
    $("#setName_cancel_btn").click(function() {
        $("#setHtmlNameModal").css("display", "none");
    });
    $("#setName_confirm_btn").click(function() {
        var htmlCode = "<!DOCTYPE html>" + document.documentElement.outerHTML;
        var htmlFileName = $("#html_fileName").val();
        $.ajax({
            url: '/html',
            type: 'post',
            data: { "code": htmlCode, "fileName": htmlFileName },
            dataType: 'json',
            success: function(data) {
                alert(data.msg);
                // console.log("1");
                window.location.href = getHostPath()+"/";
            },
            error: function() {
                // console.log("2");
            }
        });
    });
    // 下载pdf按钮相关事件
    $(".btn_pdf").click(function() {
        var pageUrl = window.document.location.href;
        var pathName = window.document.location.pathname;
        if (pathName == '/add') {
            alert('请在生成的html页面中进行生成pdf操作');
            return;
        }
        $.ajax({
            url: '/pdf',
            type: 'get',
            data: { "pageUrl": pageUrl },
            dataType: 'json',
            success: function(data) {
                alert(data.msg);
                // console.log("1");
                window.location.href = getHostPath()+"/";
            },
            error: function() {
                // console.log("2");
            }
        });
    });
});
