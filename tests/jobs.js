process.env.NODE_ENV = "test";

// var rewire = require("rewire");
var mockery = require("mockery");
var chai = require("chai");
var should = chai.should();
var chaiHttp = require("chai-http");
var mongoose = require("mongoose");
var Job = require('../models/job.js');

chai.use(chaiHttp);

describe("Jobs", function() {

    var app, authMock;
    var jobId;
    var mainUserId = mongoose.Types.ObjectId();
    var mainUserToken = "main-user-token";
    var altUserId = mongoose.Types.ObjectId();
    var altUserToken = "alt-user-token";

    before(function (done) {
        Job.remove({}, function() {
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

    var testJob = {
        services: ["PHOTO", "VIDEO"],
        products: [{
            product_type: "PHOTO",
            amount: 10,
            description: "Photos of cats doing a barrel roll",
            size: "HD"
        }],
        description: "I love cats and there needs to be more of them on instagram",
        tags: ["ANIMAL", "INSTAGRAM"],
        purpose: "Personal",
        status: "public"
    };


    it("create a new job", function(done) {
        chai.request(app).post("/api/v1/jobs?token=" + mainUserToken)
            .send(testJob)
            .end(function(err, res) {
                should.not.exist(err);
                res.should.have.status(201);
                jobId = res.body._id;
                done();
        });
    });

    it("find the public job", function(done) {
        chai.request(app).get("/api/v1/jobs/" + jobId + '?token=' + altUserToken)
            .end(function(err, res) {
                should.not.exist(err);
                res.should.have.status(200);
                done();
            });
    });

    it("make the job status pending", function(done) {
        testJob.status = 'pending';
        chai.request(app).put("/api/v1/jobs/" + jobId + "?token=" + mainUserToken)
            .send(testJob)
            .end(function(err, res) {
                should.not.exist(err);
                res.should.have.status(200);
                res.body.status.should.equal("pending");
                done();
            });
    });

    it("not find a pending job with the wrong user Id", function(done) {
        chai.request(app).get("/api/v1/jobs/" + jobId + "?token=" + altUserToken)
            .end(function(err, res) {
                res.should.have.status(401);
                done();
            });
    });

    it("finds all jobs for main user", function(done) {
        chai.request(app).get("/api/v1/jobs?token=" + mainUserToken)
            .end(function(err, res) {
                res.should.have.status(200);
                done();
            });
    });

    it("finds NO jobs for alt user", function(done) {
        chai.request(app).get("/api/v1/jobs?token=" + altUserToken)
            .end(function(err, res) {
                res.should.have.status(401);
                done();
            });
    });

    it("deletes NO jobs for alt user", function(done) {
        chai.request(app).delete("/api/v1/jobs/" + jobId + "?token=" + altUserToken)
            .end(function(err, res) {
                res.should.have.status(401);
                done();
            });
    });

    it("deletes the job for main user", function(done) {
        chai.request(app).delete("/api/v1/jobs/" + jobId + "?token=" + mainUserToken)
            .end(function(err, res) {
                res.should.have.status(200);
                res.body._id.should.equal(jobId);
                done();
            });
    });

});