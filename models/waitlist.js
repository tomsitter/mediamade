var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SurveySchema = new Schema({
    client_type: {type: String, index: true, required: true},
    services: [{type: String, index: true}],
    city: String,
    photo_price: Number,
    video_price: Number
});

var WaitListSchema = new Schema({
    user_id:  {type: Schema.Types.ObjectId, ref: 'User'},
    email: {type: String, required: true, index: true},
    survey: SurveySchema
});

module.exports = mongoose.model('WaitList', WaitListSchema);