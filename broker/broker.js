const aedes = require('aedes');
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
    console.log(client.id);
});

broker.on("clientDisconnect", async function (client) {
    console.log("-------clientDisconnect");
    console.log(client);
})


module.exports = server;