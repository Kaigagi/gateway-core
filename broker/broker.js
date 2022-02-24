const aedes = require('aedes');
const broker = aedes();


const server = require('net').createServer(broker.handle)
const port = 1883

server.listen(port, function () {
  console.log('server started and listening on port ', port)
})

broker.on('clientReady', async function(client){
  console.log("--------clientReady");
  console.log(client.id);
});

broker.on("clientDisconnect", async function(client){
  console.log("-------clientDisconnect");
  console.log(client);
})


module.exports = server;