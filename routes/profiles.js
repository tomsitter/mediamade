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

        if (!req.body.name) {
            handleError(res, "Invalid profile", "Must provide a name", 400);
        }

        if (!req.userId) {
            handleError(res, "Invalid User ID", "Something wrong with token", 500);
        }

        Profile.findOne({user_id: req.userId}, function(err, profile) {
            if (err) handleError(res, err.message, "Failed to create profile", 500);

            var newProfile = {
                name: req.body.name,
                client_type : req.body.client_type || "",
                user_id : req.userId,
                description : req.body.description || "",
                location : {address: req.body.address || ""},
                services : req.body.services || [],
                tags : req.body.tags || [],
                hourly_rate : req.body.hourly_rate || ""
            };

            if (profile) {
                Profile.update({_id: profile.id}, newProfile)
                    .then(function(createdProfile) {
                        res.status(200).json(createdProfile);
                    })
                    .catch(function(err) {
                        handleError(res, err.message, "Failed to update profile", 500);
                    });
            } else {
                Profile.create(newProfile)
                    .then(function(createdProfile) {
                        res.status(201).json(createdProfile);
                    })
                    .catch(function(err) {
                        handleError(res, err.message, "Failed to create profile", 500);
                    });
            }
        });
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