var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var winston = require('winston');
var nconf = require('nconf');

var generateToken = require('../middlewares/auth').generateToken;

var User = require('../models/user');

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ level: 'info' }),
  ]
});

module.exports = function(passport) {

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, email, password, done) {
        process.nextTick(function() {
            User.findOne({'local.email': email}, function(err, user) {
                logger.info('email: ' + email + ' pw: ' + password);
                if (err) {
                    logger.error("Error signing up: " + err);
                    return done(err);
                }

                if (user) {
                    logger.error('User ' + user + ' already exists!');
                    return done(null, false);
                } else {
                    logger.error('Making a new user!');
                    var newUser = new User();
                    newUser.local.email = email;
                    newUser.local.password = newUser.generateHash(password);


                    newUser.save(function(err) {
                        if (err) {
                            throw err;
                        }

                        req.token = generateToken(newUser.id);

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
        User.findOne({'local.email': email}, function (err, user) {
            if (err) {
                logger.info(err);
                return done(err);
            }

            if (!user) {
                logger.info('No user found');
                return done(null, false);
            }

            if (!user.validPassword(password)) {
                logger.info('Bad password');
                return done(null, false);
            }

            var token = generateToken(user.id);
            req.token = token;
            return done(null, user);
        });
    }));

    passport.use(new FacebookStrategy({
        clientID: '561470640720237',
        clientSecret: 'e625f46ccb8911031afd4d093b9f7381',
        callbackURL: 'http://localhost:8080/login/facebook/return',
        profileFields: ['id', 'displayName', 'gender', 'emails', 'photos'],
        passReqToCallback: true
    },
    function(req, token, refreshToken, profile, done) {
        process.nextTick(function() {
            if (!req.user) {
                User.findOne({'facebook.id': profile.id}, function(err, user) {
                    if(err) {
                        return done(err);
                    }
                    if (user) {
                        return done(null, user);
                    } else {
                        var newUser = new User();

                        newUser.facebook.id = profile.id;
                        newUser.facebook.token = token;
                        newUser.facebook.name = profile.displayName;
                        newUser.facebook.email = profile.emails[0].value;

                        newUser.save(function(err) {
                            if (err) {
                                throw err;
                            }

                            req.token = token;
                            return done(null, newUser);
                        });

                    }
                });
            } else {
                var user = req.user;

                user.facebook.id = profile.id;
                user.facebook.token = token;
                user.facebook.name = profile.displayName;
                user.facebook.email = profile.emails[0].value;

                user.save(function (err) {
                    if (err) {
                        throw err;
                    }

                    req.token = token;
                    return done(null, user);
                });
            }
        });
    }));

    passport.use(new GoogleStrategy({
            clientID: nconf.get('credentials:google:client_id'),
            clientSecret: nconf.get('credentials:google:client_secret'),
            callbackURL: 'https://mediamade.me/auth/google/callback/',
            passReqToCallback: true
        },
        function(req, token, refreshToken, profile, done) {
            process.nextTick(function () {
                User.findOne({'google.id': profile.id}, function (err, user) {
                    if (err) {
                        logger.info(err);
                        return done(err);
                    }

                    if (user) {
                        req.token = token;
                        return done(null, user);
                    } else {
                        var newUser = new User();

                        newUser.google.id = profile.id;
                        newUser.google.token = token;
                        newUser.google.name = profile.displayName;
                        newUser.google.email = profile.emails[0].value;

                        newUser.save(function(err) {
                            if (err) {
                                throw err;
                            }

                            req.token = token;
                            return done(null, newUser);
                        });

                    }


                });
            });
        }
    ));

};