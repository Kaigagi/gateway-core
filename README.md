# Introduction
Gateway Backend, this README.md is trying to guide you how to deploy and how to acctualy use this codebase
it will try to help you understand the codebase and its convention as quick as posisble (Hopefully). This Gatewaw Backend is using Nodejs, Express and Firestore

Terraform to provision compute engine on GCP (Use can skip this part if you are deploy it on your local machine or private cloud, private server)

We are trying to modularize backend components for you guys, to deploy and change the components if necessary (-_-) but right now it's not

# How to use
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

## Setup let's encrypt for https (Must have domain) 
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
- Services folder contains business logic

