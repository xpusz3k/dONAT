const express = require("express");

const router = express.Router();

const { Order } = require('../../../../models/Orders')

router.post("/", async (req, res) => {
    try {
        const { nickname, message, value, donationType } = req.body;
        
        const order = new Order({
            nickname,
            message,
            value,
            donationType
        });
        
        const savedOrder = await order.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        console.error("Error saving order:", error);
        res.status(500).json({ error: "Error saving order" });
    }
});

module.exports = router;
