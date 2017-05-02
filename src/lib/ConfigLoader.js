import CsonLoader from './CsonLoader';
import JsonLoader from './JsonLoader';
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
     * @param debug
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
        debug = false
    }) {
        this.config = {
            type,
            envName,
            environment,
            environments,
            dir,
            file,
            filePrefix,
            isFolderStructure,
            debug,
        }
    }

    /**
     * Return default environment name. Basicaly last from the list.
     *
     * @returns {string}
     * @private
     */
    get _defaultEnvironment() {
        const { environments } = this.config;

        return environments[environments.length - 1];
    }

    /**
     * Return current environment name based on config or ENV variable
     *
     * @returns {string}
     * @private
     */
    get _currentEnvironment() {
        if (this.config.environment) {
            return this.config.environment;
        }

        const nodeEnvName = process.env[this.config.envName];

        if (nodeEnvName) {
            return nodeEnvName;
        }

        return this._defaultEnvironment;
    }

    get _fileName() {
        if (this.config.file) {
            return this.config.file;
        }

        return this.config.filePrefix + '.' + this._fileExt;
    }

    get _fileExt() {
        switch (this.config.type) {
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

        if (this.config.isFolderStructure) {
            config = this._loadConfigFromDir(this.config.dir);
        } else {
            const file = this.config.dir + '/./' + this._fileName;
            config = this._loadConfigFromFile(file);
            config = this._getEnvironmentConfig(config);
        }

        return config;
    }

    _loadConfigFromDir(dirPath) {
        let config = {};

        for (let envName of this.config.environments) {
            let file = dirPath + '/./' + this.config.filePrefix + '.' + envName + '.' + this._fileExt;

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
        switch (this.config.type) {
            case 'cson':
                return new CsonLoader(file);
                break;
            case 'json':
                return new JsonLoader(file);
                break;
            default:
                throw new TypeError('Wrong config type.');
                break;
        }
    }


    _getEnvironmentConfig(rawConfig) {
        let envConfig = {};

        for (let envName of this.config.environments) {
            envConfig = _.merge(envConfig, rawConfig[envName]);

            if (envName == this._currentEnvironment) {
                break;
            }
        }

        return envConfig;
    }
}

export default ConfigLoader;