import CsonLoader from './CsonLoader';
import JsonLoader from './JsonLoader';
import dotenv from 'dotenv';
import _ from 'lodash';
import fs from 'fs';

class ConfigLoader {
    constructor(config) {
        this._initConfig(config);
        return this._getConfig();
    }

    /**
     * Initialize config from object with parameters.
     *
     * @param type
     * @param envName
     * @param environment
     * @param environments
     * @param dir
     * @param file
     * @param filePrefix
     * @param isFolderStructure
     * @param envFilePath
     * @param inject
     * @private
     */
    _initConfig({
        type = 'cson',
        envName = 'NODE_ENV',
        environment,
        environments = [
            'production',
            'test',
            'development',
            'localhost'
        ],
        dir = process.cwd(),
        file,
        filePrefix = 'config',
        isFolderStructure = false,
        envFilePath,
        inject = {}
    }) {
        this._config = {
            type,
            envName,
            environment,
            environments,
            dir,
            file,
            filePrefix,
            isFolderStructure,
            envFilePath,
            inject
        }
    }

    /**
     * Return default environment name. Basicaly last from the list.
     *
     * @returns {string}
     * @private
     */
    get _defaultEnvironment() {
        const { environments } = this._config;

        return environments[environments.length - 1];
    }

    /**
     * Return current environment name based on config or ENV variable
     *
     * @returns {string}
     * @private
     */
    get _currentEnvironment() {
        if (this._config.environment) {
            return this._config.environment;
        }

        const nodeEnvName = process.env[this._config.envName];

        if (nodeEnvName) {
            return nodeEnvName;
        }

        return this._defaultEnvironment;
    }

    get _fileName() {
        if (this._config.file) {
            return this._config.file;
        }

        return this._config.filePrefix + '.' + this._fileExt;
    }

    get _fileExt() {
        switch (this._config.type) {
            case 'cson':
                return 'cson';
                break;
            case 'json':
                return 'json';
                break;
        }

        throw new TypeError('Wrong config type.');
    }



    /**
     * Load config for current environment.
     *
     * @returns {*}
     * @private
     */
    _getConfig() {
        let config = null;

        this._loadEnvFile();

        if (this._config.isFolderStructure) {
            config = this._loadConfigFromDir(this._config.dir);
        } else {
            const file = this._config.dir + '/./' + this._fileName;
            config = this._loadConfigFromFile(file);
            config = this._getEnvironmentConfig(config);
        }

        return config;
    }

    _loadEnvFile() {
        let envConfig = {};

        if (this._config.envFilePath) {
            envConfig.path = this._config.envFilePath
        }

        dotenv.config(envConfig);
    }

    _loadConfigFromDir(dirPath) {
        let config = {};

        for (let envName of this._config.environments) {
            let file = dirPath + '/./' + this._config.filePrefix + '.' + envName + '.' + this._fileExt;

            if (!fs.existsSync(file)) {
                continue;
            }

            config = _.merge(config, this._loadConfigFromFile(file));

            if (envName == this._currentEnvironment) {
                break;
            }
        }

        return config;
    }

    /**
     * Return config object from config files.
     *
     * @param file
     * @returns {*}
     * @private
     */
    _loadConfigFromFile(file) {
        switch (this._config.type) {
            case 'cson':
                return new CsonLoader(file, this._config.inject);
                break;
            case 'json':
                return new JsonLoader(file, this._config.inject);
                break;
            default:
                throw new TypeError('Wrong config type.');
                break;
        }
    }


    _getEnvironmentConfig(rawConfig) {
        let envConfig = {};

        for (let envName of this._config.environments) {
            envConfig = _.merge(envConfig, rawConfig[envName]);

            if (envName == this._currentEnvironment) {
                break;
            }
        }

        return envConfig;
    }
}

export default ConfigLoader;