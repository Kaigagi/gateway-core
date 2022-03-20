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

// Firestore account setup
if(process.env.NODE_ENV === "production"){
  admin.initializeApp({
    credential: applicationDefault(),
    storageBucket: "gdsc-gateway.appspot.com"
})
}else{
  const serviceAccount = require(process.env.SERVICE_ACCOUNT_PATH);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "gdsc-gateway.appspot.com"
  })
}

// Route import
const organizationRoute = require("./api/organization.js")
const deviceRoute = require("./api/device.js")
const dataRoute = require("./api/data.js");
const server = require('./broker/broker');
const { env } = require('process');

// Logger setup
// TODO: Need to Config the logging system again
let options = {
  file: {
    level: 'info',
    filename: `./logs/gateway.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
}
app.use(expressWinston.logger({
    transports: [
      new winston.transports.Console(options.file),
      new winston.transports.File(options.file),
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


// SSL key - TODO: Will add path to environment later
// If you want your server to be HTTPS then you should insstall certbot 
// https://certbot.eff.org/ choose the right option and then follow the instruction
// fix the ssl path if needed 
let httpsServer = undefined
if (process.env.NODE_ENV === "production"){
  const privateKey  = fs.readFileSync('/etc/letsencrypt/live/gdsc-hsu.xyz/privkey.pem', 'utf8');
  const fullchain = fs.readFileSync('/etc/letsencrypt/live/gdsc-hsu.xyz/fullchain.pem','utf8')
  const credentials = {key: privateKey, cert: fullchain};


  httpsServer = https.createServer(credentials, app);

  httpsServer.listen(443, () => {
      console.log('[*] Https Server Gateway listening on port', 443)
  })
}

// Broker Confing
server.listen(process.env.BROKER_PORT,()=>{
  console.log('Broker started and listening on port', process.env.BROKER_PORT);
})

// Express Server config
httpServer.listen(process.env.EXPRESS_PORT, () => {
    console.log('[*] Http Server Gateway listening on port', process.env.EXPRESS_PORT)
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
  }
  // Should read more of these 
  // 1: https://hackernoon.com/graceful-shutdown-in-nodejs-2f8f59d1c357
  // 2: https://blog.heroku.com/best-practices-nodejs-errors
  server.close(()=>{
    console.log("[*] Http Broker Server Closed")
    process.exit(1)
  })
 
}
process.on('SIGTERM', startGracefulShutdown)
process.on('SIGINT', startGracefulShutdown)
