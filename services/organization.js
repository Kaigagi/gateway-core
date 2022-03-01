const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore()
const Organization = require("../models/organization")
const { databaseConstants } = require("../config/constants/database_constants.js");

async function createNewOrg(name, id) {
    // this will be replace later with an atualy image of the org
    const orgImageUrl = "https://www.hoasen.edu.vn/wp-content/uploads/2022/02/HSU.jpg"; 
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