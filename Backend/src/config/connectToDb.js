require('dotenv').config()
const mongoose = require('mongoose')

const connectToDb = async () => {
    await mongoose.connect(process.env.MONGO_URL).then(() => console.log("connected To Database")).catch((e) => console.error(`error Occured ${e}`))
}

module.exports = connectToDb;