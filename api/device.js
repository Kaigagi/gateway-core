const express = require("express")
const Device = require("../models/device")
const { getAllDeviceInformation, postDeviceSensorData } = require("../services/device")
const router = express.Router()


// Get all device information, with pagination
router.get("/device",async (req,res) => {
    const deviceInfo = getAllDevicesInformation()
    
    
})

// Post device sensor data on to firestore
router.post("/device/:did",async (req,res) => {
    
})


router.post("/device",(req,res) => {
   
})

router.put("/device",(req,res) => {

})

router.delete("/device",(req,res) => {

})

module.exports = router