module.exports = class Data {
    constructor(did, bodyTemperature, faceMask, covidIdentification, isComplete, timestamp,oid){
        this.did = did // string - required 
        this.bodyTemperature = bodyTemperature // float - required
        this.faceMask = faceMask // boolean - required 
        this.covidIdentification = covidIdentification // Object - required 
        this.isComplete = isComplete // boolean - required
        this.timestamp = timestamp // Date - required
        this.oid = oid // string - required
    }    
}
