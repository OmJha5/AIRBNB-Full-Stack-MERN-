const express = require("express")
const app = express()
const mongoose = require("mongoose")
const methodOverride = require("method-override")
const Listing = require("./models/listing.js")
const path = require("path")

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));

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
    res.render("Listings/new.ejs");
})

// It will show a specific listing details
app.get("/listings/:id" , async (req , res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("Listings/show.ejs" , { listing });
})

app.post("/listings" , (req , res) => {
    const newListing = new Listing(req.body.Listing)
    newListing.save()
    res.redirect("/listings");
})

app.get("/listings/:id/edit" , async (req , res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("Listings/edit.ejs" , {listing});
})

app.patch("/listings/:id" , async (req , res) => {
    const {id} = req.params;
    await Listing.findByIdAndUpdate(id , {...req.body.Listing});

    res.redirect(`/listings/${id}`);
})

app.delete("/listings/:id" , async (req , res) => {
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);

    res.redirect("/listings");
})

app.listen(8080 , () => {
    console.log("App is listening on port 8080");
})