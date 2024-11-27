const express = require("express")
const router = express.Router({mergeParams : true})
let wrapAsync = require("../utils/wrapAsync.js")
let ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js")
const Review = require("../models/review.js")
const {validateReview} = require("../middleware.js")
const {isLoggedIn} = require("../middleware.js")
const {isReviewOwner} = require("../middleware.js")
const reviewController = require("../controllers/review.js")

// Reviews Route
router.post("/" , isLoggedIn , validateReview , wrapAsync(reviewController.reviewRoute))

router.delete("/:reviewId" , isLoggedIn , isReviewOwner , wrapAsync(reviewController.destroyReview))

module.exports = router;