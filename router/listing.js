const express = require("express")
const router = express.Router()
let wrapAsync = require("../utils/wrapAsync.js")
const Listing = require("../models/listing.js")
const { isLoggedIn , isOwner , validateListing } = require("../middleware.js")
const listingController = require("../controllers/listing.js")

// It will show all the listings.
router.get("/" , wrapAsync(listingController.index));

router.get("/new" , isLoggedIn , wrapAsync(listingController.newListingForm));

// It will show a specific listing details
router.get("/:id" , wrapAsync(listingController.show))

router.post("/" , isLoggedIn , validateListing,  wrapAsync(listingController.newListing));

router.get("/:id/edit" , isLoggedIn , isOwner , wrapAsync(listingController.editForm))

router.patch("/:id" , isLoggedIn , validateListing , isOwner , wrapAsync(listingController.editRoute))

router.delete("/:id" , isLoggedIn , isOwner, wrapAsync(listingController.destroyRoute))

module.exports = router;