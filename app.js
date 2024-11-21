const express = require("express")
const app = express()
const mongoose = require("mongoose")
const methodOverride = require("method-override")
const Listing = require("./models/listing.js")
const Review = require("./models/review.js")
const path = require("path")
const ejsMate = require("ejs-mate");
let wrapAsync = require("./utils/wrapAsync.js")
let ExpressError = require("./utils/ExpressError.js")
let {reviewSchema , listingSchema} = require("./schema.js")
let listingRouter = require("./router/listing.js");

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname , "public")));
app.engine("ejs" , ejsMate);

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

app.use("/listings" , listingRouter)

function validateReview(req , res , next){
    console.log(req.body)
    const result = reviewSchema.validate(req.body)
    if(result.error){
        throw new ExpressError(404 , "Schema validation failed.")
    }
    else next();
}

app.get("/" , (req , res) => {
    res.send("Root is running..")
})


// Reviews Route
app.post("/listings/:id/reviews" , validateReview , wrapAsync(async (req , res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let newReview = await new Review(req.body.reviews)

    listing.review.push(newReview);

    await listing.save();
    await newReview.save();

    res.redirect(`/listings/${id}`);
}))

app.delete("/listings/:id/reviews/:reviewId" , wrapAsync(async (req , res) => {
    let {id , reviewId} = req.params;
    await Listing.findByIdAndUpdate(id , {$pull : {review : reviewId}})
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`)
}))

app.all("*" , (req , res , next) => {
    next(new ExpressError(404 , "Page Not Found!"));
})

app.use((err , req , res , next) => {
    let {status = 500 , message = "Something Went Wrong!"} = err;
    res.status(status).send(message);
})

app.listen(8080 , () => {
    console.log("App is listening on port 8080");
})