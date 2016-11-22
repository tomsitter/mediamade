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
    var mainUserToken = "main-user-token";
    var altUserId = mongoose.Types.ObjectId();
    var altUserToken = "alt-user-token";

    before(function (done) {
        Profile.remove({}, function() {
            mockery.enable({
              warnOnReplace: false,
              warnOnUnregistered: false,
              useCleanCache: true
            });
            authMock = {
                verifyToken: function (req, res, next) {
                    if (req.query.token === mainUserToken) {
                        req.userId = mainUserId;
                    } else {
                        req.userId = altUserId;
                    }
                    next();
                }
            };
            mockery.registerMock("../middlewares/auth", authMock);

            app = require("../app.js");
            done();
        });
    });

    after(function (done) {
        mockery.disable();
        done();
    });

    var token = "test-token";

    var testProfile = {
        name: "Original Name",
        client_type: "CLIENT",
        address: "49 Amroth Ave, Toronto, Ontario, Canada",
    };

    it("create a new profile", function(done) {
        chai.request(app).post("/api/v1/profile?token=" + mainUserToken)
            .send(testProfile)
            .end(function(err, res) {
                should.not.exist(err);
                res.should.have.status(201);
                profileId = res.body._id;
                done();
        });
    });

    it("get own profile", function(done) {
        chai.request(app).get("/api/v1/profile?token=" + mainUserToken)
            .end(function(err, res) {
                should.not.exist(err);
                res.should.have.status(200);
                console.log("Profile Id" + profileId);
                res.body._id.should.equal(profileId);
                done();
        });
    });

    it("change the name", function(done) {
        testProfile.name = 'Changed Name';
        chai.request(app).put("/api/v1/profile?token=" + mainUserToken)
            .send(testProfile)
            .end(function(err, res) {
                should.not.exist(err);
                res.should.have.status(200);
                res.body.name.should.equal("Changed Name");
                done();
            });
    });

    it("get specified profile", function(done) {
        chai.request(app).get("/api/v1/profile/" + mainUserId + '?token=' + altUserToken)
            .end(function(err, res) {
                should.not.exist(err);
                res.should.have.status(200);
                console.log(res.body);
                res.body._id.should.equal(profileId);
                res.body.name.should.equal("Changed Name");
                done();
            });
    });


});