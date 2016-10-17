var mongoose = require('mongoose');
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
        }
});

var JobSchema = new Schema({
    services: {
        audio: Boolean,
        video: Boolean,
        photo: Boolean,
        aerial: Boolean,
        animation: Boolean
    },
    products: [{
        product_type: {type: String, required: true},
        amount: Number,
        length: String,
        description: String,
    }],
    description: String,
    contract: ContractSchema
});


module.exports = mongoose.model('Job', JobSchema);