var express = require('express');
var router = express.Router();
var squareup = require('../data/squareup');


router.get('/', function(req, res){
  squareup.getSales()
  .then(function(data){
    res.json(data);
  });
});


module.exports = router;
