# Introduction
Gateway backend
# How to use
You had to create file .env with this folloling value:\
EXPRESS_PORT=3000\
BROKER_PORT=1833\
API_VERSION=v1\
SERVICE_ACCOUNT_PATH=<firebase_your_service_account>

- First

    ```git clone https://github.com/GDSC-HSU/gateway-core.git```

- Second run this command 

    ``` npm install ```
- Third is to 

    ``` nodemon app.js ```

## Running using Docker 
```docker pull <docker-registry-url>:<tag> ```
```docker build .```
```docker run --rm -p 3000:3000 1883:1883 gateway-core:<tag> ```
# Naming Conventions
## Use noun for Resourses
Example:
```js
let userInfo
```
## Use verb for Function name

```js
function getUserInfo()
```
## Use lowerCamelCase for variables, properties and function names

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

## Use UpperCamelCase for class names

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

