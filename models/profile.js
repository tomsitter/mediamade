var mongoose = require('mongoose');
var Schema = mongoose.Schema;


function isUrl(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return pattern.test(str);
}

var PortfolioSchema = new Schema({
    media_type: {type: String, enum: ['VIMEO', 'INSTAGRAM', 'YOUTUBE']},
    date_created: {type: Date, default: Date.now},
    source: {
        type: String,
        validate: [isUrl, 'Not a URL'],
    },
    customer: String,
    price: String,
    description: String
});

var ProfileSchema = new Schema({
    user_id:  {type: Schema.Types.ObjectId, ref: 'User', index: true},
    date_created: {type: Date, default: Date.now},
    name: {type: String, index: true, required: true},
    client_type: {type: String, index: true, required: true},
    tags: [{type: String, index: true}],
    location: {
        address: String,
        city: String,
        geo: {
            type: [Number], // [<longitude>, <latitude>]
            index: '2d'
        }
    },
    description: String,
    services: [{type: String, index: true}],
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
    hourly_rate: {type: String, index: true},
    portfolio: [PortfolioSchema]
});

ProfileSchema.pre('save', function (next) {
  this.wasNew = this.isNew;
  next();
})



module.exports = mongoose.model('Profile', ProfileSchema);