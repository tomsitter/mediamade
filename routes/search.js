var winston = require('winston');
var router = require('express').Router();
var Profile = require('../models/profile.js');
var auth = require('../middlewares/auth');

module.exports = function (passport) {
    function logErrors(err, req, res, next) {
      console.error(err.stack);
      next(err);
    }

    router.use(logErrors);

    router.get('/profile', auth.verifyToken, function(req, res) {
        Profile.find({}, function(err, profiles) {
            res.status(200).json({
                profiles: profiles
            });
        });
    });

    return router;
};