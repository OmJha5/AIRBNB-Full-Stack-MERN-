const express = require("express")
const app = express()
const mongoose = require("mongoose")
const Listing = require("./models/listing.js")

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

app.get("/testListing" , async (req , res) => {
    const newListing = new Listing({
        title : "My name ",
        description : "By the beach",
        price : 200,
        location : "Banagalore",
        country : "India",
    })
    await newListing.save();
    console.log("Listing is saved..")
    res.send("Done the saving of the listing..")
})

app.get("/" , (req , res) => {
    res.send("Root is running..")
})

app.listen(8080 , () => {
    console.log("App is listening on port 8080");
})