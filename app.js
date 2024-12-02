require("dotenv").config()

const express = require("express")
const app = express()
const mongoose = require("mongoose")
const methodOverride = require("method-override")
const path = require("path")
const ejsMate = require("ejs-mate");
let ExpressError = require("./utils/ExpressError.js")
let listingRouter = require("./router/listing.js");
let reviewRouter = require("./router/review.js")
let userRouter = require("./router/user.js")
let session = require("express-session")
let flash = require("connect-flash");
let passport = require("passport")
let LocalStrategy = require("passport-local")
const User = require("./models/user.js")

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname , "public")));
app.engine("ejs" , ejsMate);

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const MONGO_URL = process.env.ATLASDB_URL;
console.log(process.env.ATLASDB_URL)

main().then((res) => {
    console.log("DB is connected..")
})
.catch((res) => {
    console.log("DB connection failed..");
})

async function main(){
    return await mongoose.connect(MONGO_URL);
}

app.use(session({
    secret : "mysecretcode",
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
    }
}))

app.use(flash())

app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/listings" , listingRouter)
app.use("/listings/:id/reviews" , reviewRouter)
app.use("/" , userRouter)

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