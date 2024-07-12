const express = require("express");
const router = express.Router();

const colorette = require("colorette");

const { Maintenance } = require("../../../../models/Maintenance");

router.get("/", async (req, res) => {
    try {
        const maintenanceStatus = await Maintenance.findOne({});
        res.status(200).json(maintenanceStatus);
    } catch (error) {
        console.log(colorette.red(`🔥 An error occured with get Data from database, ${error}`));
    }
});

module.exports = router;
