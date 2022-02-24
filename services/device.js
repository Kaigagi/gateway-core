const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore()
const { nanoid } = require('nanoid');
const { databaseConstants } = require("../config/constants/database_constants.js");
const { headerConstants } = require("../config/constants/header_constants.js");
const { messageConstants } = require("../config/constants/message_constants.js");

async function getAllDevices(){
    try {
        // get device data and push into an array
        const snapshot = await db.collection(databaseConstants.device).get();
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

async function createNewDeviceFromWeb(deviceData){
    try {
        // set device accessKey
        deviceData.accessKey = nanoid();

        // store docref
        let res = await db.collection(databaseConstants.device).add(JSON.parse(JSON.stringify(deviceData)));
        // set device id
        deviceData.id = res.id;
        // update it to database
        db.collection(databaseConstants.device).doc(res.id).update({id:res.id});
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

async function createDeviceInfo(id,accessKey,hardwareInfo) {
    const deviceData =  (await db.collection((databaseConstants.device)).doc(id).get()).data(); // try to get device data
    // check id
    if (deviceData === undefined) {
        throw new Error("invalid id",{cause:"invalid id or device does not exists"});
    }

    // check accessKey
    if(deviceData.accessKey !== accessKey){
        throw new Error("wrong accessKey",{cause:"accessKey does not match"})
    }

    console.log(typeof deviceData.hardwareInfo);
    if (Object.keys(deviceData.hardwareInfo).length === 0) {
        deviceData.hardwareInfo = hardwareInfo;
        await db.collection(databaseConstants.device).doc(id).update({hardwareInfo: hardwareInfo});
    }else{
        throw new Error("already has hardwareInfo")
    }

    return deviceData;
}


module.exports = {getAllDevices, createNewDeviceFromWeb,createDeviceInfo};

