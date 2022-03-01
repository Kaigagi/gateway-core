
const express = require("express")
const router = express.Router()
const { headerConstants } = require("../config/constants/header_constants.js");
const {createNewOrg,updateOrg} = require("../services/organization")

const API_KEY = process.env.API_KEY;

router.post("/organization",async (req,res) => {
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

        const orgImageUrl = "https://www.hoasen.edu.vn/wp-content/uploads/2022/02/HSU.jpg"; // will be replace later with an atualy image of the org
        const orgEndPoint = process.env.SERVER_DOMAIN+"/org/"+orgId;

        //business logic
        const result = await createNewOrg(
            orgName,
            orgId
        )

        return res.sendStatus(201);
    } catch (error) {
        if (error.message === "org already exists") {
            return res.sendStatus(404);
        }
        console.log(error);
        return res.sendStatus(500);
    }
})

router.put("/organization",async (req,res) => {
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
        // this endpoint enable organization to update their image too
        // but we are still working on a solution for the image
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