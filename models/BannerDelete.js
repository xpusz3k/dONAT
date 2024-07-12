const mongoose = require('mongoose')

const TimeoutSchema = new mongoose.Schema({
    bannerTimeout: {
        type: Number,
        required: false
    },
    user: {
        type: String,
        required: false
    }
});

const Cooldown = mongoose.model("BannerCooldownTimeouts", TimeoutSchema);

module.exports = { Cooldown }