const express = require('express')
const cors = require("cors")
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const winston = require('winston');

const expressWinston = require('express-winston');
// Route import
const helloRoute = require("./api/test.js")
const organizationRoute = require("./api/organization.js")
const deviceRoute = require("./api/device.js")
const dataRoute = require("./api/data.js")

const app = express()

const PORT = 3000
const VERSION = "v1"


// Firebstore account setup
// const serviceAccount = require('./gdsc-gateway-firebase.json');

// initializeApp({
//   credential: cert(serviceAccount)
// });

// Logger setup

app.use(expressWinston.logger({
    transports: [
      new winston.transports.Console()
    ],
    format: winston.format.combine(
      winston.format.json()
    ),
    meta: false,
    msg: "HTTP  ",
    expressFormat: true,
    colorize: false,
    ignoreRoute: function (req, res) { return false; }
  }));
  

// const db = getFirestore();


// Middle Ware

app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

// Api route

app.use(`/api/${VERSION}`,helloRoute)
app.use(`/api/${VERSION}`,organizationRoute)
app.use(`/api/${VERSION}`,deviceRoute)
app.use(`/api/${VERSION}`,dataRoute)

// Server config
app.listen(PORT, () => {
    console.log(`Server Gateway listening on port ${PORT}`)
})
