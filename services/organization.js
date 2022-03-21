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

async function createNewOrg(uid, name, id, imageName,hasImage) {
    try {
        console.log(uid,id)
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

            const orgEndPoint = process.env.ENDPOINT+"/org/"+id;
            let orgImageUrl = undefined;
            if (hasImage) {
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
                await bucket.upload('./upload/'+imageName,{
                    metadata: metadata,
                    destination: id,
                }).catch((error)=>{
                    console.log(error.message)
                });
                // this will be replace later with an atualy image of the org
                orgImageUrl = "https://firebasestorage.googleapis.com/v0/b/gdsc-gateway.appspot.com/o/"+id+"?alt=media&token="+downloadToken; 
                
                // delete image on server
                fs.unlink('./upload/'+imageName, (error)=>{
                    if (error) {
                        console.log(error)
                    }
                });
            }
    
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
    } catch (error) {
        console.log(error.message);
        throw new Error(error.message)
    }
}

async function updateOrg(uid, name, imageName,hasImage) {
    try {
        const userDocRef = db.collection(databaseConstants.user).doc(uid);
        const userDoc = await userDocRef.get();

        if (!userDoc.exists) {
            throw new Error("org does not exists")
        }

        const id = userDoc.data().oid;

        const orgDocRef = db.collection(databaseConstants.organization).doc(id);
        const orgDoc = await orgDocRef.get();
        // check if exists
        if (orgDoc.exists) {
            let orgImageUrl;
            if (hasImage) {
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
                await bucket.upload('./upload/'+imageName,{
                    metadata: metadata,
                    destination: id,
                });

                //new image url
                orgImageUrl = "https://firebasestorage.googleapis.com/v0/b/gdsc-gateway.appspot.com/o/"+id+"?alt=media&token="+downloadToken;

                // delete image on server
                fs.unlink('./upload/'+imageName, (error)=>{
                    console.log(error);
                });

                await db.collection(databaseConstants.organization).doc(id).update({
                    name: name,
                    imageUrl: orgImageUrl
                })
            }else{
                await db.collection(databaseConstants.organization).doc(id).update({
                    name: name,
                })
            }    
        }else{
            throw new Error("org does not exists")
        }
    } catch (error) {
        console.log(error.message);
        throw new Error(error.message);
    }
}

async function getOrganization(uid) {
    try {
        const userDocRef = db.collection(databaseConstants.user).doc(uid);
        const userDoc = await userDocRef.get();
        if (userDoc.exists) {
            const oid = userDoc.data().oid;
            return (await db.collection(databaseConstants.organization).doc(oid).get()).data();
        }else{
            throw new Error("user does not belong to any organization")
        }
    } catch (error) {
        console.log(error.message);
        throw new Error(error.message);
    }
}

async function getOrganizationForDevice(oid) {
    try {
        const orgDocRef = db.collection(databaseConstants.organization).doc(oid);
        const orgDoc = await orgDocRef.get();

        if (orgDoc.exists) {
            const orgData = orgDoc.data();
            let result = {
                name: orgData.name,
                imageUrl: orgData.imageUrl,
                oid: orgData.id,
            }

            return result;
        }else{
            throw new Error("oid does not exists");
        }
    } catch (error) {
        console.log(error.message);
        throw new Error(error.message);
    }
}


module.exports = {
    createNewOrg,
    updateOrg,
    getOrganization,
    getOrganizationForDevice,
}
