var express = require('express');
var router = express.Router();
// 中间件用于html转pdf
var phantom = require('phantom');
// 中间件用于解析http请求
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
// fs中间件用于处理文件系统
var fs = require('fs');
// 由于很多异步回调函数，因此这里使用该模块进行流程控制
var async = require('async');

// 将.html后缀替换成.pdf
function suffixHtmltoPdf(fileNameArr) {
    var arr = fileNameArr.concat();
    for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].slice(0, arr[i].length - 5) + ".pdf";
    }
    return arr;
}
// 用于生产views/html/index.html
function generateNullIndexHTML() {
    var htmlCode = `
            <div class="project no-padding add_new_project">
                <div class="pro_desc">
                    <i class="fa fa-plus" aria-hidden="true"></i>
                </div>
            </div>
        `;
    fs.writeFile('views/html/index.html', htmlCode, (err) => {
        if (err) {
            console.log("generate index.html fail!")
        } else {
            console.log('generate index.html success.');
        }
    });
}

function generateIndexHTML(fileNameArr, titleArr) {
    var htmlCode = "";
    var style = "";
    var pdfNameArr = suffixHtmltoPdf(fileNameArr);
    for (var i = 0; i < fileNameArr.length; i++) {
        if (i % 4 == 0) {
            style = "no-padding";
        } else {
            style = "";
        }
        htmlCode += `
            <div class="project ${style}">
                <div class="pro_desc">
                    <p>${titleArr[i]}</p>
                </div>
                <div class="mask">
                    <div class="btn_area">
                        <span name="${fileNameArr[i]}" class="edit_html">编辑</span>
                        <span name="${pdfNameArr[i]}" class="view_pdf">查看</span>
                    </div>
                </div>
            </div>
        `;
    }
    htmlCode += `
        <div class="project add_new_project">
            <div class="pro_desc">
                <i class="fa fa-plus" aria-hidden="true"></i>
            </div>
         </div>
    `;
    fs.writeFile('views/html/index.html', htmlCode, (err) => {
        if (err) {
            console.log("generate index.html fail!")
        } else {
            console.log('generate index.html success.');
        }
    });
}

// GET index page
router.get('/', function(req, res, next) {
    // 先判断public/html以及public/pdf是否存在
    if(!fs.existsSync('public/html')){
        fs.mkdirSync('public/html');
    }
    if(!fs.existsSync('public/pdf')){
        fs.mkdirSync('public/pdf');
    }
    fs.readdir('public/html', (err, files) => {
        if (err) throw err;
        var str = files.join();
        // 找出.html的文件
        var fileNameArr = str.match(/\w*.html/g);
        if (fileNameArr == null) {
            generateNullIndexHTML();
        } else {
            async.waterfall([
                function(done) {
                    // 异步遍历目录下的所有文件
                    fs.readdir('public/html', (err, files) => {
                        if (err) throw err;
                        var str = files.join();
                        // 找出.html的文件
                        var fileNameArr = str.match(/\w*.html/g);
                        done(null, fileNameArr);
                    });
                },
                function(fileNameArr, done) {
                    var titleArr = [];
                    for (var i in fileNameArr) {
                        fs.readFile('public/html/' + fileNameArr[i], 'utf8', (err, data) => {
                            if (err) throw err;
                            // 匹配文件的title标签内容
                            var title = data.match(/\<span id=\"editTitle\"\>(\w|[^\u0000-\u00FF])*\<\/span\>/g);
                            title = title[0].slice(21);
                            title = title.slice(0, title.length - 7);
                            titleArr.push(title);
                        });
                    }
                    setTimeout(function() {
                        done(null, fileNameArr, titleArr);
                    }, 100);
                },
                function(fileNameArr, titleArr, done) {
                    // console.log(fileNameArr, titleArr);
                    generateIndexHTML(fileNameArr, titleArr);
                    done(null);
                }
            ], function(err, result) {
                if (err) throw err;
            })
        }
    });
    res.render("index");
});

/* GET add project info page. */
router.get('/add', function(req, res, next) {
    res.render('addProInfo');
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
                    res.json({ "msg": "保存pdf成功", "state": 1 });
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
    var fileName = req.body.fileName;
    fs.writeFile('public/html/'+fileName+'.html', code, (err) => {
        if (err) {
            console.log("save file fail.")
            res.json({ "msg": "保存失败", "state": 0 });
        } else {
            console.log('The file has been saved!');
            res.json({ "msg": "保存成功", "state": 1 });
        }
    });
});

module.exports = router;
