var express = require('express');
var router = express.Router();
var templateHTML = require('../template/defaultIframe');

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/index.html', function(req, res, next) {
  res.writeHead(200, {
    'Content-Type': 'text/html',
    'Expires': new Date().toUTCString()
  });
  res.write(templateHTML.startHTML);
  res.write('测试\n');
  res.end(templateHTML.endHTML);
});

module.exports = router;
