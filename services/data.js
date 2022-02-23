const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore()
// Maybe move somewhere else
const SUPPORTED_COVIDIDENTIFICATION = ["QR","RFID"]

async function postDeviceSensorData(did, body_temperature,face_mask, covid_identification,is_complete){
        // Checking all the parameters that are required and check its datatype
        if (Number.isInteger(body_temperature) === true|| body_temperature === undefined){
            throw new Error("wrong datatype",{cause:"body_temperature isn't float or exist"})
        }
        if(typeof face_mask !== "boolean"){
            throw new Error("wrong datatype",{cause: "face_mask isn't boolean or exist"})
        }

        if(typeof is_complete !== "boolean"){
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
        const deviceSensorData = {
            did: did,
            body_temperature : body_temperature,
            face_mask: face_mask,
            covid_identification: {
                identification_method: covid_identification.identification_method,
                identification_data: covid_identification.identification_data,
            },
            is_complete : is_complete,
            timestamp: timestamp
        }
        
        // Write to database (Cloud Firestore)
        const res = await db.collection('data').add(deviceSensorData)
}

module.exports = {
    postDeviceSensorData
}