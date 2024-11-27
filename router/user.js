const express = require("express")
const router = express.Router()
const User = require("../models/user.js")
const passport = require("passport")
const {savedRedirectUrl} = require("../middleware.js")
const userController = require("../controllers/user.js")

router.get("/signup" , userController.signupForm)

router.post("/signup" , userController.signupRoute)

router.get("/login" , userController.loginForm)

router.post("/login" , savedRedirectUrl , passport.authenticate("local" , {failureRedirect : "/login" , failureFlash : true}) , userController.loginRoute)

router.get("/logout" , userController.logoutRoute)

module.exports = router;