const express = require("express")
const router = express.Router()

router.get("/signup" , (req , res) => {
    res.render("user/signup.ejs" , {signup: '/css/signup.css'})
})

module.exports = router;