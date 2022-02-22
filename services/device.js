const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore()
const { nanoid } = require('nanoid')

async function getAllDevices(){
    try {
        // get device data and push into an array
        const snapshot = await db.collection("devices").get();
        let devicesArray = [];
        snapshot.forEach((device) =>{
            let deviceData = device.data();
            devicesArray.push(deviceData)
        })
    return devicesArray;
    } catch (error) {
        console.log(error)
    }
}

async function createNewDevice(deviceData){
    try {
        //check data type
        if(deviceData.hardwareInfo !== {}){
            // throw error
        }

        // set device accessKey
        deviceData.accessKey = nanoid();

        // store docref
        let res = await db.collection("devices").add(deviceData);
        return {
            id: res.id,
            accessKey: deviceData.accessKey,
            oid: deviceData.oid,
            endpoint: "https://abc.com"
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = {getAllDevices, createNewDevice};

