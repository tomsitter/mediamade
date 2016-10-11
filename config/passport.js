var LocalStrategy = require('passport-local').Strategy;
var winston = require('winston');

var User = require('../models/user');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, email, password, done) {
        process.nextTick(function() {
            User.findOne({'local.email': email}, function(err, user) {
                if(err)
                    return done(err);

                if (user) {
                    return done(null, false);
                } else {
                    var newUser = new User();
                    newUser.local.email = email;
                    newUser.local.password = newUser.generateHash(password);

                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        });
    }));

    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passportField: 'password',
        passReqToCallback: true
    },
    function(req, email, password, done) {
        winston.info('email: ' + email + 'pw: ' + password);
        console.log('email: ' + email + 'pw: ' + password);
        User.findOne({'local.email': email}, function (err, user) {
            if (err) {
                winston.info(err);
                return done(err);
            }

            if (!user) {
                winston.info('No user found');
                return done(null, false);
            }

            if (!user.validPassword(password)) {
                winston.info('Bad password');
                return done(null, false);
            }

            winston.info('Found customer!');
            return done(null, user);
        });
    }));
};