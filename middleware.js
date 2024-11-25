
module.exports.isLoggedIn = (req , res , next) => {
    if(!req.isAuthenticated()){
        req.flash("error" , "Please login for creating a new listing!")
        res.redirect("/login");
    }
    next();
}