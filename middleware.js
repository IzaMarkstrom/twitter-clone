exports.requireLogin = (req, res, next) => {
    // Checks if user is logged in.
    if (req.session && req.session.user){
        // If so then we use next
        return next()
    } else {
        // If user is not logged in we redirect them to login page.
        return res.redirect("/login")
    }
}