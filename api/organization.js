
const express = require("express")
const router = express.Router()
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './upload/')
    },
    // name the image by the org id
    filename: function (req, file, cb) {
        cb(null, req.body.id);
    }
})
const upload = multer({storage: storage});
const { headerConstants } = require("../config/constants/header_constants.js");
const {createNewOrg,updateOrg} = require("../services/organization")

const API_KEY = process.env.API_KEY;

router.post("/organization", upload.single("image") ,async (req,res) => {
    try {
        // check data validation
        const orgName =  req.body.name;
        if (orgName === "" || typeof orgName !== "string" || orgName === null || orgName === undefined) {
            return res.sendStatus(404);
        }

        const orgId = req.body.id;
        if (orgId === "" || typeof orgId !== "string" || orgId === null || orgId === undefined) {
            return res.sendStatus(404);
        }

        // check Header
        const apiKey = req.get(headerConstants.apiKeyHeader); 
        if (apiKey !== API_KEY) {
            return res.sendStatus(403);
        }

        //business logic
        const result = await createNewOrg(
            req.body.uid, // user unique id
            orgName,
            orgId,
        )

        // 201: created
        return res.sendStatus(201);
    } catch (error) {
        if (error.message === "org already exists") {
            return res.sendStatus(404);
        }
        console.log(error);
        return res.sendStatus(500);
    }
})

router.put("/organization", upload.single("image"), async (req,res) => {
    try {
        //check data validation
        const orgName =  req.body.name;
        if (orgName === "" || typeof orgName !== "string" || orgName === null || orgName === undefined) {
            return res.sendStatus(404);
        }
        const orgId = req.body.id;
        if (orgId === "" || typeof orgId !== "string" || orgId === null || orgId === undefined) {
            return res.sendStatus(404);
        }

        // check Header
        const apiKey = req.get(headerConstants.apiKeyHeader); 
        if (apiKey !== API_KEY) {
            return res.sendStatus(403);
        }

        //business logic
        const result = await updateOrg(orgId, orgName);

        return res.sendStatus(200);
    } catch (error) {
        if (error.message === "org does not exists") {
            return res.sendStatus(404);
        }
        console.log(error);
        return res.sendStatus(500);
    }
})

module.exports = router