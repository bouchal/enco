# environmentconfig

## Introduction

A node.js package for most simple config data loading based on app environment from CSON or JSON file(s).

This method for loading configs I use now for few years and I think it's time to create
some united package.

So there it is.

## Goals

To load config object from files or folder almost withnout configuration.
Of course with environments inheritance.

## Instalation

```
npm install environmentconfig
```

## Examples

### Single file config

At first we need to create CSON config file

```
production:
    host: #{process.env.HOST}
    port: #{process.env.PORT}

development:
    port: 8080
    
localhost:
    host: '127.0.0.1'
    port: #{process.env.PORT || 3000}
```

Then you can create .env file with ENV variables

```
PORT=80
HOST="10.0.0.1"
```

#### Load without config definition

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

```javascript
// config/config.production.json
{
    "host": "10.0.0.1",
    "port": "80"
}
```
```javascript
// config/config.development.json
{
    "port": "8080"
}
```
```javascript
// config/config.localhost.json
{
    "host": "127.0.0.1"
}
```
```javascript
// index.js
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


## Config API

There is a list of configuration options for config loading

| Property | Description | Value | Default |
|----------|-------------|-------|---------|
| type | Type of config files  | `cson` or `json` | cson |
| envName | Witch ENV variable define environments name. It works only if property `environment` is not set | string | `NODE_ENV` |
| environment | For defining current environment name your own way | string | Last value of `environments` property |
| environments | Array of all app environments with waterfall inheritance | string array | `[ 'production', 'test', 'development', 'localhost' ]` |
| isFolderStructure | Define if configs are in multiple files | bool | `false` |
| dir | Path to folder with configs | string | Starting point of app (`process.cwd()`) |
| file | Define specific file what you want load, ignoring other options | string | `null` |
| filePrefix | If your config file name is not starting with `config` (`config.cson` or `config.production.cson`). You cant change it here. | string | `config` |
| envFilePath | If you have .env file on different path with different name | string | `null` |