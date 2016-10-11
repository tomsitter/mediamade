var winston = require('winston');
var User = require('../models/user.js');

module.exports = function (app, passport) {

    /* GET users listing. */
    app.get('/users', function(req, res, next) {
        res.send('respond with a resource');
    });

    app.get('/profile', isLoggedIn, function(req, res) {
        res.send({user: req.user});
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // POST for RESTful API

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup'
    }));

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login'
    }));
};


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        winston.warn(req.user + ' is logged in!');
        return next();
    }
    winston.warn(req.user + ' is not logged in!');
    res.redirect('/');
}