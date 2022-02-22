
const express = require("express")
const {getAllDevices, createNewDevice} = require("../services/device")
const router = express.Router()

router.get("/device", async (req,res) => {
    try {
        // check header
        const apiKey = req.get("apiKey");
        if(apiKey !== 123){
            return res.sendStatus(403);
        }

        const allDevices = await getAllDevices();
        return res.send(allDevices);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
})

router.post("/device/did-new",async (req,res) => {
    try {
        // check data validation
        // required field
        const deviceName = req.body.name;
        if( deviceName === null || deviceName === undefined){
            return res.sendStatus(404);
        }

        const deviceLocation = req.body.location;
        if( deviceLocation === null || deviceLocation === undefined){
            return res.sendStatus(404);
        }

        // check Header
        const apiKey = req.get("apiKey"); 
        if (apiKey !== '123') {
            return res.sendStatus(403);
        }

        // business logic
        const deviceData = {
            accessKey: undefined,
            oid: "HSU", 
            name: deviceName,
            location: deviceLocation,
            hardwareInfo: {},
            tags: req.body.tags
        }

        let result = await createNewDevice(deviceData);
        res.send(result);
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
})

router.post("/device",(req,res) => {

})

router.put("/device",(req,res) => {

})

router.delete("/device",(req,res) => {

})

module.exports = router