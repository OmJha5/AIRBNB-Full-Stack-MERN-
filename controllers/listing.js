const Listing = require("../models/listing.js")
let ExpressError = require("../utils/ExpressError.js")

module.exports.index = async (req , res) => {
    const allListings = await Listing.find({});
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    res.render("Listings/index.ejs" , { allListings });
}

module.exports.newListingForm = async (req , res) => {
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
    console.log(listing)
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currUser = req.user;
    res.render("Listings/show.ejs" , { listing , page : "show" });
}

module.exports.newListing = async(req , res , next) => {
    if(req.body.Listing == undefined) next(new ExpressError(400 , "Send Valid Data For Listing")) // Bad Request.
    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.Listing)
    newListing.owner = req.user._id;
    newListing.image = {url , filename}
    req.flash("success" , "New Listing Created!");
    await newListing.save()
    res.redirect("/listings");
}

module.exports.categoryPage = async(req , res , next) => {
    let {categoryName} = req.params;
    let allListings = await Listing.find({category : categoryName})
    res.locals.currUser = req.user;

    res.render("Listings/category.ejs" , {allListings , categoryName : categoryName})
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

    console.log("Yes");
    
    console.log(req.file)
    const listing = await Listing.findByIdAndUpdate(id , {...req.body.Listing});
    if(typeof req.file != 'undefined'){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url , filename};
        await listing.save()
    }

    req.flash("success" , "Listing is Updated!")

    res.redirect(`/listings/${id}`);
}

module.exports.destroyRoute = async (req , res) => {
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success" , "Listing Is Deleted!")

    res.redirect("/listings");
}