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
            return res.sendStatus(403);
        }
        // get devices' data from database
        const allDevices = await getAllDevices();
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
            return res.sendStatus(404);
        }

        const deviceLocation = req.body.location;
        if( deviceLocation === null || deviceLocation === undefined || deviceLocation === ""){
            return res.sendStatus(404);
        }

        // check Header
        const apiKey = req.get(headerConstants.apiKeyHeader); 
        if (apiKey !== API_KEY) {
            return res.sendStatus(403);
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
        res.status = 200;
        res.send(result);
    } catch (error) {
        console.log(error);
        if (error.message === "user already belong to an org") {
            return res.sendStatus(405);
        }
        return res.sendStatus(500);
    }
})


router.post("/device",async (req,res) => {
   try {
       // check data validation
       //required field and its datatype
       const id = req.body.id;
       if (id === null || id === undefined || id === "") {
           return res.sendStatus(404);
       }

       //header check
       const apiKey = req.get(headerConstants.apiKeyHeader);
       const accessKey = req.get(headerConstants.deviceKeyHeader);
       //check apiKey
       if (apiKey !== API_KEY) {
            return res.sendStatus(403);
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
       if (error.message === "wrong accessKey" ) {
           res.sendStatus(403);
       }
       if(error.message === "invalid id"){
           res.sendStatus(404);
       }
       if (error.message === "already has hardwareInfo") {
           res.sendStatus(409);
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
            return res.sendStatus(404);
        }

        const deviceLocation = req.body.location;
        if( deviceLocation === null || deviceLocation === undefined || deviceLocation === ""){
            return res.sendStatus(404);
        }

        const deviceTags = req.body.tags;
        if (!Array.isArray(deviceTags)) {
            return res.sendStatus(404);
        }

        const did = req.body.did;
        if (did === "" || did === undefined || did === null) {
            return res.sendStatus(404);
        }

        //header check
        const apiKey = req.get(headerConstants.apiKeyHeader);
        //check apiKey
        if (apiKey !== API_KEY) {
            return res.sendStatus(403);
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
        if (id === "" || id === undefined || id === null) {
            return res.sendStatus(404);
        }

        await deleteDevice(id);
        // for more detail about this 204 status
        // https://www.mscharhag.com/api-design/rest-deleting-resources
        res.sendStatus(204); 
    }catch(error) {
        if (error.message === "doc does not exists") {
            res.sendStatus(404);
        }else{
            res.sendStatus(500);
        }
        console.log(error);
    }
})

module.exports = router