const mongoose = require("mongoose")

const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: {type: String, require: true, trim: true, unique: true},
    password: {type: String, require: true},
    profilePic: {type: String, defualt: "/images/profilePic.png"}
})

const User = mongoose.model("User", UserSchema)
module.exports = User