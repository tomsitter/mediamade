process.env.NODE_ENV = 'test';

var mongoose = require('mongoose');
var nconf = require('nconf');
var app = require('../app');

var User = require('../models/user.js');

var chai = require('chai');
var should = chai.should();
var chaiHttp = require('chai-http');

chai.use(chaiHttp);

describe('Local Sign Up', function () {

    before(function (done) {
        User.remove({}, function() {
            done();
        });
    });

    it('should have no users at the start', function(done) {
        User.find({}, function(err, users) {
            should.not.exist(err);
            users.should.have.length(0);
            done();
        });
    });

    it('should create a new user', function(done) {
        chai.request(app).post('/api/v1/signup')
            .send({'email': 'test@test.com', 'password': 'test'})
            .end(function(err, res) {
                should.not.exist(err);
                res.should.have.status(200);
                res.body.should.have.property('token');
                done();
        });
    });

    it('should not create the same user', function(done) {
        chai.request(app).post('/api/v1/signup')
            .send({'email': 'test@test.com', 'password': 'test'})
            .end(function(err, res) {
                should.exist(err);
                res.should.have.status(401);
                res.body.should.not.have.property('token');
                done();
        });
    });
});

describe('Local Log In', function() {
    before(function (done) {
        User.remove({}, function() {
            done();
        });
    });

    it('should have no users at the start', function(done) {
        User.find({}, function(err, users) {
            should.not.exist(err);
            users.should.have.length(0);
            done();
        });
    });

    it('should create a new user', function(done) {
        chai.request(app).post('/api/v1/signup')
            .send({'email': 'test@test.com', 'password': 'test'})
            .end(function(err, res) {
                should.not.exist(err);
                res.should.have.status(200);
                res.body.should.have.property('token');
                done();
        });
    });

    it('should return a token when logging in', function(done) {
        chai.request(app).post('/api/v1/login')
            .send({'email': 'test@test.com', 'password': 'test'})
            .end(function(err, res) {
                should.not.exist(err);
                res.should.have.status(200);
                res.body.should.have.property('token');
                done();
        });
    });

    it('should return an error when logging in with wrong password', function(done) {
        chai.request(app).post('/api/v1/login')
            .send({'email': 'test@test.com', 'password': 'wrong'})
            .end(function(err, res) {
                should.exist(err);
                res.should.have.status(401);
                done();
        });
    });
});

describe('Google Login', function() {
    before(function(done) {
        User.remove({}, function() {
            done();
        });
    });

    it('should have no users at the start', function(done) {
        User.find({}, function(err, users) {
            should.not.exist(err);
            users.should.have.length(0);
            done();
        });
    });

    it('should create a new user', function(done) {
        chai.request(app).post('/api/v1/signup')
            .send({'email': 'test@test.com', 'password': 'test'})
            .end(function(err, res) {
                should.not.exist(err);
                res.should.have.status(200);
                res.body.should.have.property('token');
                done();
        });
    });

});


describe('Profile', function() {
    before(function (done) {
        User.remove({}, function() {
            done();
        });
    });

    it('should have no users at the start', function(done) {
        User.find({}, function(err, users) {
            should.not.exist(err);
            users.should.have.length(0);
            done();
        });
    });

    it('should create a new user', function(done) {
        chai.request(app).post('/api/v1/signup')
            .send({'email': 'test@test.com', 'password': 'test'})
            .end(function(err, res) {
                should.not.exist(err);
                res.should.have.status(200);
                res.body.should.have.property('token');
                done();
        });
    });

    it('should return a token when logging in', function(done) {
        chai.request(app).post('/api/v1/login')
            .send({'email': 'test@test.com', 'password': 'test'})
            .end(function(err, res) {
                should.not.exist(err);
                res.should.have.status(200);
                res.body.should.have.property('token');
                done();
        });
    });

    it('should return all profiles when passed an authorized token', function(done) {
        chai.request(app).post('/api/v1/login')
            .send({'email': 'test@test.com', 'password': 'test'})
            .end(function(err, res) {
                should.not.exist(err);
                res.should.have.status(200);
                res.body.should.have.property('token');
                var token = res.body.token;

                chai.request(app).get('/api/v1/profile')
                    .send({'token': token})
                    .end(function(err, res) {
                        should.not.exist(err);
                        res.should.have.status(200);
                        res.body.profiles.should.have.length(1);
                        var profile = res.body.profiles[0];
                        profile.should.be.an('object');
                        done();
                });
        });
    });
});