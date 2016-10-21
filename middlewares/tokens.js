var jwt = require('jsonwebtoken');
var nconf = require('nconf');

module.exports = {
    generateToken: function(req, res, next) {
        req.token = jwt.sign({
            id: req.user.id
        }, nconf.get("auth:secret"), {
            expiresIn: '7d'
        });
        next();
    },
    verifyToken: function(req, res, next) {
        // check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['x-access-token'];

        // decode token
        if (token) {

            // verifies secret and checks exp
            jwt.verify(token, nconf.get("auth:secret"), function(err, decoded) {
              if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
              } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
              }
            });

        } else {

            // if there is no token
            // return an error
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });

        }
    }
};

