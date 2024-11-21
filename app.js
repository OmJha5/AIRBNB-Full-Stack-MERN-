const express = require("express")
const app = express()
const mongoose = require("mongoose")
const methodOverride = require("method-override")
const path = require("path")
const ejsMate = require("ejs-mate");
let ExpressError = require("./utils/ExpressError.js")
let listingRouter = require("./router/listing.js");
let reviewRouter = require("./router/review.js")

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
app.use("/listings/:id/reviews" , reviewRouter)

app.get("/" , (req , res) => {
    res.send("Root is running..")
})

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