const express = require("express");
const router = express.Router();
const { Ad } = require('../../../../models/Ads')

router.get("/", async (req, res) => {
    try {
        const ads = await Ad.find(); // Pobierz wszystkie reklamy z bazy
        res.json(ads); // Wyślij reklamy jako JSON
    } catch (error) {
        console.error("Error retrieving ads:", error);
        res.status(500).json({ error: "Error retrieving ads" });
    }
});

module.exports = router;
