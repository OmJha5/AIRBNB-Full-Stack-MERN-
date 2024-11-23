const express = require("express")
const router = express.Router()
let {listingSchema} = require("../schema.js")
let wrapAsync = require("../utils/wrapAsync.js")
let ExpressError = require("../utils/ExpressError.js")
const Listing = require("../models/listing.js")


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
    res.render("Listings/index.ejs" , { allListings });
})

router.get("/new" , (req , res) => {
    res.render("Listings/new.ejs" , {page : "new"});
})

// It will show a specific listing details
router.get("/:id" , async (req , res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id).populate("review");
    res.render("Listings/show.ejs" , { listing , page : "show" });
})

router.post("/" , validateListing,  wrapAsync(async(req , res , next) => {
    if(req.body.Listing == undefined) next(new ExpressError(400 , "Send Valid Data For Listing")) // Bad Request.
    const newListing = new Listing(req.body.Listing)
    req.flash("success" , "New Listing Created!");
    await newListing.save()
    res.redirect("/listings");
}));

router.get("/:id/edit" , wrapAsync(async (req , res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("Listings/edit.ejs" , {listing , page : "edit"});
}))

router.patch("/:id" , validateListing , wrapAsync(async (req , res , next) => {
    if(req.body.Listing == undefined) next(new ExpressError(400 , "Send Valid Data For Listing"))
    const {id} = req.params;
    await Listing.findByIdAndUpdate(id , {...req.body.Listing});

    res.redirect(`/listings/${id}`);
}))

router.delete("/:id" , wrapAsync(async (req , res) => {
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);

    res.redirect("/listings");
}))

module.exports = router;