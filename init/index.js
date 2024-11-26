const mongoose = require("mongoose")
let sampleListings = require("./data.js")
const Listing = require("../models/listing.js")

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

async function initFunc(){
    await Listing.deleteMany({});

    sampleListings = sampleListings.map((obj) => ({...obj , owner : "6744657379fa4aa81b0f15ba"}))
    await Listing.insertMany(sampleListings);
    console.log("Data is inserted..");
}

initFunc();

