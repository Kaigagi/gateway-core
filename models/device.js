module.exports = class Device {
    constructor(id, accessKey, name, location, hardwareInfo, tags){
        this.id = id // string
        this.accessKey = accessKey  // string 
        this.name = name    // string
        this.location = location    // string
        this.hardwareInfo = hardwareInfo // json
        this.tags = tags // array<string>
    }
}
