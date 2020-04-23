var express = require('express');
var router = express.Router();
var templateHTML = require('../template/defaultIframe');
var db = require('../../db');
router.get('/', function (req, res, next) {
    // res.render('index');
    //查询users表
    db.query("SELECT * FROM users", function (results, fields) {
        res.send(fields);
    });
});
router.get('/index.html', function (req, res, next) {
    res.writeHead(200, {
        'Content-Type': 'text/html',
        'Expires': new Date().toUTCString()
    });
    res.write(templateHTML.startHTML);
    res.write('测试\n');
    res.end(templateHTML.endHTML);
});
module.exports = router;
//# sourceMappingURL=index.js.map