var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
var nJwt = require('njwt');
var nconf = require('nconf');

var User = new Schema({
    last_login: {type: Date, index: true},
    user_type: {type: String, index: true, required: true},
    local: {
        email: String,
        password: String
    },
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    twitter: {
        id: String,
        token: String,
        displayName: String,
        username: String
    },
    google: {
        id: String,
        token: String,
        displayName: String,
        username: String
    }},
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);

User.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

User.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

User.methods.generateToken = function() {
    var claims = {
        sub: this._id,
        iss: 'https://mediamade.me',
        permissions: this.user_type
    };
    var jwt = nJwt.create(claims, nconf.get('auth:secret'));
    jwt.setExpiration(new Date().getTime() + (365*24*60*60*1000));
    return jwt.compact();
};

module.exports = mongoose.model('User', User);