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
        // Job.remove({}, function() {
            done();
        // });

    });

    var token = "test-token";

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


    it("create a new profile", function(done) {
        chai.request(app).post("/api/v1/jobs?token=" + token)
            .send(testJob)
            .end(function(err, res) {
                should.not.exist(err);
                res.should.have.status(201);
                jobId = res.body._id;
                done();
        });
    });

    it("find the public job", function(done) {
        chai.request(app).get("/api/v1/jobs/" + jobId + '?token=wronguserid')
            .end(function(err, res) {
                should.not.exist(err);
                res.should.have.status(200);
                done();
            });
    });

    it("make the job status pending", function(done) {
        testJob.status = 'pending';
        chai.request(app).put("/api/v1/jobs/" + jobId + "?token=rightusertoken")
            .send(testJob)
            .end(function(err, res) {
                should.not.exist(err);
                res.should.have.status(200);
                res.body.status.should.equal("pending");
                done();
            });
    });

    it("not find a pending job with the wrong user Id", function(done) {
        // replace the user Id with a different one
        userId = altUserId;
        chai.request(app).get("/api/v1/jobs/" + jobId + "?token=wrongusertoken")
            .end(function(err, res) {
                res.should.have.status(401);
                done();
            });
    });

    it("finds all jobs for main user", function(done) {
       userId = mainUserId;
        chai.request(app).get("/api/v1/jobs?token=mainusertoken")
            .end(function(err, res) {
                res.should.have.status(200);
                done();
            });
    });

    it("finds NO jobs for alt user", function(done) {
       userId = altUserId;
        chai.request(app).get("/api/v1/jobs?token=altusertoken")
            .end(function(err, res) {
                res.should.have.status(401);
                done();
            });
    });

    it("deletes NO jobs for alt user", function(done) {
        userId = altUserId;
        chai.request(app).delete("/api/v1/jobs/" + jobId + "?token=altusertoken")
            .end(function(err, res) {
                res.should.have.status(401);
                done();
            });
    });

    it("deletes the job for main user", function(done) {
        userId = mainUserId;
        chai.request(app).delete("/api/v1/jobs/" + jobId + "?token=mainusertoken")
            .end(function(err, res) {
                res.should.have.status(200);
                res.body._id.should.equal(jobId);
                done();
            });
    });

});