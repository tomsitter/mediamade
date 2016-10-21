var mongoose = require('mongoose');
var User = require('../models/user.js');

var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');
var should = chai.should();

chai.use(chaiHttp);

describe('User', function () {

    before(function (done) {
        db = mongoose.connect('mongodb://localhost/test');
        done();
    });

    after(function(done) {
        mongoose.connection.close();
        done();
    });

    beforeEach(function (done) {
        var user = new User({
            'local': {
                'email': 'tom@email.com',
                'password': 'testy'
            }
        });

        user.save(function (err) {
            if (err) { console.log('error' + error.message); }
            else { console.log('no error'); }
            done();
        });
    });

    it('find a local user by email', function(done) {
        User.findOne({'local.email': 'tom@email.com'}, function(err, user) {
            user.local.email.should.eql('tom@email.com');
            console.log("   username: ", user.local.email);
            done();
        });
    });


    afterEach(function(done) {
        User.remove({}, function() {
            done();
        });
    });

})