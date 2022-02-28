const express = require('express');
const cors = require("cors");
const dotven = require("dotenv").config()
const admin = require('firebase-admin');
const winston = require('winston');
const expressWinston = require('express-winston');
const app = express();


// Firebstore account setup
const serviceAccount = require(process.env.SERVICE_ACCOUNT_PATH);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

// Route import
const organizationRoute = require("./api/organization.js")
const deviceRoute = require("./api/device.js")
const dataRoute = require("./api/data.js");
const server = require('./broker/broker');

// Logger setup

app.use(expressWinston.logger({
    transports: [
      new winston.transports.Console()
    ],
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
    ),
    meta: true,
    msg: "HTTP  ",
    expressFormat: true,
    colorize: false,
    ignoreRoute: function (req, res) { return false; }
  }));


// Middle Ware

app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

// Api route
app.use(`/api/${process.env.API_VERSION}`,organizationRoute)
app.use(`/api/${process.env.API_VERSION}`,deviceRoute)
app.use(`/api/${process.env.API_VERSION}`,dataRoute)
// Heath Check API
app.get('/_health', (req,res)=>{
  res.status(200).send("OK")
})  

//Broker
const brokerServer = server.listen(process.env.BROKER_PORT, function () {
  console.log('Broker started and listening on port',process.env.BROKER_PORT);
})

// Server config
const expressServer = app.listen(process.env.EXPRESS_PORT, () => {
    console.log('Server Gateway listening on port', process.env.EXPRESS_PORT)
})

// Shutdown gracefully
const startGracefulShutdown = ()=>{
  console.log("Closing http & broker server")
  // read the doc of close() and you will understand control C and control Z doesn't work anymore
  expressServer.close(()=>{
    console.log("Http server closed")
  })

  // Should read more of these 
  // 1: https://hackernoon.com/graceful-shutdown-in-nodejs-2f8f59d1c357
  // 2: https://blog.heroku.com/best-practices-nodejs-errors
  brokerServer.close(()=>{
    console.log("Broker server closing")
    process.exit(1  )
  })
}
process.on('SIGTERM', startGracefulShutdown)
process.on('SIGINT', startGracefulShutdown)
