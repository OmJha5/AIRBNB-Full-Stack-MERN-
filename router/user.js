const express = require("express")
const router = express.Router()
const User = require("../models/user.js")

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
        req.flash("success" , "Enjoy Wanderlust!")
        res.redirect("/listings")
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

module.exports = router;