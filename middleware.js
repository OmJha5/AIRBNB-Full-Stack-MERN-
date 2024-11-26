let Listing = require("./models/listing.js")
let {reviewSchema} = require("./schema.js")
let {listingSchema} = require("./schema.js")

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

module.exports.isOwner = async (req , res , next) => {
    const {id} = req.params;
    let listing = await Listing.findById(id);

    if(req.user && req.user._id.equals(listing.owner)) {
        return next();
    }

    req.flash("error" , "You are not the owner of this listing!");
    res.redirect(`/listings/${id}`)
}

module.exports.validateListing = (req , res , next) => {
    
    const result = listingSchema.validate(req.body)
    if(result.error){
        throw new ExpressError(404 , "Schema validation failed.")
    }
    else next();
}

module.exports.validateReview = (req , res , next) => {
    const result = reviewSchema.validate(req.body)
    if(result.error){
        throw new ExpressError(404 , "Schema validation failed.")
    }
    else next();
}