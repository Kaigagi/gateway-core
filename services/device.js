const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore()
const { nanoid } = require('nanoid');
const { databaseConstants } = require("../config/constants/database_constants.js");
const Device = require("../models/device.js");

/**
 * Get all device that currently available 
 * @returns {Array<Device>} Return an array of Device (class) 
 */
async function getAllDevices(uid){
    try {
        // get oid
        console.log(uid)
        const userDocRef = db.collection(databaseConstants.user).doc(uid);
        const userDoc = await userDocRef.get();
        const oid = userDoc.data().oid;
        console.log(oid)

        // get device data and push into an array
        const snapshot = await db.collection(databaseConstants.device).where("oid","==",oid).get();
        let devicesArray = [];
        snapshot.forEach((device) =>{
            let deviceData = device.data();
            devicesArray.push(deviceData)
        })
    return devicesArray;
    } catch (error) {
        throw new Error(error.message);
    }
}

/**
 * Create new device from web
 * 
 * @param {Device} deviceData - A Device Object,
 * @returns {}
 */
async function createNewDeviceFromWeb(uid, deviceData){
    try {
        //check oid
        const userDocRef = db.collection(databaseConstants.user).doc(uid);
        const userDoc = await userDocRef.get();

        if (userDoc.exists) {
            // set oid
            const oid = userDoc.data().oid;
            deviceData.oid = oid;
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
                apiKey: process.env.API_KEY,
                oid: deviceData.oid,
                endpoint: process.env.ENDPOINT,
                mqttUserName: process.env.BROKER_USERNAME,
                mqttPassword: process.env.BROKER_PASSWORD,
            }
        }else{
            throw new Error("user does not belong to any org")
        }
    } catch (error) {
        throw new Error(error.message);
    }

}
/**
 * Create Device Information 
 * @param {*} id 
 * @param {*} accessKey 
 * @param {*} hardwareInfo 
 * @returns 
 */
async function createDeviceInfo(id,accessKey,hardwareInfo) {
    try {
        const deviceData =  (await db.collection((databaseConstants.device)).doc(id).get()).data(); // try to get device data
        // check id
        if (deviceData === undefined) {
            throw new Error("invalid id",{cause:"invalid id or device does not exists"});
        }

        // check accessKey
        if(deviceData.accessKey !== accessKey){
            throw new Error("wrong accessKey",{cause:"accessKey does not match"})
        }

        if (Object.keys(deviceData.hardwareInfo).length === 0) {
            deviceData.hardwareInfo = hardwareInfo;
            await db.collection(databaseConstants.device).doc(id).update({hardwareInfo: hardwareInfo});
        }else{
            throw new Error("already has hardwareInfo")
        }

        return deviceData;
    } catch (error) {
        throw new Error(error.message);
    }
}

/**
 * 
 * @param {*} id 
 * @param {*} name 
 * @param {*} location 
 * @param {*} tags 
 */
async function updataDeviceData(did,name,location,tags) {
    //TODO: check if device belong to user's organization
    try {
        await db.collection(databaseConstants.device).doc(did).update({
            name: name,
            location: location,
            tags: tags
        })
    } catch (error) {
        throw new Error(error.message);
    }
}

/**
 * 
 * @param {*} id 
 */
async function deleteDevice(id) {
    try {
        const deviceDoc = await db.collection(databaseConstants.device).doc(id);
        const deviceSnapShot = await deviceDoc.get();
        if (!deviceSnapShot.exists) {
            throw new Error("invalid deviceId");
        }else{
            deviceDoc.delete();
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {
    getAllDevices, 
    createNewDeviceFromWeb,
    createDeviceInfo,
    updataDeviceData,
    deleteDevice
};

