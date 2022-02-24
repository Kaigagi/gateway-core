const express = require("express")
const {getAllDevices, createNewDeviceFromWeb, createDeviceInfo} = require("../services/device")
const Device = require("../models/device")
const router = express.Router()

const API_KEY = "123";

router.get("/device", async (req,res) => {
    try {
        // check header
        const apiKey = req.get("apiKey");
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

router.post("/device/did-new",async (req,res) => {
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
        const apiKey = req.get("apiKey"); 
        if (apiKey !== API_KEY) {
            return res.sendStatus(403);
        }

        // business logic
        const deviceData = new Device("123",undefined,"HSU",deviceName,deviceLocation,{},req.body.tags);

        let result = await createNewDeviceFromWeb(deviceData); // return the result
        res.status = 200;
        res.send(result);
    } catch (error) {
        console.log(error);
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
       const apiKey = req.get("apiKey");
       const accessKey = req.get("accessKey");
       //check apiKey
       if (apiKey !== API_KEY) {
            return res.sendStatus(403);
       }

       //business logic
       const result = await createDeviceInfo(id,accessKey,req.body.hardwareInfo);
       res.send(result);

   } catch (error) {
       console.log(error);
       if (error.message === "invalid id" || error.message === "wrong accessKey" ) {
           res.sendStatus(403);
       }
   }
})

router.put("/device",(req,res) => {

})

router.delete("/device",(req,res) => {

})

module.exports = router