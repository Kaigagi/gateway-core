const { getFirestore } = require("firebase-admin/firestore");
const { databaseConstants } = require("../config/constants/database_constants");
const Data = require("../models/data");
const db = getFirestore()
// Maybe move somewhere else
const SUPPORTED_COVIDIDENTIFICATION = ["QR","RFID"]

async function postDeviceSensorData(did, bodyTemperature,faceMask, covidIdentification,isComplete){
        // Checking all the parameters that are required and check its datatype

        if(did === undefined || did === null || did === ""){
            throw new Error("wrong datatyoe",{cause:"did isn't exist"})
        }

        if (Number.isInteger(bodyTemperature) === true|| bodyTemperature === undefined){
            throw new Error("wrong datatype",{cause:"bodyTemperature isn't float or exist"})
        }

        if(typeof faceMask !== "boolean" || faceMask === null || faceMask === undefined){
            throw new Error("wrong datatype",{cause: "faceMask isn't boolean or exist"})
        }

        if(typeof isComplete !== "boolean" || isComplete === null || faceMask === undefined){
            throw new Error("wrong datatype", {cause: "isComplete isn't boolean or exist"})
        }

        if(covidIdentification === {} || covidIdentification === null || covidIdentification === undefined){
            throw new Error("wrong datatype",{cause: "covidIdentification is json or exist"})
        }

        // Check the support identification methods, maybe this array will be move into another module
        // and be store as supported identification methods
        if (SUPPORTED_COVIDIDENTIFICATION.includes(covidIdentification.identificationMethod) == false){
            throw new Error("wrong value", {cause: "identification_method isn't QR or RFID"})
        }
        
        // Server timestamp (must be careful of the server location)
        const timestamp = Date.now()

        // Map data
        const deviceSensorData = new Data(did, bodyTemperature,faceMask,covidIdentification,isComplete, timestamp)
        
        // Write to database (Cloud Firestore)
        // The firestore Node.js client do not support serialization of custom classes. here a way to get through
        // https://stackoverflow.com/questions/52221578/firestore-doesnt-support-javascript-objects-with-custom-prototypes
        // also this is the least performant, should we parse by hand or using class who know but the Lead said so
        const res = await db.collection(databaseConstants.data).add(JSON.parse(JSON.stringify(deviceSensorData)))
}

module.exports = {
    postDeviceSensorData
}