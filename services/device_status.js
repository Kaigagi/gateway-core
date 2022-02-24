const { getFirestore } = require("firebase-admin/firestore");
const { databaseConstants } = require("../config/constants/database_constants");
const db = getFirestore()



async function updateDeviceStatus(device_status) {
    db.collection(databaseConstants.device_status).doc(device_status.id).set(device_status.toJson());
}

module.exports = { updateDeviceStatus };