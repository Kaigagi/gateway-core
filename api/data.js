
const express = require("express")
const { headerConstants } = require("../config/constants/header_constants")
const { postDeviceSensorData, getDeviceSensorDataWithTime } = require("../services/data")
const router = express.Router()
const checkToken = require("../middleware/token_check");
const API_KEY = process.env.API_KEY;
// TODO: Add the GET Route when the dashboard needed 
router.get("/data",checkToken, async (req, res) => {
    try{
        let apiKey= req.get(headerConstants.apiKeyHeader)
        if(apiKey === null || apiKey === undefined || apiKey === "" || apiKey === API_KEY){
            res.status(403).json({
                message: "invalid api-x-key"
            })
        }
        // Return an array of sensor data
        let result = await getDeviceSensorDataWithTime(
                req.body.did,
                req.body.startTime,
                req.body.endTime
        )

        res.send(result)
    }catch(error){

        console.log(error) 
        res.status(500).json({
            message: error.message
        })
    }
})
/**
 * @swagger
 * /data:
 *  get:
 *      
 */
router.post("/data", async (req, res) => {
    try {
        // Must have Access Key and Api key 
        let accessKey = req.get(headerConstants.deviceKeyHeader)
        let apiKey = req.get(headerConstants.apiKeyHeader)

        // Check Header first
        if (accessKey === null || accessKey === undefined || accessKey === "") {
            res.status(403).json({
                message: "invalid access-key"
            })
            return;
        }
        if(apiKey === null || apiKey === undefined || apiKey === ""){
            res.status(403).json({
                message: "invalid api-x-key"
            })
            return;
        }
        // Pass logic to the data service, using function postDeviceSensorData
        await postDeviceSensorData(
            req.body.did,
            req.body.bodyTemperature,
            req.body.faceMask,
            req.body.covidIdentification,
            req.body.isComplete,
        )

        res.sendStatus(200)

    } catch (err) {
        if (err.message === "wrong datatype" || err.message === "wrong value" || err.message === "device does not exist") {
            res.status(404).json({
                message: err.message,
                cause: err.cause,
            })
        } else {
            console.log(err)
            res.status(500).json({
                message: "Fail Exception need to be catch"
            })
        }
    }
})

module.exports = router
