var Contact = require('../models/contact.js');

exports.create = function(req, res) {
    new Contact({

    }).save();
}


function toContact(nody, Contact) {
    return new Contact(
    {
        firstname: body.firstname,
        lastname: body.lastname,
        title: body.title,
        company: body.company,
        jobtitle: body.jobtitle,
        primarycontactnumber: body.primarycontactnumber,
        primaryemailaddress: body.primaryemailaddress,
        emailaddresses: body.emailaddresses,
        groups: body.groups,
        othercontactnumbers: body.othercontactnumbers
    });
}