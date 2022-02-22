// Declaring what dependency I want.
const express = require("express");
const app = express()
const PORT = 3000;
const middleware = require("./middleware")

// Telling express to listen to port 3000.
const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})

app.set("view engine", "pug")
// When you need views, go to folder namned views.
app.set("views", "views")

// Routes
const loginRoute = require("./routes/loginRoutes")

app.use("/login", loginRoute)

// Adding req = request from client and res = response from server parameter.
app.get("/", middleware.requireLogin, (req, res, next) => {

    const payload = {
        pageTitle: "Twitter clone"
    }

    // Render function takes two parameters.
    // 1. template/page 'home' 2. The payload with the data we want to send to it.
    res.status(200).render("home", payload)
})