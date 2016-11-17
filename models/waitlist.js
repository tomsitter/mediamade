var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SurveySchema = new Schema(
    {
        client_type: {type: String, index: true, required: true},
        hiring: {type: String, index: true},
        services: [{type: String, index: true}],
        city: String,
        photo_price: Number,
        video_price: Number
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);

var WaitListSchema = new Schema({
    user_id:  {type: Schema.Types.ObjectId, ref: 'User'},
    date_created: {type: Date, default: Date.now},
    email: {type: String, required: true, index: true},
    survey: SurveySchema
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);

module.exports = mongoose.model('WaitList', WaitListSchema);