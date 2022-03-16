# Introduction
Gateway Backend, this README.md is trying to guide you how to deploy and how to acctualy use this codebase
it will try to help you understand the codebase and its convention as quick as posisble (Hopefully). This Gateway Backend is using Nodejs, Express and Firestore

Terraform to provision compute engine on GCP (Use can skip this part if you are deploy it on your local machine or private cloud, private server)

We are trying to modularize backend components for you guys, to deploy and change the components if necessary (-_-) but right now it's not
# Table of Content
* [For Developer](#for-developer)
    * [APIs That Ready to use](#apis-that-ready-to-use)
* [How to use](#how-to-use)
# For Developers 
## APIs That ready to use
* [Device APIs](#device-apis)
* [Data APIs](#data-apis)
* [Organization APIs](#organization-apis)

Currently the prefix or version is **/api/v1**
## Device APIs
`GET` 
return an json that contains array of Device that belong to an organzation
* **URL**: ${prefix}/device
* **URL Params**: 
* **Headers**: api-x-key, token
* **Body**:
``` javascript
{
    "uid": //string, this will be generated through ours middleware
}
```
* **Successful Response**:
     * **Code:** 200 OK <br />
    **Content:** `{ message : "OK" }`
* **Error Response**:
     * **Code:** 403 FORBIDDEN <br />
    **Content:** `{ message : "invalid api-x-key" }`

    OR
    * **Code:** 406 NOT ACCEPTANCE <br />
    **Content:** `{ message : "Invalid JWT Token" }`


`POST` Create new device from Web 
* **URL**: ${prefix}/device
* **URL Params**: did-new
* **Headers**: api-x-key
* **Body**:
 ```javascript
{
    "name": ,//string, require,
    "location": ,//string, require,
    "tags": //array<string>
}
  ```

* **Successful Response**:
    * **Code:** 200 OK <br />
    **Content:** `{ message : "OK" }`
* **Error Response**:
    * **Code:** 403 FORBIDDEN <br />
    **Content:** `{ message : "invalid api-x-key" }`
    
    OR
    * **Code:** 404 NOT FOUND <br />
    **Content:** `{ message : "missing <fields>" }`

    OR

     * **Code:** 404 NOT FOUND <br />
    **Content:** `{ message : "device tags invalid (must be an array)" }`

    OR
    * **Code:** 405 METHOD NOT ALLOWED <br />
    **Content:** `{ message : "user does not belong to any org" }`

    OR
    * **Code:** 406 NOT ACCEPTANCE <br />
    **Content:** `{ message : "Invalid JWT Token" }`

`POST` Create Device information
* **URL**: ${prefix}/device
* **URL Params**: did-new
* **Headers**: api-x-key, access-key
* **Body**:
 ```javascript
{
    "id": ,//string require,
    "hardwareInfo": //json
}
  ```

* **Successful Response**:
    * **Code:** 200 OK <br />
    **Content:** 
```javascript
{
    "id": ,//,//string
    "accessKey": ,//,//string
    "apiKey":,//,//string
    "oid": ,//string,
    "entpoint": ,//string,
    "mqttUserName":,//string,
    "mqttPassword":,//string 
}
```
* **Error Response**:
    * **Code:** 403 FORBIDDEN <br />
    **Content:** `{ message : "invalid api-x-key" }`
    
    OR
    * **Code:** 404 NOT FOUND <br />
    **Content:** `{ message : "missing deviceId" }`

    OR
    * **Code:** 406 NOT ACCEPTANCE <br />
    **Content:** `{ message : "Invalid JWT Token" }`

    OR

     * **Code:** 409 <br />
    **Content:** `{ message : "already has hardwareInfo" }`



`PUT`
* **URL**: ${prefix}/device/did-new
* **URL Params**:
* **Headers**: api-x-key, token
* **Body**:
 ```javascript
{
  "did": ,//string, require,
  "name": ,//string, require,
  "location": ,//string, require,
  "tags": array<,//string>
}
  ```

* **Successful Response**:
     * **Code:** 200 OK <br />
    **Content:** `{ message : "OK" }` 
* **Error Response**:
   * **Code:** 403 FORBIDDEN <br />
    **Content:** `{ message : "invalid api-x-key" }`
    
    OR
    * **Code:** 404 NOT FOUND <br />
    **Content:** `{ message : "missing <fields>" }`

    OR

     * **Code:** 404 NOT FOUND <br />
    **Content:** `{ message : "device tags invalid (must be an array)" }`

    OR
    * **Code:** 405 METHOD NOT ALLOWED <br />
    **Content:** `{ message : "user does not belong to any org" }`

    OR
    * **Code:** 406 NOT ACCEPTANCE <br />
    **Content:** `{ message : "Invalid JWT Token" }`


`DELETE` Delete a device
* **URL**: ${prefix}/device
* **URL Params**: did
* **Headers**: api-x-key, token
* **Successful Response**:
    * **Code:** 200 OK <br />
    **Content:** `{ message : "OK" }` 
* **Error Response**:
    * **Code:** 403 FORBIDDEN <br />
    **Content:** `{ message : "invalid api-x-key" }`

    OR
    * **Code:** 404 NOT FOUND <br />
    **Content:** `{ message : "missing <fields>" }`

    OR
     * **Code:** 406 NOT ACCEPTANCE <br />
    **Content:** `{ message : "Invalid JWT Token" }`

## Data APIs

`POST` Send device
* **URL**: ${prefix}/data
* **URL Params**: 
* **Headers**: access-key, api-x-key
* **Body**:
```javascript
{
    "did": ,//string, require,
    "bodyTemperature": ,//float, require,
    "faceMask": ,//bool, require,
    "covidIdentification":{
        "dentificationMethod": //QR|RFID,
        "identificationData": ,//123
    } ,//json, require,
    "isComplete": ,//bool, require,
}
```
* **Successful Response**:
    * **Code:** 200 OK <br />
    **Content:** `{ message : "OK" }` 
* **Error Response**:
    * **Code:** 403 FORBIDDEN <br />
    **Content:** `{ message : "invalid api-x-key" }`

    OR
    * **Code:** 403 FORBIDDEN <br />
    **Content:** `{ message : "invalid access-key" }`

    OR
    * **Code:** 404 FORBIDDEN <br />
    **Content:** `{ message : "wrong datatype or missing field" }`
## Organization APIs
`GET`

* **URL**: ${prefix}/organization
* **URL Params**: 
* **Headers**: token
* **Successful Response**:
* **Error Response**:
    * **Code:** 404 NOT FOUND <br />
    **Content:** `{ error : "User doesn't exist" }`

`GET`

* **URL**: ${prefix}/organization
* **URL Params**: oid
* **Headers**: 
* **Successful Response**:
* **Error Response**:
    * **Code:** 404 NOT FOUND <br />
    **Content:** `{ error : "User doesn't exist" }`

`POST`

* **URL**: ${prefix}/organization
* **URL Params**: 
* **Headers**: 
* **Body**:
* **Successful Response**:
* **Error Response**:
    * **Code:** 404 NOT FOUND <br />
    **Content:** `{ error : "User doesn't exist" }`

`PUT`

* **URL**: ${prefix}/organization
* **URL Params**: 
* **Headers**: 
* **Body**:
* **Successful Response**:
* **Error Response**:
    * **Code:** 404 NOT FOUND <br />
    **Content:** `{ error : "User doesn't exist" }`

### 
# How to use
This is the way - Mando
## First you need to clone this project to your local machine or your server 


```git clone https://github.com/GDSC-HSU/gateway-core.git``` 

After you clone it, you have to create file .env with this folloling value: 

``` cd gateway-core ``` 
```
EXPRESS_PORT=3000
BROKER_PORT=1833
API_VERSION=v1
SERVICE_ACCOUNT_PATH=<firebase_your_service_account>
NODE_ENV= 
```
    
```npm install ```

 ```nodemon app.js ```

## If Deploy on GCP
Set **NODE_ENV=production**

set credential: applicationDefault() in app.js to use service account that you attach to the compute engine that you create but first make sure you create **firebase service account**
.If you don't set to production it will find the local service account json file on you local repository read this to setup service account https://firebase.google.com/docs/admin/setup

also if you set it to production will automatic enable https, will search for key and cert for ssl, so if you want to run http only then you shouldn't enable this. I'm sorry we know sometimes getting ssl cert is difficult but you could use let's encrypt to obtain ssl cert (Hopefuly when you trying to setup https for your own server you will learn many cool things)

## Setup let's encrypt for https (Must have domain name)
## Running using Docker 
```docker pull <docker-registry-url>:<tag> ```\
```docker build .```\
```docker run --rm -p 3000:3000 1883:1883 gateway-core:<tag> ```\
## Using terraform to provision for the Google Cloud
``` cd tf```\
``` terraform init```\
``` terraform plan```\
``` terraform apply```

## Naming Conventions
### Use noun for Resourses
Example:
```js
let userInfo
```
### Use verb for Function name

```js
function getUserInfo()
```
### Use lowerCamelCase for variables, properties and function names

Variables, properties and function names should use `lowerCamelCase`.  They
should also be descriptive. Single character variables and uncommon
abbreviations should generally be avoided.

*Right:*

```js
var adminUser = db.query('SELECT * FROM users ...');
```

*Wrong:*

```js
var admin_user = db.query('SELECT * FROM users ...');
```

### Use UpperCamelCase for class names

Class names should be capitalized using `UpperCamelCase`.

*Right:*

```js
function BankAccount() {
}
```

*Wrong:*

```js
function bank_Account() {
}
```

# Api naming convention
Link: https://restfulapi.net/resource-naming/
Read this before doing anything please
# Folder Convention

## Folder/File name convention

- Folder/File name using snake_case

    **Example:**
    ``` 
    hello_world.js
    ```
## Api folder 
- Api folder contains API endpoint for all the project, you should define your endpoint in there

## Config folder 

* **constants/database_constants.js**

    File contains constants path collection in database.

* **constants/header_constants.js**

    File contains constants name of header key

## Models folder
- Models folder contains your database schema or your data model 
## Services folder
- Services folder contains business logic which is our code to procressing logic stuffs


