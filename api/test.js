
const express = require("express")
const { headerConstants } = require("../config/constants/header_constants")
const router = express.Router()

router.get("/hello",(req,res) => {
    console.log(headerConstants.apiKeyHeader);
    res.send("<h1>Quan Dam AAA</h1>")
})

module.exports = router