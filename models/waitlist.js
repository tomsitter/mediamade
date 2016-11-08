var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WaitListSchema = new Schema({
    user_id:  {type: Schema.Types.ObjectId, ref: 'User'},
    email: {type: String, required: true},
    client_type: {type: String, index: true, required: true},
    services: [{type: String, index: true}],
    city: String,
    expected_rate: [{service: String, rate: Number}],
});



module.exports = mongoose.model('WaitList', WaitListSchema);