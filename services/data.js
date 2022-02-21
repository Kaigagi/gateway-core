const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore()


async function postDeviceSensorData(did, body_temperature,face_mask, covid_identification,is_complete){
    try{
        // Checking all the parameters that are required and check its datatype
        if (typeof body_temperature !== Float32Array || body_temperature === undefined){
            // throw new Error()
        }
        if(typeof face_mask !== Boolean){
            // throw new Error()
        }

        if(typeof is_complete !== Boolean){

        }

        if(covid_identification === {} || covid_identification === null || covid_identification === undefined){
            // throw new Error()
        }
        
        // Map data to json 
        const timestamp = Date.now()
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
        
        // Write to database
        const res = await db.collection('data').add(deviceSensorData)

    } catch (err){
        console.log(err)
    }
    
}

module.exports = {
    postDeviceSensorData
}