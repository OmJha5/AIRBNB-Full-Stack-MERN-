const Listing = require("../models/listing.js")
const Review = require("../models/review.js")

module.exports.reviewRoute = async (req , res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let newReview = await new Review(req.body.reviews)
    newReview.author = req.user._id;
    listing.review.push(newReview);

    await listing.save();
    await newReview.save();

    res.redirect(`/listings/${id}`);
}

module.exports.destroyReview = async (req , res) => {
    let {id , reviewId} = req.params;
    await Listing.findByIdAndUpdate(id , {$pull : {review : reviewId}})
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`)
}