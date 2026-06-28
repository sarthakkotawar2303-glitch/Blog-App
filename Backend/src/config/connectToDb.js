require('dotenv').config()
const mongoose = require('mongoose')

const connectToDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("🚀 Database connected successfully.");
    } catch (e) {
        console.error("❌ Database connection failed:", e.message);
    }
}

module.exports = connectToDb;