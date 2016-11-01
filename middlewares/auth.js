nJwt = require('njwt');
nconf = require('nconf');

module.exports = {
    verifyToken: function(req, res, next) {
        // check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['x-access-token'];

        // decode token
        if (token) {

            // verifies secret and checks exp
            nJwt.verify(token, nconf.get("auth:secret"), function(err, verifiedJwt) {
              if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
              } else {
                // if everything is good, save to request for use in other routes
                console.log(verifiedJwt.body);
                req.userId = verifiedJwt.body.sub;
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
    },

    generateToken: function generateToken(id) {
        var claims = {
            sub: id,
            iss: 'https://mediamade.me',
            permissions: 'user'
        };
        var jwt = nJwt.create(claims, nconf.get('auth:secret'));
        jwt.setExpiration(new Date().getTime() + (365*24*60*60*1000));
        return jwt.compact();
    }
}