
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
const {createNewOrg, updateOrg, getOrganization} = require("../services/organization")

const API_KEY = process.env.API_KEY;

router.get("/organization", async (req,res)=>{
    try {
        //check token
        const token = req.get(headerConstants.tokenHeader);
        if (token === null|| token === undefined || token === "" || typeof token !== "string") {
            return res.sendStatus(404);
        }

        //business logic
        const result = await getOrganization(token);
        res.header = "200";
        res.send(result);
    } catch (error) {
        console.log(error);
        if (error.message === "user does not belong to any organization" || error.message === "token invalid") {
            res.sendStatus(400);
        }
        res.sendStatus(500);
    }
})

router.post("/organization", upload.single("image") ,async (req,res) => {
    try {
        //check token
        const token = req.get(headerConstants.tokenHeader);
        if (token === null|| token === undefined || token === "" || typeof token !== "string") {
            return res.sendStatus(404);
        }

        // check data validation
        const orgName =  req.body.name;
        if (orgName === "" || typeof orgName !== "string" || orgName === null || orgName === undefined) {
            return res.sendStatus(404);
        }

        const orgId = req.body.id;
        if (orgId === "" || typeof orgId !== "string" || orgId === null || orgId === undefined || orgId.includes("/")|| orgId === "." || orgId.includes(".*")) {
            return res.sendStatus(404);
        }


        // check Header
        const apiKey = req.get(headerConstants.apiKeyHeader); 
        if (apiKey !== API_KEY) {
            return res.sendStatus(403);
        }

        //business logic
        const result = await createNewOrg(
            token, 
            orgName,
            orgId,
        )

        // 201: created
        return res.sendStatus(201);
    } catch (error) {
        console.log(error);
        if (error.message === "org already exists" || error.message === "user has already belong to an org" || error.message === "token invalid") {
            return res.sendStatus(404);
        }
        return res.sendStatus(500);
    }
})

router.put("/organization", upload.single("image"), async (req,res) => {
    try {
        //check token
        const token = req.get(headerConstants.tokenHeader);
        if (token === null|| token === undefined || token === "" || typeof token !== "string") {
            return res.sendStatus(404);
        }

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
        const result = await updateOrg(token, orgId, orgName);

        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        if (error.message === "org does not exists" || error.message === "user does not belong to this org" || error.message === "token invalid") {
            return res.sendStatus(404);
        }
        return res.sendStatus(500);
    }
})

module.exports = router