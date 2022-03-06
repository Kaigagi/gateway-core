module.exports = class Device {
    constructor(id,accessKey,oid,name,location,hardwareInfo,tags){
        this.id = id; // string required
        this.accessKey = accessKey; // string required
        this.oid = oid; // string required
        this.name = name; // string required
        this.location = location; // string
        this.hardwareInfo = hardwareInfo; // json
        this.tags = tags; // array<string> 
    }
}
