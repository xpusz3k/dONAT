const express = require("express");
const router = express.Router();
const { User } = require('../../../../models/Users')

router.get("/", async (req, res) => {
    try {
        const { nickname } = req.query;
        const user = await User.findOne({ nickname });
    
        if (user) {
            res.status(200).json({ nickname: user.nickname, password: user.password });
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        console.log(colorette.red(`🔥 An error occured with get Data from database, ${error}`));
    }
});

module.exports = router;
