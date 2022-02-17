# Introduction

## Naming Conventions
### Use noun for Resourses

### Use verb for Function name
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

## Api naming convention
Link: https://restfulapi.net/resource-naming/
Read this before doing anything please
## Folder Convention

### Api folder 
Api folder contains API endpoint for all the project, you should define your endpoint in there

### Config folder 

### Models folder
Models folder contains your database schema or your data model 
### Services folder
Services folder contains business logic

