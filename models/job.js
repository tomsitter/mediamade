var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;

var ContractSchema = new Schema({
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
    user:  {type: Schema.Types.ObjectId, ref: 'User', index: true},
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