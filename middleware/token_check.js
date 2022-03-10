const express = require("express")
const router = express.Router()
const {getAuth} = require('firebase-admin/auth');
const { headerConstants } = require("../config/constants/header_constants.js");

router.use(async (req, res, next) =>{
    try {
        const token = req.get(headerConstants.tokenHeader);

        //verify token and get uid
        let uid;

        const decodedToken = await getAuth().verifyIdToken(token);
        uid = decodedToken.uid;
        //set req.body.uid
        req.body.uid = uid;
        next();
    } catch (error) {
        console.log(error)
        return res.sendStatus(406)
    }
});

module.exports = router;