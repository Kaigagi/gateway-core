module.exports = class Organization {
    constructor(id, name, imageUrl, endpoint, apiKey, usernameBroker, passwordBroker){
        this.id = id; // string required
        this.name = name; // string required
        this.imageUrl = imageUrl;
        this.endpoint = endpoint; // string required
        this.apiKey = apiKey; // string requird
        this.usernameBroker = usernameBroker; // string required
        this.passwordBroker = passwordBroker; // string required
    }
}
