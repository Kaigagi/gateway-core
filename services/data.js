const { getFirestore } = require("firebase-admin/firestore");
const Data = require("../models/data");
const db = getFirestore()
// Maybe move somewhere else
const SUPPORTED_COVIDIDENTIFICATION = ["QR","RFID"]

async function postDeviceSensorData(did, body_temperature,face_mask, covid_identification,is_complete){
        // Checking all the parameters that are required and check its datatype

        if(did === undefined || did === null || did === ""){
            throw new Error("wrong datatyoe",{cause:"did isn't exist"})
        }

        if (Number.isInteger(body_temperature) === true|| body_temperature === undefined){
            throw new Error("wrong datatype",{cause:"body_temperature isn't float or exist"})
        }

        if(typeof face_mask !== "boolean" || face_mask === null || face_mask === undefined){
            throw new Error("wrong datatype",{cause: "face_mask isn't boolean or exist"})
        }

        if(typeof is_complete !== "boolean" || is_complete === null || face_mask === undefined){
            throw new Error("wrong datatype", {cause: "is_complete isn't boolean or exist"})
        }

        if(covid_identification === {} || covid_identification === null || covid_identification === undefined){
            throw new Error("wrong datatype",{cause: "covid_identification is json or exist"})
        }

        // Check the support identification methods, maybe this array will be move into another module
        // and be store as supported identification methods
        if (SUPPORTED_COVIDIDENTIFICATION.includes(covid_identification.identification_method) == false){
            throw new Error("wrong value", {cause: "identification_method isn't QR or RFID"})
        }
        
        // Server timestamp (must be careful of the server location)
        const timestamp = Date.now()

        // Map data
        const deviceSensorData = new Data(did, body_temperature,face_mask,covid_identification,is_complete, timestamp)
        
        // Write to database (Cloud Firestore)
        // The firestore Node.js client do not support serialization of custom classes. here a way to get through
        // https://stackoverflow.com/questions/52221578/firestore-doesnt-support-javascript-objects-with-custom-prototypes
        // also this is the least performant, should we parse by hand or using class who know but the Lead said so
        const res = await db.collection('data').add(JSON.parse(JSON.stringify(deviceSensorData)))
}

module.exports = {
    postDeviceSensorData
}