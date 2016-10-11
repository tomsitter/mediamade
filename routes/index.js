var express = require('express');
var winston = require('winston');
var router = express.Router();

router.get('/', function(req, res) {
    res.send('Home page');
});

module.exports = router;