var winston = require('winston');
var router = require('express').Router();
var User = require('../models/user.js');
var Profile = require('../models/profile.js');
var auth = require('../middlewares/auth');

module.exports = function (passport) {

    // Facebook
    // AUTHENTICATE (first login)

    // Send to FB to do authentication
    router.get('/auth/facebook',
        passport.authenticate('facebook', {scope: ['email', 'user_location']}));

    // handle callback after facebook has authenticated
    router.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect: '/profile',
        failureRedirect: '/'
    }));

    router.get('/auth/google',
        passport.authenticate('google', { scope: ['']}));

    router.get('/auth/google/callback',
        passport.authenticate('google', {}),
        function(req, res) {
           res.send({'success': 'true'});
        });


    // AUTHORIZE (Connecting other social account)

    // locally

    router.post('/connect/local', passport.authenticate('local-signup', {}));

    // facebook
    router.get('/connect/facebook',
        passport.authorize('facebook', {scope: ['email', 'user_location']}));

    router.get('/connect/facebook/callback',
        passport.authorize('facebook', {
            successRedirect: '/profile',
            failureRedirect: '/'
        }));

    // google
    router.get('/connect/google',
        passport.authorize('google', {scope: ['profile', 'email']}));

    router.post('/profile', auth.verifyToken, function(req, res, next) {
        User.findById(req.userId, function(err, user) {
            var profile = new Profile(req.body);
            profile.save(function(err, profile) {
                user.profile = profile.id;
                user.save(function (err, user) {
                if (err) {
                    return next(err);
                }
                res.status(201).json(profile);
              });
            });
        });
    });

    router.get('/profile', auth.verifyToken, function(req, res, next) {
        User.findById(req.userId, function(err, user) {
            Profile.findById(user.profile, function(err, profile) {
                res.status(201).json(profile);
            });
        });
    });

    // POST for RESTful API

    router.post('/signup', passport.authenticate('local-signup', {session: false}),
        function(req, res) {
            res.status(200).json({
                token: req.body.token
            });
        }
    );

    router.post('/login', passport.authenticate('local-login', {session: false}),
        function(req, res) {
            res.status(200).json({
                token: req.body.token
            });
        }
    );

    return router;
};