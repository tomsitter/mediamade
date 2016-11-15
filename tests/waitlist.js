process.env.NODE_ENV = "test";

var chai = require("chai");
var should = chai.should();
var chaiHttp = require("chai-http");
var mongoose = require("mongoose");
var WaitList = require('../models/waitlist.js');
var app = require('../app.js');

chai.use(chaiHttp);

describe("WaitList", function() {

    before(function (done) {
        WaitList.remove({}, function() {
            done();
        });

    });

    var testSurvey = {
        email: "test@gmail.com",
        survey: {
            client_type: "CLIENT",
            hiring: "PERSONAL",
            services: ["PHOTOS", "VIDEO"],
            city: "Thunder Bay",
            photo_price: "100",
            video_price: "150"
        }
    };

    var testSurveyOnlyEmail = {
        email: "test@gmail.com"
    };


    it("creates a new waitlist entry with only email", function(done) {
        chai.request(app).post("/api/v1/waitlist")
            .send(testSurveyOnlyEmail)
            .end(function(err, res) {
                should.not.exist(err);
                res.should.have.status(201);
                should.exist(res.body.upserted);
                done();
        });
    });

    it("adds the survey to the users waitlist entry", function(done) {
        chai.request(app).post("/api/v1/waitlist")
            .send(testSurvey)
            .end(function(err, res) {
                should.not.exist(err);
                res.should.have.status(200);
                should.not.exist(res.body.upserted);
                done();
            });
    });

});