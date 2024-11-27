const Listing = require("../models/listing.js")
let ExpressError = require("../utils/ExpressError.js")

module.exports.index = async (req , res) => {
    const allListings = await Listing.find({});
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    res.render("Listings/index.ejs" , { allListings });
}

module.exports.newListingForm = (req , res) => {
    res.locals.currUser = req.user;
    res.render("Listings/new.ejs" , {page : "new"});
}

module.exports.show = async (req , res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({path : "review" , 
        populate : {
            path : "author",
        },
    })
    .populate("owner");
    if(!listing){
        req.flash("error" , "Listing you requested does not exist!")
        res.redirect("/listings")
    }
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currUser = req.user;
    res.render("Listings/show.ejs" , { listing , page : "show" });
}

module.exports.newListing = async(req , res , next) => {
    if(req.body.Listing == undefined) next(new ExpressError(400 , "Send Valid Data For Listing")) // Bad Request.
    const newListing = new Listing(req.body.Listing)
    newListing.owner = req.user._id;
    req.flash("success" , "New Listing Created!");
    await newListing.save()
    res.redirect("/listings");
}

module.exports.editForm = async (req , res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error" , "Listing you requested does not exist!")
        res.redirect("/listings")
    }
    res.locals.currUser = req.user;
    res.render("Listings/edit.ejs" , {listing , page : "edit"});
}

module.exports.editRoute = async (req , res , next) => {
    if(req.body.Listing == undefined) next(new ExpressError(400 , "Send Valid Data For Listing"))
    const {id} = req.params;
    
    await Listing.findByIdAndUpdate(id , {...req.body.Listing});
    req.flash("success" , "Listing is Updated!")

    res.redirect(`/listings/${id}`);
}

module.exports.destroyRoute = async (req , res) => {
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success" , "Listing Is Deleted!")

    res.redirect("/listings");
}