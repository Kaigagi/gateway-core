const express = require("express")
const router = express.Router()
const {getAuth} = require('firebase-admin/auth');
const { headerConstants } = require("../config/constants/header_constants.js");

router.use(async (req, res, next) =>{
    try {
        const token = req.get(headerConstants.tokenHeader);

        const decodedToken = await getAuth().verifyIdToken(token);
        let uid = decodedToken.uid;
        //set req.body.uid
        req.body.uid = uid;

        next();
    } catch (error) {
        console.log(error)
        res.status(406).json({
            message: "Invalid JWT token"
        })
    }
});

module.exports = router;
