module.exports = class DeviceStatus {
    constructor(id, status, timestamp) {
        this.id = id;
        this.status = status;
        this.timestamp = timestamp;
    }

    toJson() {
        return {
            "status": this.status,
            "timestamp": this.timestamp
        }
    }
}