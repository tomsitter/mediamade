var mongoose = require('mongoose');

var ObjectId = Schema.ObjectId;

var JobSchema = new Schema({
    client: {
        type: ObjectId, 
        ref: 'Client' 
    },
    status: String,
    name: { 
        type: String, 
        index: true 
    },
    description: String,
    tags: { 
        type: [String], 
        index: true 
    },
    date_created: { 
        type: Date, 
        default: Date.now, 
        index: true 
    },
    date_due: { 
        type: Date, 
        index: true 
    },
    media_type: { 
        type: String, 
        index: true 
    },
    budget: {
        min: Number,
        max: Number,
    },
    meta: {
      views: Number,
      favourites: Number
    }
});

var Job = mongoose.model('Job', JobSchema);

module.exports = {
    Job: Job
}