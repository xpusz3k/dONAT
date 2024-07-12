const mongoose = require('mongoose')

const TimeoutSchema = new mongoose.Schema({
    bannerCount: {
        type: Number,
        required: false
    },
    user: {
        type: String,
        required: false
    }
});

const Timeout = mongoose.model("BannerTimeouts", TimeoutSchema);

module.exports = { Timeout }