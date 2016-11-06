var winston = require('winston');
var router = require('express').Router();
var auth = require('../middlewares/auth');
var Profile = require('../models/profile.js');

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

        Profile.count({user: req.userId}, function(err, count) {
            console.log("Found " + count + " existing profiles for this user");
            if (count>0) {
                res.status(401).json({"error": "Profile already exists for this user"});
            } else {
                var newProfile = new Profile();

                newProfile.name = req.body.name;
                newProfile.user = req.userId;
                newProfile.description = req.body.description || '';
                newProfile.location.address = req.body.address || '';
                newProfile.services = req.body.services || [];
                newProfile.tags = req.body.tags || [];
                newProfile.hourly_rate = req.body.hourly_rate || '';

                console.log('Creating profile for user: ' + req.userId);

                Profile.create(newProfile, function(err, profile) {
                        if (err) {
                            handleError(res, err.message, "Failed to create new profile");
                        } else {
                            console.log('Saved new profile!');
                            res.status(201).json(profile);
                        }
                    }
                );
            }
        });

    })
    .put(function(req, res) {
        Profile.findOne({user: req.userId}, function(err, profile) {
            if (err) {
                handleError(res, err.message, "Failed to update user profile");
            } else if (!profile) {
                res.status(404).json({"error": "No profile found for user"});
            } else {
                if (!req.body.name) {
                    handleError(res, "Invalid profile", "Must provide a name", 400);
                }

                if (!req.userId) {
                    handleError(res, "Invalid User ID", "Something wrong with token", 500);
                }
                console.log(profile);

                profile.name = req.body.name;
                profile.description = req.body.description || '';
                var address = req.body.address || '';
                profile.location = {address: address};
                profile.services = req.body.services || [];
                profile.tags = req.body.tags || [];
                profile.hourly_rate = req.body.hourly_rate || '';

                profile.save(function(err) {
                    if (err) {
                        handleError(res, err.message, "Failed to save new profile");
                    }
                    res.status(201).json({profile: profile});
                });
            }
        });
    })
    .get(function(req, res) {
        Profile.findOne({user: req.userId}, function (err, profile) {
            if (err) {
                handleError(res, "No profile", "Can't find profile for this user", 404);
            }

            res.status(201).json(profile);
        });
    });

router.get('/v1/profile/:id', function(req, res, next) {
    Profile.findOne({user: req.params.id}, function(err, profile) {
        if (err) {
            handleError(res, "No profile", "Can't find profile for specified user", 404);
        }

        res.status(201).json(profile);
    });
});

module.exports = router;