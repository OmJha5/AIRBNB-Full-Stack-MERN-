const mongoose = require("mongoose")
const Review = require("./review.js")

const listingSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    description : String,
    image : {
        url : String,
        filename : String,
    },
    price : Number,
    location : String,
    country : String,
    review : [ // One listing mai n reviews aa satke hai that is why here cardinality is 1 * n
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Review"
        }
    ],
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    category : String,
})

listingSchema.post("findOneAndDelete" , async (listing) => {
    await Review.deleteMany({_id : {$in : listing.review}})
})

const Listing = mongoose.model("Listing" , listingSchema)
module.exports = Listing;

