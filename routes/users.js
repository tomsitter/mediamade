var winston = require('winston');
var router = require('express').Router();
var User = require('../models/user.js');
var tokens = require('../middlewares/tokens');

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


    /* GET users listing. */

    router.get('/users', function(req, res, next) {
        res.send('respond with a resource');
    });

    router.get('/profile', tokens.verifyToken, function(req, res) {
        res.status(200).json({profile:
            {
              "name": "Bad Sitter",
              "location": "Toronto",
              "description": "We are a bad ass media production company.",
              "services": ["AUDIO", "VIDEO", "AERIAL", "ANIMATION"],
              "reviews": [{
                "reviewer": "Tom Sitter",
                "rating": 1,
                "review": "WTF did I just purchase???"
              }],
              "team": [
                {
                  "name": "Greg Smith",
                  "role": "Director",
                  "blurb": "Greg has a long career in directing BDSM and alternative pornos"
                },
                {
                  "name": "Spencer Badanai",
                  "role": "Actor",
                  "blurb": "Spencer has long dreamed to work as a gay pornstar in BDSM shoots"
                }
              ],
              "hourly_rate": "$1000 per 1 minute finished product",
              "portfolio": [{
                "media_type": "YOUTUBE",
                "source": "https://www.youtube.com/watch?v=VkJd4h5T2kg",
                "customer": "Tom Sitter",
                "price": "$1000",
                "description": "A short extreme anal penetration video"
              }]
            }
        });
    });

    router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


    // POST for RESTful API

    router.post('/signup',
        passport.authenticate('local-signup', {session: false}),
        tokens.generateToken, function(req, res) {
            res.status(200).json({
                user: req.user,
                token: req.token
            });
        });

    router.post('/login', passport.authenticate('local-login', {
        session: false
    }), tokens.generateToken, function(req, res) {
        res.status(200).json({
            user: req.user,
            token: req.token
        });
    });

    return router;
};