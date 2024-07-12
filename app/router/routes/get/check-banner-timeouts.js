const express = require("express");
const router = express.Router();

const colorette = require("colorette");

const { Timeout } = require("../../../../models/BannerCount");

router.get("/", async (req, res) => {
    try {
        const { user } = req.query;
        
        const timeout = await Timeout.findOne({ user });
        res.status(200).json(timeout);
    } catch (error) {
        console.log(colorette.red(`🔥 An error occured with get Data from database, ${error}`));
    }
});

module.exports = router;
