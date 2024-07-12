const express = require("express");

const router = express.Router();

const { Maintenance } = require('../../../../models/Maintenance')

router.post("/", async (req, res) => {
    try {
        const { toggled } = req.body;
        
        const updatedMaintenance = await Maintenance.findOneAndUpdate(
            {},
            { toggled },
            { new: true, upsert: true }
        );
        
        res.status(201).json(updatedMaintenance);
    } catch (error) {
        console.error("Error saving maintenance:", error);
        res.status(500).json({ error: "Error saving maintenance" });
    }
});

module.exports = router;
