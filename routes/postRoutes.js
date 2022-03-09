// Declaring what dependency I want.
const express = require("express");
const app = express()
const router = express.Router()
const bodyParser = require("body-parser")
const bcrypt = require("bcryptjs")
const User = require("../schemas/UserSchema")


// Handling the routes, not the server = app.
router.get("/:id", (req, res, next) => {

    const payload = {
        pageTitle: "View post", 
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
        postId: req.params.id
    }

    res.status(200).render("postPage", payload)
})


// Export it so we can use this file in other places.
module.exports = router