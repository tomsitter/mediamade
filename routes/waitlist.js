var winston = require('winston');
var router = require('express').Router();
var WaitList = require('../models/waitlist');
var Joi = require('joi');
var validate = require('celebrate');

function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

router.post('/v1/waitlist',
    validate({
        body: Joi.object().keys({
            email: Joi.string().email().required(),
            survey: Joi.object().keys({
                client_type: Joi.string(),
                services: Joi.array().items(Joi.string()),
                city: Joi.string(),
                photo_price: [Joi.string(), Joi.number()],
                video_price: [Joi.string(), Joi.number()]
            })
        })
    }),
    function(req, res) {
        WaitList.update({email: req.body.email}, req.body, {upsert: true, setDefaultsOnInsert: true})
            .then(function(waitlist) {
                if ("upserted" in waitlist) {
                    res.status(201).json(waitlist);
                } else {
                    res.status(200).json(waitlist);
                }
            })
            .catch(function(err) {
                handleError(res, err.message, "Failed to add customer to waitlist", 500);
            });

        // WaitList.findOne({email: req.body.email}, function(err, waitlist) {
        //     if (waitlist) {
        //         res.status(401).json({"error": "User is already on the waitlist"});
        //     } else {
        //         var newSurvey = new WaitList(req.body);
        //
        //         WaitList.create(newSurvey, function(err, survey) {
        //                 if (err) {
        //                     console.log(req.body);
        //                     console.log(survey);
        //                     handleError(res, err.message, "Failed to save customer");
        //                 } else {
        //                     console.log('Saved new customer to waiting list!');
        //                     res.status(201).json(survey);
        //                 }
        //             }
        //         );
        //     }
        // });
    }
);


module.exports = router;