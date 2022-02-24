module.exports = class DeviceStatus {
    constructor(id, status, timestamp) {
        this.id = id;
        this.status = status;
        this.timeSpan = timestamp;
    }
}