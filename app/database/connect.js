const mongoose = require("mongoose");
const dotenv = require("dotenv");

const colorette = require("colorette");

dotenv.config();

const TOKEN = process.env.DATABASE;

const connectToDatabase = async () => {
    try {
        await mongoose.connect(TOKEN);
        console.log(colorette.green(`✅ Database successfully connected`))
    } catch (error) {
        console.error(colorette.red("❗ Something went wrong with database connect..."));
    }
};

module.exports = { connectToDatabase, mongoose };
