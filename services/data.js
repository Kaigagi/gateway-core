const { getFirestore } = require("firebase-admin/firestore");
const { databaseConstants } = require("../config/constants/database_constants");
const Data = require("../models/data");
const db = getFirestore()
// Maybe move somewhere else
const SUPPORTED_COVIDIDENTIFICATION = ["QR","RFID"]
/**
 * Send all the sensor information (person's scan) to the server 
 * @param {*} did - device id 
 * @param {*} bodyTemperature - the body temperature of person that scan 
 * @param {*} faceMask - fakemask of the person
 * @param {*} covidIdentification - the method that person use to check in
 * @param {*} isComplete - 
 * @return 
 */
async function postDeviceSensorData(did, bodyTemperature,faceMask, covidIdentification,isComplete){
        const deviceDocRef = db.collection(databaseConstants.device).doc(did);
        const deviceDoc = await deviceDocRef.get();
        //check if device exists
        if (!deviceDoc.exists) {
            throw new Error("device does not exist");
        }
        const oid = deviceDoc.data().oid;

        // Checking all the parameters that are required and check its datatype

        if(did === undefined || did === null || did === ""){
            throw new Error("wrong datatype",{cause:"did isn't exist"})
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
        if (!SUPPORTED_COVIDIDENTIFICATION.includes(covidIdentification.identificationMethod)){
            throw new Error("wrong value", {cause: "identification_method isn't QR or RFID"})
        }
        // Server timestamp (must be careful of the server location)
        const timestamp = Date.now()

        // Map data
        const deviceSensorData = new Data(did, bodyTemperature,faceMask,covidIdentification,isComplete, timestamp,oid)
        // Write to database (Cloud Firestore)
        // The firestore Node.js client do not support serialization of custom classes. here a way to get through
        // https://stackoverflow.com/questions/52221578/firestore-doesnt-support-javascript-objects-with-custom-prototypes
        // also this is the least performant, should we parse by hand or using class who know but the Lead said so
        await db.collection(databaseConstants.data).add(JSON.parse(JSON.stringify(deviceSensorData)))
}
/**
 * Get the sensor data with the timeframe given
 * @param {*} did - 
 * @param {timestamp} startTime -
 * @param {timestamp} endTime - 
 * @returns
 */
async function getDeviceSensorDataWithTime(did, startTime, endTime){
        let result = []
        if(did === undefined || did === null || did === ""){
            throw new Error("wrong datatype",{cause:"did isn't exist"})
        }

        // Check format of the startTime and EndTime
        // Check for Legit start and end timestamp query
        if(startTime > endTime){
                throw new Error("wrong datatype",{cause: "startTime and endTime is not valid"})
        }

        const dataRef = await dd.collection(databaseConstants.data)
        const snapshot = await dataRef.where('timestamp', '>=', 'startTime').where('timestamp','<=','endTime').get()
        // If there were no data just return
        if (snapshot.empty){
                return;
        }
        snapshot.forEach(doc=>{
                result.push(doc.data())
        })
        return result
}
module.exports = {
    postDeviceSensorData,
    getDeviceSensorDataWithTime
}
