const User = require("../models/user.js")

module.exports.signupForm = (req , res) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.render("user/signup.ejs" , {signup: '/css/signup.css'})
}

module.exports.signupRoute = async(req , res) => {
    try{
        const {username , email , password} = req.body;
        let newUser = new User({
            email : email,
            username : username,
        })

        await User.register(newUser , password);
        req.login(newUser , (err) => {
            if(err) next(err);
            req.flash("success" , "Welcome To Wanderlust!")
            res.redirect("/listings")
        })
    }
    catch(e){
        req.flash("error" , e.message)
        res.redirect("/signup")
    }
}

module.exports.loginForm = (req , res) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.render("user/login.ejs" , {signup: '/css/signup.css'})
}

module.exports.loginRoute = async(req , res) => {
    req.flash("success" , "Welcome Back to Wanderlust!")
    if(res.locals.redirectUrl) res.redirect(res.locals.redirectUrl);
    else res.redirect("/listings")
}

module.exports.logoutRoute = (req , res , next) => {
    req.logout((err) => {
        if(err) next(err);
        req.flash("success" , "Logged out successfully");
        res.redirect("/listings");
    })
}

