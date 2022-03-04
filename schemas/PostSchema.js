const mongoose = require("mongoose")

const Schema = mongoose.Schema

const PostSchema = new Schema({
    // Not adding required: true in case client wants to retweet a post. 
    textContent: { type: String, trim: true },
    postedBy: { type: Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true })
// This will give a timestamp on every document inserted in this collection.


const Post = mongoose.model("Post", PostSchema)
module.exports = Post