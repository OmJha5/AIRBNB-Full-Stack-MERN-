const express = require("express")
const router = express.Router()
let wrapAsync = require("../utils/wrapAsync.js")
const Listing = require("../models/listing.js")
const { isLoggedIn , isOwner , validateListing } = require("../middleware.js")
const listingController = require("../controllers/listing.js")
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage })


router.route("/")
    .get(wrapAsync(listingController.index))
    .post(upload.single('Listing[image]') , isLoggedIn , validateListing,  wrapAsync(listingController.newListing));

router.get("/new" , isLoggedIn , wrapAsync(listingController.newListingForm));
router.get("/category/:categoryName" , wrapAsync(listingController.categoryPage))

router.route("/:id")
    .get(wrapAsync(listingController.show))
    .patch(isLoggedIn , upload.single('Listing[image]') , validateListing , isOwner , wrapAsync(listingController.editRoute))
    .delete(isLoggedIn , isOwner, wrapAsync(listingController.destroyRoute))


router.get("/:id/edit" , isLoggedIn , isOwner , wrapAsync(listingController.editForm))

module.exports = router;