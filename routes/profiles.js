var winston = require('winston');
var router = require('express').Router();
var auth = require('../middlewares/auth');
var Profile = require('../models/profile.js');
var profileController = require('../controllers/profiles.js');

function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

router.use(auth.verifyToken);

router.route('/v1/profile')
    .post(function(req, res) {
        profileController.create(Profile, req.userId, req.body, res);
    })
    .put(function(req, res) {
        profileController.update(Profile, req.userId, req.body, res);
    })
    .get(function(req, res) {
        Profile.findOne({user_id: req.userId}, function (err, profile) {
            if (err) {
                handleError(res, "No profile", "Can't find profile for this user", 404);
            }

            res.status(200).json(profile);
        });
    });

router.get('/v1/profile/:id', function(req, res) {
    Profile.findOne({user_id: req.params.id}, function(err, profile) {
        if (err) {
            handleError(res, "No profile", "Can't find profile for specified user", 404);
        }

        res.status(200).json(profile);
    });
});

module.exports = router;