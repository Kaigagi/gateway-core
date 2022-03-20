
const express = require("express")
const { headerConstants } = require("../config/constants/header_constants")
const { postDeviceSensorData, getDeviceSensorDataWithTime } = require("../services/data")
const router = express.Router()
// TODO: Add the GET Route when the dashboard needed 
router.get("/data", async (req, res) => {
    try{
        let apiKey= req.get(headerConstants.apiKeyHeader)
        if(apiKey === null || apiKey === undefined || apiKey === ""){
            res.sendStatus(403)
        }

        let result = await getDeviceSensorDataWithTime(
                req.body.did,
                req.body.startTime,
                req.body.endTime
        )

        res.send(result)
    }catch(error){
        console.log(error) 
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
        let result = await postDeviceSensorData(
            req.body.did,
            req.body.bodyTemperature,
            req.body.faceMask,
            req.body.covidIdentification,
            req.body.isComplete
        )

        res.sendStatus(200)

    } catch (err) {
        if (err.message === "wrong datatype" || err.message === "wrong value") {
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
