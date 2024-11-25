const express = require("express")
const router = express.Router()
let {listingSchema} = require("../schema.js")
let wrapAsync = require("../utils/wrapAsync.js")
let ExpressError = require("../utils/ExpressError.js")
const Listing = require("../models/listing.js")
const { isLoggedIn } = require("../middleware.js")


function validateListing(req , res , next){
    
    const result = listingSchema.validate(req.body)
    if(result.error){
        throw new ExpressError(404 , "Schema validation failed.")
    }
    else next();
}

// It will show all the listings.
router.get("/" , async (req , res) => {
    const allListings = await Listing.find({});
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    res.render("Listings/index.ejs" , { allListings });
})

router.get("/new" , isLoggedIn , (req , res) => {
    res.locals.currUser = req.user;
    res.render("Listings/new.ejs" , {page : "new"});
})

// It will show a specific listing details
router.get("/:id" , async (req , res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id).populate("review");
    if(!listing){
        req.flash("error" , "Listing you requested does not exist!")
        res.redirect("/listings")
    }
    res.locals.success = req.flash("success")
    res.locals.currUser = req.user;
    res.render("Listings/show.ejs" , { listing , page : "show" });
})

router.post("/" , isLoggedIn , validateListing,  wrapAsync(async(req , res , next) => {
    if(req.body.Listing == undefined) next(new ExpressError(400 , "Send Valid Data For Listing")) // Bad Request.
    const newListing = new Listing(req.body.Listing)
    req.flash("success" , "New Listing Created!");
    await newListing.save()
    res.redirect("/listings");
}));

router.get("/:id/edit" , isLoggedIn , wrapAsync(async (req , res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error" , "Listing you requested does not exist!")
        res.redirect("/listings")
    }
    res.locals.currUser = req.user;
    res.render("Listings/edit.ejs" , {listing , page : "edit"});
}))

router.patch("/:id" , isLoggedIn , validateListing , wrapAsync(async (req , res , next) => {
    if(req.body.Listing == undefined) next(new ExpressError(400 , "Send Valid Data For Listing"))
    const {id} = req.params;
    await Listing.findByIdAndUpdate(id , {...req.body.Listing});
    req.flash("success" , "Listing is Updated!")

    res.redirect(`/listings/${id}`);
}))

router.delete("/:id" , isLoggedIn , wrapAsync(async (req , res) => {
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success" , "Listing Is Deleted!")

    res.redirect("/listings");
}))

module.exports = router;