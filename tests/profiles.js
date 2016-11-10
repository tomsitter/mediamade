process.env.NODE_ENV = 'test';

var authMock = {
    verifyToken: function (req, res, next) {
        req.userId = 'test-id-123';
        next();
    }
};

var rewire = require('rewire');
var profiles = rewire('../routes/profiles.js');

profiles.__set__("auth", authMock);

var mongoose = require('mongoose');
var nconf = require('nconf');

var app = require('../app');
var Profile = require('../models/profile.js');
var User = require('../models/user.js');

var chai = require('chai');
var should = chai.should();
var chaiHttp = require('chai-http');

chai.use(chaiHttp);

describe('Profile', function() {

    var token = 'test-token-actual-verifyToken-mocked';

    var profile = {
        name: "Bad Sitter",
        location: "123 Test St",
        description: "We are a badass production studio",
        services: ["AUDIO", "VIDEO", "DRONE", "PHOTO"],
        hourly_rate: "$$",
        team: [{
            name: "Spencer Badanai",
            role: "Director",
            blurb: "I looovvee ice cream"
        }]
    };

    before(function (done) {
        User.remove({}, function() {
            Profile.remove({}, function() {
                done();
            });
        });
    });

    it('should have no profiles at the start', function(done) {
        Profile.find({}, function(err, profiles) {
            should.not.exist(err);
            profiles.should.have.length(0);
            done();
        });
    });

    it('should create a new profile', function(done) {
        chai.request(app).post('/profile')
            .send({token: token, profile: profile})
            .end(function(err, res) {
                should.not.exist(err);
                res.should.have.status(200);
                console.log(res.body);
                done();
        });
    });

    it('should return own profile when passed an authorized token', function(done) {
        chai.request(app).get('/profile')
            .send({'token': token})
            .end(function(err, res) {
                should.not.exist(err);
                res.should.have.status(200);
                console.log(res.body);
                var profile = res.body.profiles[0];
                profile.should.be.an('object');
                done();
        });
    });
});