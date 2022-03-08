const express = require('express');
const cors = require("cors");
const dotenv = require("dotenv").config()
const admin = require('firebase-admin');
const http  = require("http")
const fs = require("fs")
const https = require("https")
const winston = require('winston');
const expressWinston = require('express-winston');
const app = express();
const { applicationDefault } = require('firebase-admin/app');

// SSL key - TODO: Will add path to environment later
// If you want your server to be HTTPS then you should insstall certbot 
// https://certbot.eff.org/ choose the right option and then follow the instruction
// fix the ssl path if needed 
if(process.env.NODE_ENV === "production"){
  const privateKey  = fs.readFileSync('/etc/letsencrypt/live/gdsc-hsu.xyz/privkey.pem', 'utf8');
  const certificate = fs.readFileSync('/etc/letsencrypt/live/gdsc-hsu.xyz/privkey.pem', 'utf8');
  const credentials = {key: privateKey, cert: certificate};
}

// Firestore account setup
const serviceAccount = require(process.env.SERVICE_ACCOUNT_PATH);


if(process.env.NODE_ENV === "production"){
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "gdsc-gateway.appspot.com"
  })
}

admin.initializeApp({
    credential: applicationDefault(),
    storageBucket: "gdsc-gateway.appspot.com"
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


// MiddleWare
app.use(express.json())
app.use(express.urlencoded())

// Learn about CORS here
// 1. https://auth0.com/blog/cors-tutorial-a-guide-to-cross-origin-resource-sharing/
// 
app.use(cors( {
  origin: '*'
}))

// Api route
app.use(`/api/${process.env.API_VERSION}`,organizationRoute)
app.use(`/api/${process.env.API_VERSION}`,deviceRoute)
app.use(`/api/${process.env.API_VERSION}`,dataRoute)
// Heath Check API
app.get('/_health', (req,res)=>{
  res.status(200).send("Server is OK")
})  

const httpServer = http.createServer(app);
const httpBrokerServer = http.createServer(server)

if (process.env.NODE_ENV === "production"){
  const httpsServer = https.createServer(credentials, app);
  const httpsBrokerServer = https.createServer(credentials, server)

  httpsBrokerServer.listen(process.env.BROKER_PORT, function () {
    console.log('Broker started and listening on port',process.env.BROKER_PORT);
  })

  httpsServer.listen(443, () => {
    console.log('Server Gateway listening on port', process.env.EXPRESS_PORT)
  })
}


// Broker Confing
httpBrokerServer.listen(1885,()=>{
  console.log('Broker started and listening on port', 1885);
})

// Express Server config
httpServer.listen(process.env.EXPRESS_PORT, () => {
    console.log('Server Gateway listening on port', process.env.EXPRESS_PORT)
})


// Shutdown gracefully
const startGracefulShutdown = ()=>{
  console.log("Closing http & broker server")
  // read the doc of close() and you will understand control C and control Z doesn't work anymore
  httpServer.close(()=>{
    console.log("[*] Http Server Closed")
  })

  if(process.env.NODE_ENV === "production"){
    httpsServer.close(()=>{
      console.log("[*] Https Server Closed")
    })
  
    httpsBrokerServer.close(()=>{
      console.log("[*] Https Broker Server Closed")
      process.exit(1  )
    })
  }
  // Should read more of these 
  // 1: https://hackernoon.com/graceful-shutdown-in-nodejs-2f8f59d1c357
  // 2: https://blog.heroku.com/best-practices-nodejs-errors
  httpBrokerServer.close(()=>{
    console.log("[*] Http Broker Server Closed")
  })
 
}
process.on('SIGTERM', startGracefulShutdown)
process.on('SIGINT', startGracefulShutdown)
