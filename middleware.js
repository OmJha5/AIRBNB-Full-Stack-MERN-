
module.exports.isLoggedIn = (req , res , next) => {
    req.session.redirectUrl = req.originalUrl;
    if(!req.isAuthenticated()){
        req.flash("error" , "Please login for creating a new listing!")
        res.redirect("/login");
    }
    next();
}

module.exports.savedRedirectUrl = (req , res , next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}