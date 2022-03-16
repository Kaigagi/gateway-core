const express = require("express")
const {getAllDevices, createNewDeviceFromWeb, createDeviceInfo,updataDeviceData,deleteDevice} = require("../services/device")
const Device = require("../models/device")
const { headerConstants } = require("../config/constants/header_constants.js");
const router = express.Router()
const checkToken = require("../middleware/token_check");

const API_KEY = process.env.API_KEY;

router.get("/device", checkToken, async (req,res) => {
    try {
        // check header
        const apiKey = req.get(headerConstants.apiKeyHeader);
        if(apiKey !== API_KEY){
            res.status(403).json({
                message: "invalid api-x-key"
            })
            return;
        }
        // get devices' data from database
        const allDevices = await getAllDevices(req.body.uid);
        return res.send(allDevices);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
})

router.post("/device/did-new", checkToken, async (req,res) => {
    try {
        // check data validation
        // required field
        const deviceName = req.body.name;
        if( deviceName === null || deviceName === undefined || deviceName === ""){
            res.status(404).json({
                message: "missing deviceName"
            })
            return;
        }

        const deviceLocation = req.body.location;
        if( deviceLocation === null || deviceLocation === undefined || deviceLocation === ""){
            res.status(404).json({
                message: "missing deviceLocation"
            })
            return;
        }

        const deviceTags = req.body.tags;
        console.log(deviceTags)
        if( deviceTags === null || deviceTags === undefined || !Array.isArray(deviceTags)){
            res.status(404).json({
                message: "device tags invalid ( must be an array )"
            })
            return;
        }

        // check Header
        const apiKey = req.get(headerConstants.apiKeyHeader); 
        if (apiKey !== API_KEY) {
            res.status(403).json({
                message: "invalid api-x-key"
            })
            return;
        }

        // business logic
        const deviceData = new Device(
            "123", /*mock id*/
            undefined,/*accessKey */
            "abc",/*mock oid */
            deviceName,/*device name */
            deviceLocation,/*device location */
            {},/*hardware info */
            req.body.tags/*tags */
        );

        let result = await createNewDeviceFromWeb(req.body.uid, deviceData); // return the result
        res.status(200).json(result)

    } catch (error) {
        console.log(error);
        if (error.message === "user does not belong to any org") {
            res.status(405).json({
                message : error.message
            })
            return;
        }
        res.sendStatus(500);
    }
})


router.post("/device",async (req,res) => {
   try {
       // check data validation
       //required field and its datatype
       const id = req.body.id;
       if (id === null || id === undefined || id === "") {
            res.status(404).json({
                message: "missing deviceId"
            })
            return;
       }


       //header check
       const apiKey = req.get(headerConstants.apiKeyHeader);
       const accessKey = req.get(headerConstants.deviceKeyHeader);
       //check apiKey
       if (apiKey !== API_KEY) {
            res.status(403).json({
                message: "invalid api-x-key"
            })
            return;
       }

       //business logic
       const result = await createDeviceInfo(
           id, /*id */
           accessKey, /*accessKey */
           req.body.hardwareInfo /*hardware Info */
        );
       res.send(result);

   } catch (error) {
       console.log(error);
       if (error.message === "invalid deviceId") {
            res.status = 404;
            return res.send(error.message);
       }
       if (error.message === "wrong accessKey") {
            res.status = 403;
            return res.send(error.message);
       }
       if (error.message === "already has hardwareInfo") {
            res.status = 409;
            return res.send(error.message);
       }
   }
})

router.put("/device",checkToken,(req,res) => {
    try {
        //TO DO: check if the device belong to the user's organization
        // check data validation
        // check required field
        const deviceName = req.body.name;
        if (deviceName === "" || deviceName === undefined || deviceName === null) {
            res.status(404).json({
                message: "missing deviceName",
            })
            return;
        }

        const deviceLocation = req.body.location;
        if( deviceLocation === null || deviceLocation === undefined || deviceLocation === ""){
            res.status(404).json({
                message: "missing deviceLocation",
            })
            return;
        }

        const deviceTags = req.body.tags;
        if (!Array.isArray(deviceTags)) {
            res.status(404).json({
                message: "device Tags must be an array",
            })
            return;
        }

        const did = req.body.did;
        if (did === "" || did === undefined || did === null) {
            res.status(404).json({
                message: "missing deviceId"
            })
            return;
        }

        //header check
        const apiKey = req.get(headerConstants.apiKeyHeader);
        //check apiKey
        if (apiKey !== API_KEY) {
            res.status(403).json({
                message : "invalid api-x-key",
            })
            return;
        }

        //business logic
        updataDeviceData(
            did, /*device id */
            deviceName, /*device name */
            deviceLocation, /*device location */
            req.body.tags /*device tags */
        );

        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
    }
})

router.delete("/device/:id",checkToken, async (req,res) => {
    try {
        // check data validation
        // required field
        const id = req.params.id;
        const apiKey = req.get(headerConstants.apiKeyHeader)
        if (id === "" || id === undefined || id === null) {
            res.status = 404;
            return res.send("missing deviceId");
        }

        //check apiKey
        if (apiKey !== API_KEY) {
            res.status = 403;
            return res.send("invalid apiKey");
        }

        await deleteDevice(id);
        res.sendStatus(200); 
    }catch(error) {
        if (error.message === "invalid deviceId") {
            res.status(404).json({
                message: error.message
            })
            return;
        }else{
            res.sendStatus(500);
        }
        console.log(error);
    }
})

module.exports = router
