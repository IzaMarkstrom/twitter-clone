const express = require("express");
const app = express()
const router = express.Router()
const bodyParser = require("body-parser")
const multer = require("multer")
const path = require("path")
const upload = multer({ dest: "uploads/"})
const fs = require("fs")
const User = require("../../schemas/UserSchema")
const Post = require("../../schemas/PostSchema")

app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", async (req, res, next) => {
    var searchObj = req.query;

    if(req.query.search !== undefined) {
        searchObj = {
            $or: [
                { firstname: { $regex: req.query.search, $options: "i" }},
                { lastname: { $regex: req.query.search, $options: "i" }},
                { username: { $regex: req.query.search, $options: "i" }},
            ]
        }
    }

    User.find(searchObj)
    .then(results => res.status(200).send(results))
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
})

router.put("/:userId/follow", async (req, res, next) => {
    var userId = req.params.userId

    var user = await User.findById(userId)

    if(user == null) return res.sendStatus(404)

    // First checking that followers exist. 
    var isFollowing = user.followers && user.followers.includes(req.session.user._id)
    var option = isFollowing ? "$pull" : "$addToSet"

    req.session.user = await User.findByIdAndUpdate(req.session.user._id, { [option]: {following: userId} }, { new: true })
    .catch(error => {
        console.log(error)
        res.sendStatus(400)
    })

    await User.findByIdAndUpdate(userId, { [option]: {followers: req.session.user._id} })
    .catch(error => {
        console.log(error)
        res.sendStatus(400)
    })

    res.status(200).send(req.session.user._id)

})

router.post("/profilePicture", upload.single("croppedImage"), async (req, res, next) => {
    if(!req.file) {
        console.log("No file uploaded with ajax request.");
        return res.sendStatus(400);
    }

    var filePath = `/uploads/images/${req.file.filename}.png`;
    var tempPath = req.file.path;
    var targetPath = path.join(__dirname, `../../${filePath}`);

    fs.rename(tempPath, targetPath, async error => {
        if(error != null) {
            console.log(error);
            return res.sendStatus(400);
        }

        req.session.user = await User.findByIdAndUpdate(req.session.user._id, { profilePic: filePath }, { new: true });
        res.sendStatus(204);
    })

});

router.put("/:userId", async (req, res) => {
    var userId = req.params.userId
    console.log(userId)

    await User.findByIdAndUpdate(userId, { firstname: req.body.firstName, lastname: req.body.lastName, username: req.body.username, email: req.body.email }, { new: true } )
    .then(results => res.sendStatus(204))
    .catch(error => {
        console.log(error)
        res.sendStatus(400)
    })

})

module.exports = router;

