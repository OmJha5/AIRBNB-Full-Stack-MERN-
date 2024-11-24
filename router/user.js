const express = require("express")
const router = express.Router()
const User = require("../models/user.js")
const passport = require("passport")

router.get("/signup" , (req , res) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.render("user/signup.ejs" , {signup: '/css/signup.css'})
})

router.post("/signup" , async(req , res) => {
    try{
        const {username , email , password} = req.body;
        console.log(username , email , password);
        let newUser = new User({
            email : email,
            username : username,
        })

        await User.register(newUser , password);
        req.flash("success" , "Signed Up Successfully , Please Login Now!")
        res.redirect("/login")
    }
    catch(e){
        req.flash("error" , e.message)
        res.redirect("/signup")
    }
})

router.get("/login" , (req , res) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.render("user/login.ejs" , {signup: '/css/signup.css'})
})

router.post("/login" , passport.authenticate("local" , {failureRedirect : "/login" , failureFlash : true}) , async(req , res) => {
    req.flash("success" , "Welcome to Wanderlust!")
    res.redirect("/listings")
})

module.exports = router;