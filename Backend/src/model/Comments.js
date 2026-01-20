const mongoose = require('mongoose')

const commentsSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: {
        type: String,
        required: true,
        trim: true
    }
},{timestamps:true})

const Comments = mongoose.model("Comments", commentsSchema)

module.exports = Comments