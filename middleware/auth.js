const { getFirestore } = require("firebase-admin/firestore");
const {headerConstants} = require("../config/constants/header_constants.js")
const jw = require("express-jwt")
const db = getFirestore()


/**
 * Authorized middleware to check apiKey and accessKey
 * @param {*} req - request
 * @param {*} res - response
 * @param {*} next - next middleware
 */
function isAuthorized (req,res,next){
    try{
        const apiKey = req.get(headerConstants.apiKeyHeader)
        const accessKey = req.get(headerConstants.deviceKeyHeader)
        
        if(accessKey !== API_KEY){
            throw new Error("")
        }
        if(apiKey){
            throw new Error("")
        }

        next()
    }catch(error){

    }
}