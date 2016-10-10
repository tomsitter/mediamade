var express = require('express');
var winston = require('winston');
var passport = require('passport');
var router = express.Router();
var User = require('../models/user.js');
router.get('/register', function(req, res) {
    res.status(200).send('register');
});

router.post('/register', function(req, res) {
    winston.info('In register callback');
    User.register(
        new User({ username: req.body.username}), req.body.password,
        function(err, user) {
            winston.info('In register callback');
            if (err) {
                winston.info('In err callback' + err);
                return res.json({ user: user });
            }

            passport.authenticate('local')(req, res, function() {
                winston.info('In authenticate');
                res.redirect('/');
            });
        }
    );
});

router.get('/login', function(req, res) {
    winston.info('In login: ' + req.user);
    res.json({ user : req.user });
});

router.post('/login',
            passport.authenticate('local'),
            function(req, res) {
                res.send('/users/' + req.user.username);
});

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});

module.exports = router;