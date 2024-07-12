const express = require("express");

const router = express.Router();

const { Timeout } = require('../../../../models/BannerCount')

router.post("/", async (req, res) => {
    try {
        const { bannerCount, user } = req.body;
        
        const updatedTimeouts = await Timeout.findOneAndUpdate(
            { user },
            { bannerCount, user },
            { new: true, upsert: true }
        );
        
        res.status(201).json(updatedTimeouts);
    } catch (error) {
        console.error("Error saving maintenance:", error);
        res.status(500).json({ error: "Error saving maintenance" });
    }
});

module.exports = router;
