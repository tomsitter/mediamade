var winston = require('winston');
var router = require('express').Router();
var validate = require('celebrate');
var Joi = require('joi');

var signupValidation = {
    body: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        user_type: Joi.string().required(),
    })
};

var loginValidation = {
    body: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    })
};

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

    router.post('/v1/signup',
        validate(signupValidation),
        passport.authenticate('local-signup', {session: false}),
        function(req, res) {
            res.status(200).json({
                token: req.token
            });
        }
    );

    router.post('/v1/login',
        validate(loginValidation),
        passport.authenticate('local-login', {session: false}),
        function(req, res) {
            res.status(200).json({
                token: req.token
            });
        }
    );

    router.use(validate.errors());

    return router;
};