
const express = require("express");
const router = express.Router();
const { nanoid } = require('nanoid');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './upload/')
    },
    // name the image by the org id
    filename: function (req, file, cb) {
        const imageName = nanoid();
        req.body.imageName = imageName;
        cb(null, imageName);
    }
})
const upload = multer({storage: storage});
const { headerConstants } = require("../config/constants/header_constants.js");
const {createNewOrg, updateOrg, getOrganization, getOrganizationForDevice} = require("../services/organization")
const checkToken = require("../middleware/token_check");

const API_KEY = process.env.API_KEY;
/**
 * Get the organization's information  
 *
 * 200 - return org's info
 * 400 - user doesn't belong to any org
 * 403 - Permission denied (jwt no vaild)
 *
* */
router.get("/organization",checkToken, async (req,res)=>{
    try {
        //check token exist or get pass or not
        const token = req.get(headerConstants.tokenHeader);
        if (token === null|| token === undefined || token === "" || typeof token !== "string") {
            // return 403 
            res.status(403).json({
                message: "Permission Denied",
                cause: "Token not provide"
            })
            return;
        }

        //business logic
        const result = await getOrganization(req.body.uid);

        res.status(200).json(result)

    } catch (error) {
        console.log(error);
        if (error.message === "user does not belong to any organization") {
            res.status(400).json({
                message: error.message, 
            })
            return;
        }
        return res.sendStatus(500);
    }
})

router.post("/organization", upload.single("image"),checkToken,async (req,res) => {
    try {   

        // check data validation
        const orgName =  req.body.name;
        if (orgName === "" || typeof orgName !== "string" || orgName === null || orgName === undefined) {
            res.status = 404;
            return res.send("missing orgName");
        }


        const orgId = req.body.id;
        if (orgId === "" || typeof orgId !== "string" || orgId === null || orgId === undefined || orgId.includes("/")|| orgId === "." || orgId.includes(".*")) {
            res.status = 404;
            return res.send("missing orgId");
        }

        // check Header
        const apiKey = req.get(headerConstants.apiKeyHeader); 
        if (apiKey !== API_KEY) {
            res.status = 403;
            return res.send("invalid apiKey");
        }

        //business logic
        const result = await createNewOrg(
            req.body.uid,
            orgName,
            orgId,
            req.body.imageName
        )

        res.status(200).json({
            message: "OK",
        })

    } catch (error) {
        console.log(error);
        if (error.message === "org already exists" ) {
            res.status(409).json({
                message: error.message,
            })
        }
        if (error.message === "user has already belong to an org") {
             res.status(401).json({
                message: error.message,
            })
        }
        return res.sendStatus(500);
    }
})

router.put("/organization",upload.single("image"),checkToken, async (req,res) => {
    try {

        //check data validation
        const orgName =  req.body.name;
        if (orgName === "" || typeof orgName !== "string" || orgName === null || orgName === undefined) {
                res.status(404).json({
                message: "missing orgName"
            })
        }

        // check Header
        const apiKey = req.get(headerConstants.apiKeyHeader); 
        if (apiKey !== API_KEY) {

            res.status(403).json({
                message: "invalid api-x-key"
            })
        }

        //business logic
        const result = await updateOrg(req.body.uid, orgName, req.body.imageName);

        res.status(200).json({
            message: "OK"
        })
    } catch (error) {
        console.log(error);
        if (error.message === "org does not exists" || error.message === "user does not belong to this org") {
            res.status(405).json({
                message: error.message,
            })
        }
        return res.sendStatus(500);
    }
})

router.get("/organization/:oid", async (req,res) => {
    try {
        // check data validation
        const oid = req.params.oid;
        if (oid === "" || oid === undefined || oid === null || typeof oid !== "string") {
            res.status(404).json({
                message: "oid invalid",
            })
        }

        // business logic
        const result = await getOrganizationForDevice(oid);

        res.status(200).send(result);
    } catch (error) {
        console.log(error.message);
        if (error.message === "oid does not exists") {
            res.status(405).json({
                message: error.message,
            })
            return
        }
        return res.sendStatus(500);
    }
})

module.exports = router
