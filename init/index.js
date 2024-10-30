const mongoose = require("mongoose")
const initData = require("./data.js")
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

    await Listing.insertMany(initData.data);
    console.log("Data is inserted..");
}

initFunc();

