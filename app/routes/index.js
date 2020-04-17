var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hey', message: 'Hello there!' })
});

router.get('/index.html', function(req, res, next) {
  res.send(res)
});

module.exports = router;
