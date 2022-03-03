const mongoose = require("mongoose")

const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: {type: String, require: true, trim: true, unique: true},
    password: {type: String, require: true},
    profilePic: {type: String, default: "/images/profilePic.jpg"}
}, { timestamps: true })
// This will give a timestamp on every document inserted in this collection.


const User = mongoose.model("User", UserSchema)
module.exports = User