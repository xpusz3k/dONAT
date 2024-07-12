const express = require("express");
const router = express.Router();

const colorette = require("colorette");

const { Order } = require("../../../../models/Orders");

router.get("/", async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        console.log(colorette.red(`🔥 An error occured with get Data from database, ${error}`));
    }
});

module.exports = router;
