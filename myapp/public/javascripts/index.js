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
    // 监听所有的project的mouseenter事件
    $(".project").mouseenter(function(e) {
        var that = $(this);
        that.children(".mask").addClass("mask_hover");
    });
    $(".project .mask").mouseleave(function(e) {
        var that = $(this);
        that.removeClass("mask_hover");
    });
    // 监听编辑和查看按钮的点击事件
    // 编辑按钮查看html文件
    // 查看按钮查看pdf文件
    $(".edit_html").click(function(e) {
        var target = $(e.target);
        var hostPath = getHostPath();
        var fileName = target.attr("name");
        var fileFullPath = hostPath + "/html/" + fileName;
        window.location.href = fileFullPath;
    });
    $(".view_pdf").click(function(e) {
        var target = $(e.target);
        var hostPath = getHostPath();
        var fileName = target.attr("name");
        var fileFullPath = hostPath + "/pdf/" + fileName;
        window.location.href = fileFullPath;
    });
    // 添加新项目的信息点击事件
    $(".add_new_project").click(function(){
        var hostPath = getHostPath();
        window.location.href = hostPath+"/add";
    });
})
