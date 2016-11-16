process.env.NODE_ENV = "test";

var mockery = require("mockery");
var chai = require("chai");
var should = chai.should();
var chaiHttp = require("chai-http");
var mongoose = require("mongoose");
var Profile = require('../models/profile.js');

chai.use(chaiHttp);

describe("Profile", function() {

    var app, authMock;
    var profileId;
    var mainUserId = mongoose.Types.ObjectId();
    var altUserId = mongoose.Types.ObjectId();
    var userId = mainUserId;

    before(function (done) {
        mockery.enable({
          warnOnReplace: false,
          warnOnUnregistered: false,
          useCleanCache: true
        });
        authMock = {
            verifyToken: function (req, res, next) {
                req.userId = userId;
                next();
            }
        };
        mockery.registerMock("../middlewares/auth", authMock);

        app = require("../app.js");

        done();
    });

    after(function (done) {
        mockery.disable();
        Profile.remove({}, function() {
            done();
        });

    });

    var token = "test-token";

    var testProfile = {
        name: "Original Name",
        client_type: "CLIENT",
        location: "123 Fake St",
    };

    it("create a new profile", function(done) {
        chai.request(app).post("/api/v1/profile?token=" + token)
            .send(testProfile)
            .end(function(err, res) {
                should.not.exist(err);
                res.should.have.status(201);
                profileId = res.body._id;
                done();
        });
    });

    it("get own profile", function(done) {
        chai.request(app).get("/api/v1/profile?token=" + token)
            .end(function(err, res) {
                should.not.exist(err);
                res.should.have.status(200);
                res.body._id.should.equal(profileId);
                console.log(res.body);
                done();
        });
    });

    it("change the name", function(done) {
        userId = mainUserId;
        testProfile.name = 'Changed Name';
        chai.request(app).put("/api/v1/profile?token=rightusertoken")
            .send(testProfile)
            .end(function(err, res) {
                should.not.exist(err);
                res.should.have.status(200);
                res.body.name.should.equal("Changed Name");
                done();
            });
    });

    it("get specified profile", function(done) {
        userId = altUserId;
        chai.request(app).get("/api/v1/profile/" + mainUserId + '?token=wronguserid')
            .end(function(err, res) {
                should.not.exist(err);
                res.should.have.status(200);
                res.body._id.should.equal(profileId);
                res.body.name.should.equal("Changed Name");
                done();
            });
    });


});