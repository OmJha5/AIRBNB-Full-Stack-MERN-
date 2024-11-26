const express = require("express")
const router = express.Router({mergeParams : true})
let wrapAsync = require("../utils/wrapAsync.js")
let ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js")
const Review = require("../models/review.js")
const {validateReview} = require("../middleware.js")

// Reviews Route
router.post("/" , validateReview , wrapAsync(async (req , res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let newReview = await new Review(req.body.reviews)

    listing.review.push(newReview);

    await listing.save();
    await newReview.save();

    res.redirect(`/listings/${id}`);
}))

router.delete("/:reviewId" , wrapAsync(async (req , res) => {
    let {id , reviewId} = req.params;
    await Listing.findByIdAndUpdate(id , {$pull : {review : reviewId}})
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`)
}))

module.exports = router;