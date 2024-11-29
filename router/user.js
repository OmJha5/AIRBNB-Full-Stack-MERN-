const express = require("express")
const router = express.Router()
const User = require("../models/user.js")
const passport = require("passport")
const {savedRedirectUrl} = require("../middleware.js")
const userController = require("../controllers/user.js")

router.route("/signup")
    .get(userController.signupForm)
    .post(userController.signupRoute)

router.route("/login")
    .get(userController.loginForm)
    .post(savedRedirectUrl , passport.authenticate("local" , {failureRedirect : "/login" , failureFlash : true}) , userController.loginRoute)

router.get("/logout" , userController.logoutRoute)

module.exports = router;