const aedes = require('aedes');
const DeviceStatus = require('../models/device_status');
const { updateDeviceStatus } = require('../services/device_status');
const broker = aedes();
const server = require('net').createServer(broker.handle)

let usernameBroker = "GDSCHSU";
let passwordBroker = "Mailaanhem123";

broker.authenticate = function (client, username, password, callback) {
    let test = password.toString("utf8");
    if (username != usernameBroker || test != passwordBroker) {
        var error = new Error('Auth error')
        error.returnCode = 4
        callback(error, null)
        return;
    }
    callback(null, true);
}


broker.on('clientReady', async function (client) {
    console.log("--------clientReady");
    let timestamp = Date.now()
    let device_status = new DeviceStatus(client.id, 1, timestamp);
    updateDeviceStatus(device_status);
});

broker.on("clientDisconnect", async function (client) {
    console.log("-------clientDisconnect");
    let timestamp = Date.now()
    let device_status = new DeviceStatus(client.id, 0, timestamp);
    updateDeviceStatus(device_status);
})


module.exports = server;