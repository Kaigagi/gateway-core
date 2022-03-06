const { getFirestore } = require("firebase-admin/firestore");
const { getStorage } = require('firebase-admin/storage');
const db = getFirestore();
const storage = getStorage();
const bucket = storage.bucket();
const { nanoid } = require('nanoid');
const Organization = require("../models/organization")
const { databaseConstants } = require("../config/constants/database_constants.js");

async function createNewOrg(uid, name, id) {

    const orgDocRef = db.collection(databaseConstants.organization).doc(id);
    const orgDoc = await orgDocRef.get();

    // check if not exists
    if (!orgDoc.exists) {
        // asgin org id to user 
        const userDocRef = db.collection(databaseConstants.user).doc(uid);
        const orgDoc = await userDocRef.get();

        if (!orgDoc.exists) {
            await userDocRef.set({
                oid: id
            })
        }

        //generate download Token
        const downloadToken = nanoid();

        // metadata
        const metadata = {
            metadata: {
            // This line is very important. It's to create a download token.
            // We need this so we can manage our own download Token otherwise it will be automatically generated
            firebaseStorageDownloadTokens: downloadToken
            },
            contentType: 'image/png',
            // cache time
            cacheControl: 'public, max-age=31536000', 
        };

        //upload image
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

        await db.collection(databaseConstants.organization).doc(id).set(JSON.parse(JSON.stringify(organization)));
    }else{
        throw new Error("org already exists");
    }
}

async function updateOrg(id,name) {
    const orgDocRef = db.collection(databaseConstants.organization).doc(id);
    const orgDoc = await orgDocRef.get();
    // check if exists
    if (orgDoc.exists) {

        //generate download Token
        const downloadToken = nanoid();

        // metadata
        const metadata = {
            metadata: {
            // This line is very important. It's to create a download token.
            // We need this so we can manage our own download Token otherwise it will be automatically generated
            firebaseStorageDownloadTokens: downloadToken
            },
            contentType: 'image/png',
            // cache time
            cacheControl: 'public, max-age=31536000', 
        };

        //upload image
        await bucket.upload('./upload/'+id,{
            metadata: metadata
        });

        //new image url
        const orgImageUrl = "https://firebasestorage.googleapis.com/v0/b/gdsc-gateway.appspot.com/o/"+id+"?alt=media&token="+downloadToken; 

        await db.collection(databaseConstants.organization).doc(id).update({
            name: name,
            imageUrl: orgImageUrl
        })
    }else{
        throw new Error("org does not exists")
    }
}

module.exports = {
    createNewOrg,
    updateOrg
}