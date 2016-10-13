var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var Profile = new Schema({
    name: {type: String, index: true, required: true},
    description: String,
    services: [String],
    equipment: [{
        equipment_type: String,
        name: String,
    }],
    reviews: [{
        reviewer: String,
        rating: {type: Number, enum: [1, 2, 3, 4, 5]},
        review: String
    }],
    team: [{
        name: String,
        role: String,
        blurb: String
    }],
    portfolio: [{
        media_type: {type: String, enum: ['VIMEO', 'INSTAGRAM']},
        source: {
            type: String,
            validate: {
                validator: isUrl,
                message: '{VALUE} is not a valid url'
            }
        }
    }]
});

function isURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return pattern.test(str);
}

module.exports = mongoose.model('Profile', Profile);