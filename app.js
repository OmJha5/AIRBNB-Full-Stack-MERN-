const express = require("express")
const app = express()
const mongoose = require("mongoose")
const Listing = require("./models/listing.js")
const path = require("path")

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views"));
app.use(express.urlencoded({extended : true}));

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

// It will show a specific listing details
app.get("/listings/:id" , async (req , res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    console.log(listing);
    res.render("Listings/show.ejs" , { listing });
})


app.listen(8080 , () => {
    console.log("App is listening on port 8080");
})