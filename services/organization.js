const { getFirestore } = require("firebase-admin/firestore");
const { getStorage } = require('firebase-admin/storage');
const {getAuth} = require('firebase-admin/auth')
const db = getFirestore();
const storage = getStorage();
const bucket = storage.bucket();
const { nanoid } = require('nanoid');
const fs = require('fs');
const Organization = require("../models/organization")
const { databaseConstants } = require("../config/constants/database_constants.js");

async function createNewOrg(token, name, id) {
    //verify token and get uid
    let uid;
    try {
        const decodedToken = await getAuth().verifyIdToken(token);
        uid = decodedToken.uid;
    } catch (error) {
        console.log(error)
        throw new Error("token invalid")
    }

    const orgDocRef = db.collection(databaseConstants.organization).doc(id);
    const orgDoc = await orgDocRef.get();

    // check if not exists
    if (!orgDoc.exists) {
        // asgin org id to user 
        const userDocRef = db.collection(databaseConstants.user).doc(uid);
        const userDoc = await userDocRef.get();

        // if user has already belong to an org, throw error
        if (!userDoc.exists) {
            await userDocRef.set({
                oid: id
            })
        }else{
            throw new Error("user has already belong to an org")
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
        // delete image on server
        fs.unlink('./upload/'+id, (error)=>{
            console.log(error);
        });
    }else{
        throw new Error("org already exists");
    }
}

async function updateOrg(token, id, name) {
    //verify token and get uid
    let uid;
    try {
        const decodedToken = await getAuth().verifyIdToken(token);
        uid = decodedToken.uid;
    } catch (error) {
        console.log(error)
        throw new Error("token invalid")
    }

    const userDocRef = db.collection(databaseConstants.user).doc(uid);
    const userDoc = await userDocRef.get();

    // if user has already belong to an org, throw error
    if (userDoc.data().oid !== id) {
        throw new Error("user does not belong to this org")
    }

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

        // delete image on server
        fs.unlink('./upload/'+id, (error)=>{
            console.log(error);
        });
    }else{
        throw new Error("org does not exists")
    }
}

async function getOrganization(token) {
    //verify token and get uid
    let uid;
    try {
        const decodedToken = await getAuth().verifyIdToken(token);
        uid = decodedToken.uid;
    } catch (error) {
        console.log(error)
        throw new Error("token invalid")
    }

    const userDocRef = db.collection(databaseConstants.user).doc(uid);
    const userDoc = await userDocRef.get();
    if (userDoc.exists) {
        const oid = (await db.collection(databaseConstants.user).doc(uid).get()).data().oid;
        return (await db.collection(databaseConstants.organization).doc(oid).get()).data();
    }else{
        throw new Error("user does not belong to any organization")
    }
}

module.exports = {
    createNewOrg,
    updateOrg,
    getOrganization
}