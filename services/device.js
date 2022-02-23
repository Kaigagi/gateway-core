async function getAllDevicesInformation(){
    const snapshot= await db.collection('device').get()
    const devicesInformation = new Array()

    snapshot.forEach((doc) => {
        devicesInformation.push(doc.data())
    })

    return devicesInformation
}


