const express = require("express")
const router = express.Router({mergeParams : true})
let wrapAsync = require("../utils/wrapAsync.js")
let ExpressError = require("../utils/ExpressError.js")
let {reviewSchema} = require("../schema.js")
const Listing = require("../models/listing.js")
const Review = require("../models/review.js")

function validateReview(req , res , next){
    const result = reviewSchema.validate(req.body)
    if(result.error){
        throw new ExpressError(404 , "Schema validation failed.")
    }
    else next();
}

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