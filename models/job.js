var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;

var ContractSchema = new Schema({
    date_created: {type: Date, default: Date.now},
    producer: {type: Schema.Types.ObjectId, ref: 'User', index: true},
    text: String,
    price: String,
    milestones: [{
        description: String,
        pay_out: Number,
        due_date: Date,
        stipulation: {
            price_reduction: Number,
            days_overdue: Number
        },
        producer_agrees: Boolean,
        client_agrees: Boolean
    }],
    disclosure: {
        confidential: Boolean,
        can_demo: Boolean
    },
});

var JobSchema = new Schema({
    user_id:  {type: Schema.Types.ObjectId, ref: 'User', index: true},
    date_created: {type: Date, default: Date.now},
    status: {type: String, index: true, default: "pending"},
    services: [String],
    products: [{
        product_type: {type: String, required: true},
        amount: Number,
        length: String,
        description: String,
        size: String,
        audio: Boolean
    }],
    description: String,
    tags: [String],
    purpose: String,
    contract: ContractSchema
});


module.exports = mongoose.model('Job', JobSchema);