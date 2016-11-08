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
            client_type: Joi.string(),
            services: Joi.array().items(Joi.string()),
            city: Joi.string(),
            expected_rate: Joi.array().items(Joi.object())
          })
    }),
    function(req, res) {
        WaitList.count({email: req.body.email}, function(err, count) {
            console.log("Found " + count + " existing emails in the waitlist");
            if (count>0) {
                res.status(401).json({"error": "User is already on the waitlist"});
            } else {
                var newCustomer = new WaitList(req.body);


                WaitList.create(newCustomer, function(err, customer) {
                        if (err) {
                            console.log(req.body);
                            console.log(customer);
                            handleError(res, err.message, "Failed to save customer");
                        } else {
                            console.log('Saved new customer to waiting list!');
                            res.status(201).json(customer);
                        }
                    }
                );
            }
        });
    }
);


module.exports = router;