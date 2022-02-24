const express = require('express');
const cors = require("cors");

const admin = require('firebase-admin');
const winston = require('winston');
const expressWinston = require('express-winston');
const app = express();

const APP_PORT = 3000;
const BROKER_PORT = 1883;
const VERSION = "v1";

// Firebstore account setup
const serviceAccount = require('./gdsc-gateway-firebase.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

// Route import
const helloRoute = require("./api/test.js")
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

app.use(`/api/${VERSION}`,helloRoute)
app.use(`/api/${VERSION}`,organizationRoute)
app.use(`/api/${VERSION}`,deviceRoute)
app.use(`/api/${VERSION}`,dataRoute)


//Broker
server.listen(BROKER_PORT, function () {
  console.log('Broker started and listening on port', BROKER_PORT);
})

// Server config
app.listen(APP_PORT, () => {
    console.log('Server Gateway listening on port', APP_PORT)
})
