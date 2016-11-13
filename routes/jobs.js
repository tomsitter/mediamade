var winston = require('winston');
var Job = require('../models/job.js');
var auth = require('../middlewares/auth');
var router = require('express').Router();
var validate = require('celebrate');
var Joi = require('joi');
var updateDocument = require('../util/updateDocument').updateDocument;

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

router.use(auth.verifyToken);

var jobProperties = {
    body: Joi.object().keys({
        services: Joi.array().items(Joi.string()),
        products: Joi.array().items(Joi.object()),
        description: Joi.string(),
        tags: Joi.array().items(Joi.string()),
        purpose: Joi.string(),
        status: Joi.string()
    }),
    query: {
        token: Joi.string()
    }
};

router.post('/v1/jobs',
    validate(jobProperties),
    function(req, res) {
        if (!req.userId) {
            handleError(res, "Invalid User ID", "Something wrong with token", 500);
        }

        var newJob = new Job(req.body);
        newJob.user_id = req.userId;

        Job.create(newJob)
            .then(function(job) {
                res.status(201).json(job);
            })
            .catch(function(err) {
                handleError(res, err.message, "Failed to create new job", 500);
        });
    }
);

router.put('/v1/jobs/:id',
    validate(jobProperties),
    function(req, res) {
        Job.findById(req.params.id).exec()
            .then(function(job) {
                if (!job) {
                    res.status(401).json({"error": "Job not found"});
                } else if (! job.user_id.equals(req.userId)) {
                    res.status(403).json({"error": "User does not own this job"});
                } else {
                    var updatedJob = updateDocument(job, Job, req.body);
                    updatedJob.save(function(err) {
                        if (err) {
                            handleError(res, err.message, "Failed to update job", 500);
                        }
                    });
                    res.status(200).json(updatedJob);
                }
            })
            .catch(function(err) {
                handleError(res, err.message, "Failed to update job", 500);
            });
    }
);

router.get('/v1/jobs/:id',
    function(req, res) {
        Job.findOne({_id: req.params.id, $or:[{status: "public"}, {"user_id": req.userId}]}).exec()
            .then(function(job) {
                if (!job) {
                    res.status(401).json({"error": "Job not found"});
                } else {
                    res.status(200).json(job);
                }
            })
            .catch(function(err) {
                handleError(res, err.message, "Failed to retrieve job", 500);
            });
    }
);

router.get('/v1/jobs',
    function(req, res) {
        Job.find({"user_id": req.userId}).exec()
            .then(function(jobs) {
                if (jobs.length == 0) {
                    res.status(401).json({"error": "No jobs found"});
                } else {
                    res.status(200).json(jobs);
                }
            })
            .catch(function(err) {
                handleError(res, err.message, "Failed to retrieve jobs", 500);
            });
    }
);

router.delete('/v1/jobs/:id', function(req, res) {
    Job.findOne({_id: req.params.id, user_id: req.userId}).exec()
        .then(function(job) {
            if (!job) {
                res.status(401).json({"error": "Job not found"});
            } else {
                res.status(200).json(job);
            }
        })
        .catch(function(err) {
            handleError(res, err.message, "Failed to delete job", 500);
        });
});

module.exports = router;