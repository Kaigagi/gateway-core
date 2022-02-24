
const express = require("express")
const { headerConstants } = require("../config/constants/header_constants")
const { postDeviceSensorData } = require("../services/data")
const router = express.Router()

router.get("/data",(req,res) => {

})

router.post("/data",async (req,res) => {
    try { 
        // Must have Access Key and Api key 
        let accessKey = req.get("accessKey")
        let apiKey = req.get("apiKey")
        
        // TODO: Check the FORMAT of the accessKey and API key (does it in the pool of the key or not)
        if(accessKey === null || accessKey === undefined){
            if(accessKey){}
            res.sendStatus(403)
        }
        // Pass logic to the data service, using function postDeviceSensorData
        let result = await postDeviceSensorData(
            req.body.did,
            req.body.body_temperature,
            req.body.face_mask,
            req.body.covid_identification,
            req.body.is_complete
        )
        res.sendStatus(200)
    }catch(err) {
        if(err.message === "wrong datatype" || err.message === "wrong value"){
            res.sendStatus(404)
        }else{
            console.log(err)
            res.sendStatus(500)
        }
    }
})

module.exports = router