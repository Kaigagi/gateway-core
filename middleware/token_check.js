const express = require("express")
const router = express.Router()
const {getAuth} = require('firebase-admin/auth');
const { headerConstants } = require("../config/constants/header_constants.js");


const bypassString = "AAAA-BBBB-CCCC-DDDD"

router.use(async (req, res, next) =>{
    try {
        const token = req.get(headerConstants.tokenHeader);

        if (process.env.NODE_ENV !== "production"){
            if(token === bypassString){
                req.body.uid = bypassString
                next();
                return;
            }
        }
        //verify token and get uid
        const decodedToken = await getAuth().verifyIdToken(token);
        //set req.body.uid
        req.body.uid = decodedToken.uid
        next();
    } catch (error) {
        console.log(error)
        res.status(406).json({
            message: "Invalid JWT token"
        })
    }
});

module.exports = router;
