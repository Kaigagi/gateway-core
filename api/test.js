
const express = require("express")
const router = express.Router()

router.get("/hello",(req,res) => {
    res.send("<h1>Quan Dam AAA</h1>")
})


module.exports = router