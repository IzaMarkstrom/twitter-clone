// Declaring what dependency I want.
const express = require("express");
const app = express()
const router = express.Router()


app.set("view engine", "pug")
// When you need views, go to folder namned views.
app.set("views", "views")

// Handling the routes, not the server = app.
router.get("/", (req, res, next) => {
    res.status(200).render("login")
})

// Export it so we can use this file in other places.
module.exports = router