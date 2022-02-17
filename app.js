const express = require('express')
const cors = require("cors")
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const helloRoute = require("./api/test.js")

const app = express()

const PORT = 3000
const VERSION = "v1"


// Firebstore account setup
const serviceAccount = require('./gdsc-gateway-firebase.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();
// Route import

// Middle Ware

app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

// Api route

app.use(`/api/${VERSION}`,helloRoute)

// Server config
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})
