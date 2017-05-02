# environmentconfig

## Introduction

A node.js package for most simple config data loading based on app enviroment from CSON or JSON file(s).

This method for loading configs I use now for few years and I think it's time to create
some united package.

So there it is.

## Goals

To load config object from files or folder almost withnout configuration.
Of course with enviroments inheritance.

## Instalation

```
npm install environmentconfig
```

## Examples

### Single file config

At firt we need to create CSON config file

```
production:
    host: '10.0.0.1'
    port: 80

development:
    port: 8080
    
localhost:
    host: '127.0.0.1'
```

#### Load without config

In this case default configuration is the last one. So `localhost`. 

```javascript
var configLoader = require('environmentconfig');
var config = configLoader();
```

result:

```javascript
{
    host: '127.0.0.1'
    port: 8080
}
```

#### Change environment with ENV variable

Default ENV variable name is NODE_ENV

```javascript
// index.js
var configLoader = require('environmentconfig');
var config = configLoader();
```

run command:
```
NODE_ENV=development node index.js
```

result:

```javascript
{
    host: '127.0.0.1'
    port: 8080
}
```

#### Change ENV variable name

You can change ENV variable name in config via parameter `envName`

```javascript
// index.js
var configLoader = require('environmentconfig');
var config = configLoader({
    envName: 'ENVIRONMENT'
});
```

run command:
```
ENVIRONMENT=production node index.js
```

result:

```javascript
{
    host: '10.0.0.1'
    port: 80
}
```


### Multiple environments config file

At first we need to create few files

```
// config/config.production.json
{
    "host": "10.0.0.1",
    "port": "80"
}
```
```
// config/config.development.json
{
    "port": "8080"
}
```
```
// config/config.localhost.json
{
    "host": "127.0.0.1"
}
```
```javascript
// config/config.development.json
var configLoader = require('environmentconfig');
var config = configLoader({
    type: 'json',
    dir: './config',
    isFolderStructure: true
});
```

run command:
```
node index.js
```

result:

```javascript
{
    host: '127.0.0.1'
    port: 8080
}
```

### Own environments

Default environments is production, test, development, localhost. But you can define your own:

```
var configLoader = require('environmentconfig');
var config = configLoader({
    environments: [
            'prod',
            'stage',
            'dev'
        ]
});
```

In this case default environment will be `dev` because it's last one.

Dependencies works like waterfall. If you select `stage`,
it will inherit everything from `prod` config and rewrite or append its own values.