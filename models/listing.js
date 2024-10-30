const mongoose = require("mongoose")

const listingSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    description : String,
    image : {
        type : String,
        default : "https://hips.hearstapps.com/hmg-prod/images/luxury-beach-resort-royalty-free-image-1673538983.jpg", // Jab user ne image diya hi nhi .
        set : (v) => (v == "") ? "https://hips.hearstapps.com/hmg-prod/images/luxury-beach-resort-royalty-free-image-1673538983.jpg" : v // This will work when user ne image diya to hai ya to empty ya non empty.
    },
    price : Number,
    location : String,
    country : String,
}) 

const Listing = mongoose.model("Listing" , listingSchema)
module.exports = Listing;

