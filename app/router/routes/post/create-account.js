const express = require("express");

const router = express.Router();

const { User } = require('../../../../models/Users')

router.post("/", async (req, res) => {
    try {
        const { nickname, password } = req.body;
        
        const user = new User({
            nickname,
            password
        });
        
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (error) {
        console.error("Error saving user:", error);
        res.status(500).json({ error: "Error saving user" });
    }
});

module.exports = router;
