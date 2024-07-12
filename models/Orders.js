const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
    nickname: {
        type: String,
        required: false
    },
    message: {
        type: String,
        required: false
    },
    value: {
        type: Number,
        required: true
    },
    donationType: {
        type: String,
        required: true
    }
});

const Order = mongoose.model("Orders", OrderSchema);

module.exports = { Order }