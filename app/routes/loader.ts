var express = require('express');
var fs = require('fs');

var router = express.Router();
var files = fs.readdirSync(__dirname);

files
    .filter(function(file, index){
        return file.split('.')[0] !== 'loader';
    })
    .forEach(function(file, index){
        var route = require('./' + file.split('.')[0]);
        if(file.split('.')[0] === 'index'){
            router.use('/', route);
        }else{
            router.use(`/${file.split('.')[0]}`, route);
        }
    });

module.exports = router;
