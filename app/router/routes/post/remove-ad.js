const express = require("express");

const router = express.Router();

const { Ad } = require('../../../../models/Ads')

router.post("/", async (req, res) => {
    try {
        const { adID } = req.body;

        const existingAd = await Ad.findOneAndRemove({ adID });
        
    } catch (error) {
        console.error("Error deleting ad:", error);
        res.status(500).json({ error: "Error deleting ad" });
    }
});

module.exports = router;
