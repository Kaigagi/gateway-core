const { getFirestore } = require("firebase-admin/firestore");
const { getStorage } = require('firebase-admin/storage');
const db = getFirestore();
const storage = getStorage();
const bucket = storage.bucket();
const { nanoid } = require('nanoid');
const Organization = require("../models/organization")
const { databaseConstants } = require("../config/constants/database_constants.js");

async function createNewOrg(name, id, image) {
    const downloadToken = nanoid();
    const metadata = {
        metadata: {
          // This line is very important. It's to create a download token.
          firebaseStorageDownloadTokens: downloadToken
        },
        contentType: 'image/png',
        cacheControl: 'public, max-age=31536000',
    };
    await bucket.upload('./upload/'+id,{
        metadata: metadata
    });

    // this will be replace later with an atualy image of the org
    const orgImageUrl = "https://firebasestorage.googleapis.com/v0/b/gdsc-gateway.appspot.com/o/"+id+"?alt=media&token="+downloadToken; 
    const orgEndPoint = process.env.SERVER_DOMAIN+"/org/"+id;

    const organization = new Organization(
        id,
        name,
        orgImageUrl,
        orgEndPoint,
        process.env.API_KEY,
        process.env.BROKER_USERNAME,
        process.env.BROKER_PASSWORD
    )

    const orgDocRef = db.collection(databaseConstants.organization).doc(id);
    const orgDoc = await orgDocRef.get();
    if (!orgDoc.exists) {
        await db.collection(databaseConstants.organization).doc(id).set(JSON.parse(JSON.stringify(organization)));
    }else{
        throw new Error("org already exists");
    }
}

async function updateOrg(id,name) {
    const orgDocRef = db.collection(databaseConstants.organization).doc(id);
    const orgDoc = await orgDocRef.get();
    if (orgDoc.exists) {
        await db.collection(databaseConstants.organization).doc(id).update({
            name: name
        })
    }else{
        throw new Error("org does not exists")
    }
}

module.exports = {
    createNewOrg,
    updateOrg
}