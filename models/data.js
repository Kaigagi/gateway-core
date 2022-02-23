module.exports = class Data {
    constructor(did, body_temperature, face_mask, covid_identification, is_complete, timestamp){
        this.did = did // string - required 
        this.body_temperature = body_temperature // float - required
        this.face_mask = face_mask // boolean - required 
        this.covid_identification = covid_identification // Object - required 
        this.is_complete = is_complete // boolean - required
        this.timestamp = timestamp // Date - required
    }    
}
