const mongoose = require('mongoose')

const MaintenanceSchema = new mongoose.Schema({
    toggled: {
        type: Boolean,
        required: true
    },
});

const Maintenance = mongoose.model("Maintenance", MaintenanceSchema);

module.exports = { Maintenance }