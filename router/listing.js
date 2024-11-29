const express = require("express")
const router = express.Router()
let wrapAsync = require("../utils/wrapAsync.js")
const Listing = require("../models/listing.js")
const { isLoggedIn , isOwner , validateListing } = require("../middleware.js")
const listingController = require("../controllers/listing.js")

router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn , validateListing,  wrapAsync(listingController.newListing));

router.get("/new" , isLoggedIn , wrapAsync(listingController.newListingForm));

router.route("/:id")
    .get(wrapAsync(listingController.show))
    .patch(isLoggedIn , validateListing , isOwner , wrapAsync(listingController.editRoute))
    .delete(isLoggedIn , isOwner, wrapAsync(listingController.destroyRoute))


router.get("/:id/edit" , isLoggedIn , isOwner , wrapAsync(listingController.editForm))

module.exports = router;