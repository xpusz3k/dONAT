const mongoose = require('mongoose')

const AdSchema = new mongoose.Schema({
    image: {
        type: String,
        required: false
    },
    text: {
        type: String,
        required: false
    },
    adID: {
        type: Number,
        required: false
    },
    author: {
        type: String,
        required: false
    }
});

const Ad = mongoose.model("Ads", AdSchema);

module.exports = { Ad }