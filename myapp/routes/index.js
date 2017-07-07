var express = require('express');
var router = express.Router();
// 中间件用于html转pdf
var phantom = require('phantom');
// 中间件用于解析http请求
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
// fs中间件用于处理文件系统
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

/* Download pdf file. */
// 只有先保存为html文件，才能在保存的那个html上使用生成pdf功能
router.get('/pdf', function(req, res, next) {
    // get方法直接用query获取参数
    var pageUrl = req.query.pageUrl;
    phantom.create().then(function(ph) {
        ph.createPage().then(function(page) {
            page.open(pageUrl).then(function(status) {
                page.render('public/pdf/1.pdf').then(function() {
                    console.log('Page Rendered');
                    ph.exit();
                });
            });
        });
    });
});

/* Receive html code and save them into a html file. */
router.post('/html', urlencodedParser, function(req, res, next) {
    /* req.body对象
       包含POST请求参数
       这样命名是因为POST请求参数在REQUEST正文中传递，而不是像查询字符串在URL中传递。
       要使req.body可用，可使用中间件body-parser
    */
    var code = req.body.code;
    fs.writeFile('public/html/1.html', code, (err) => {
        if (err) {
            console.log("save file fail.")
        } else {
            console.log('The file has been saved!');
            res.json({ "msg": "保存成功", "state": 1 });
        }
    });
});

module.exports = router;
