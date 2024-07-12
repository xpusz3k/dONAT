const express = require("express");

const router = express.Router();

const { Ad } = require('../../../../models/Ads')

router.post("/", async (req, res) => {
    try {
        const { text, image, author } = req.body;
        
        const ad = new Ad({
            text,
            image,
            adID: Math.floor(Math.random() * 999999),
            author
        });
        
        const savedAd = await ad.save();
        res.status(201).json(savedAd);
    } catch (error) {
        console.error("Error saving order:", error);
        res.status(500).json({ error: "Error saving order" });
    }
});

module.exports = router;
