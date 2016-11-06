var winston = require('winston');
var router = require('express').Router();

module.exports = function (passport) {

    // Facebook
    // AUTHENTICATE (first login)

    // Send to FB to do authentication
    router.get('/auth/facebook',
        passport.authenticate('facebook', {scope: ['email', 'user_location']}));

    router.get('/auth/google',
        passport.authenticate('google', { scope: ['']}));

    // AUTHORIZE (Connecting other social account)

    // locally
    router.post('/connect/local',
        passport.authenticate('local-signup', {}));

    // facebook
    router.post('/connect/facebook',
        passport.authorize('facebook', {scope: ['email', 'user_location']}));

    // google
    router.post('/connect/google',
        passport.authorize('google', {scope: ['profile', 'email']}));

    // POST for RESTful API

    router.post('/signup', passport.authenticate('local-signup', {session: false}),
        function(req, res) {
            res.status(200).json({
                token: req.token
            });
        }
    );

    router.post('/login', passport.authenticate('local-login', {session: false}),
        function(req, res) {
            res.status(200).json({
                token: req.token
            });
        }
    );

    return router;
};