const express = require('express')
const cors = require("cors")
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const app = express()
const PORT = 3000

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



// Server config
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})