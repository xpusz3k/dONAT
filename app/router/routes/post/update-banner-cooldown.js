const express = require("express");

const router = express.Router();

const { Cooldown } = require('../../../../models/BannerDelete')

router.post("/", async (req, res) => {
    try {
        const { bannerTimeout, user } = req.body;
        
        const updatedTimeouts = await Cooldown.findOneAndUpdate(
            { user },
            { bannerTimeout, user },
            { new: true, upsert: true }
        );
        
        res.status(201).json(updatedTimeouts);
    } catch (error) {
        console.error("Error saving maintenance:", error);
        res.status(500).json({ error: "Error saving maintenance" });
    }
});

module.exports = router;
