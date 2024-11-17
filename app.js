const express = require("express")
const app = express()
const mongoose = require("mongoose")
const methodOverride = require("method-override")
const Listing = require("./models/listing.js")
const path = require("path")
const ejsMate = require("ejs-mate");
let wrapAsync = require("./utils/wrapAsync.js")
let ExpressError = require("./utils/ExpressError.js")

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname , "public")));
app.engine("ejs" , ejsMate);

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then((res) => {
    console.log("DB is connected..")
})
.catch((res) => {
    console.log("DB connection failed..");
})

async function main(){
    return await mongoose.connect(MONGO_URL);
}

app.get("/" , (req , res) => {
    res.send("Root is running..")
})

// It will show all the listings.
app.get("/listings" , async (req , res) => {
    const allListings = await Listing.find({});
    res.render("Listings/index.ejs" , { allListings });
})

app.get("/listings/new" , (req , res) => {
    res.render("Listings/new.ejs" , {page : "new"});
})

// It will show a specific listing details
app.get("/listings/:id" , async (req , res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("Listings/show.ejs" , { listing , page : "show" });
})

app.post("/listings" , wrapAsync((req , res , next) => {
    if(req.body.Listing == undefined) next(new ExpressError(400 , "Send Valid Data For Listing")) // Bad Request.
    const newListing = new Listing(req.body.Listing)
    newListing.save()
    res.redirect("/listings");
}));

app.get("/listings/:id/edit" , wrapAsync(async (req , res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("Listings/edit.ejs" , {listing , page : "edit"});
}))

app.patch("/listings/:id" , wrapAsync(async (req , res , next) => {
    if(req.body.Listing == undefined) next(new ExpressError(400 , "Send Valid Data For Listing"))
    const {id} = req.params;
    await Listing.findByIdAndUpdate(id , {...req.body.Listing});

    res.redirect(`/listings/${id}`);
}))

app.delete("/listings/:id" , wrapAsync(async (req , res) => {
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);

    res.redirect("/listings");
}))

app.all("*" , (req , res , next) => {
    next(new ExpressError(404 , "Page Not Found!"));
})

app.use((err , req , res , next) => {
    let {status = 500 , message = "Something Went Wrong!"} = err;
    res.status(status).send(message);
})

app.listen(8080 , () => {
    console.log("App is listening on port 8080");
})