var mongoose = require('mongoose');
var should = require('should');
var prepare = require('./prepare.js');
var Contact = require('../models/contact.js')

mongoose.connect('mongodb://localhost/contacts-test');

describe('Contact: models', function() {

    describe('#create()', function() {
        it('Should create a new Contact', function (done) {
            var contactModel = {
                "firstname": "John",
                "lastname": "Doe",
                "title": "Mr.",
                "company": "Dev Inc.",
                "jobtitle": "Developer",
                "primarycontactnumber": "+359777223345",
                "primaryemailaddress": "john.doe@xyz.com",
                "groups": ["Dev"],
                "emailaddresses": ["j.doe@xyz.com"],
                "othercontactnumbers": ["+359777223346", "+359777223347"]
            };

            Contact.create(contactModel, function(err, createdModel) {
                should.not.exist(err);

                createdModel.firstname.should.equal('John');
                createdModel.lastname.should.equal('Doe');
                createdModel.title.should.equal("Mr.");
                createdModel.jobtitle.should.equal("Developer");
                createdModel.primarycontactnumber.should.equal("+359777223345");
                createdModel.primaryemailaddress.should.equal("john.doe@xyz.com");
                createdModel.groups[0].should.equal("Dev");
                createdModel.emailaddresses[0].should.equal("j.doe@xyz.com");
                createdModel.othercontactnumbers[0].should.equal("+359777223346");
                createdModel.othercontactnumbers[1].should.equal("+359777223347");
                
                done();
            });
        });
    });

});