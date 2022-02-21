
const express = require("express")
const { postDeviceSensorData } = require("../services/data")
const router = express.Router()

router.get("/data",(req,res) => {

})

router.post("/data",async (req,res) => {
    try { 
        // Must have Access Key 
        let accessKey = req.get("accessKey")
        if(accessKey === null || accessKey === undefined){
            return res.sendStatus(403)
        }
        // Setup the sensor data
        let result = await postDeviceSensorData(
            req.body.did,
            req.body.body_temperature,
            req.body.face_mask,
            req.body.covid_identification,
            req.body.is_complete)
        
        res.sendStatus(200)
    }catch(err) {
        console.log(err)
        return res.sendStatus(500)
    }
})

module.exports = router