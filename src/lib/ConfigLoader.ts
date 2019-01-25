import CsonLoader from './CsonLoader';
import JsonLoader from './JsonLoader';
import * as dotenv from 'dotenv';
import * as _ from 'lodash';
import * as fs from 'fs';
import YamlLoader from "./YamlLoader";

export interface Options {
    type?: string;
    envName?: string;
    environment?: string;
    environments?: string[];
    dir?: string;
    file?: string;
    filePrefix?: string;
    isFolderStructure?: boolean;
    envFilePath?: string;
    inject?: object;
}

class ConfigLoader {
    protected readonly options: Options = {
        type: 'yaml',
        envName: 'NODE_ENV',
        environments: [
            'production',
            'test',
            'development',
            'localhost'
        ],
        dir: process.cwd(),
        filePrefix: 'config',
        isFolderStructure: false,
        inject: {}
    };

    constructor(options: Options = {}) {
        this.options = {
            ...this.options,
            ...options
        };
    }

    /**
     * Return default environment name. Basicaly last from the list.
     */
    protected get defaultEnvironment(): string {
        const { environments } = this.options;

        if (!environments) {
            throw new Error('Environment names must be defined.');
        }

        return environments[environments.length - 1];
    }

    /**
     * Return current environment name based on config or ENV variable
     *
     * @returns {string}
     * @private
     */
    protected get currentEnvironment() {
        if (this.options.environment) {
            return this.options.environment;
        }

        if (!this.options.envName) {
            throw new Error('Environment or environment name property must defined.');
        }

        const nodeEnvName = process.env[this.options.envName];

        if (nodeEnvName) {
            return nodeEnvName;
        }

        return this.defaultEnvironment;
    }

    protected get fileName() {
        if (this.options.file) {
            return this.options.file;
        }

        return this.options.filePrefix + '.' + this.fileExt;
    }

    protected get fileExt() {
        switch (this.options.type) {
            case 'cson':
                return 'cson';
            case 'json':
                return 'json';
            case 'yaml':
            case 'yml':
                return 'yml';
        }

        throw new TypeError('Wrong config type.');
    }



    /**
     * Load config for current environment.
     *
     * @returns {*}
     * @private
     */
    public loadConfig(): object {
        let config = null;

        this.loadEnvFile();

        if (this.options.isFolderStructure) {
            if (!this.options.dir) {
                throw new Error('Dir name must be specified when isFolderStructure is true.');
            }

            config = this.loadConfigFromDir(this.options.dir);
        } else {
            const file = this.options.dir + '/./' + this.fileName;
            config = this.loadConfigFromFile(file);
            config = this.getEnvironmentConfig(config);
        }

        return config;
    }

    protected loadEnvFile() {
        let envConfig: any = {};

        if (this.options.envFilePath) {
            envConfig.path = this.options.envFilePath
        }

        dotenv.config(envConfig);
    }

    protected loadConfigFromDir(dirPath: string) {
        let config = {};

        if (!this.options.environments || !this.options.environments.length) {
            throw new Error('You must define at least one environment name.');
        }

        for (let envName of this.options.environments) {
            let file = dirPath + '/./' + this.options.filePrefix + '.' + envName + '.' + this.fileExt;

            if (!fs.existsSync(file)) {
                continue;
            }

            config = _.merge(config, this.loadConfigFromFile(file));

            if (envName == this.currentEnvironment) {
                break;
            }
        }

        return config;
    }

    /**
     * Return config object from config files.
     */
    protected loadConfigFromFile(file: string): object {
        switch (this.options.type) {
            case 'cson':
                return new CsonLoader(file, this.options.inject).loadConfig();
            case 'json':
                return new JsonLoader(file, this.options.inject).loadConfig();
            case 'yaml':
            case 'yml':
                return new YamlLoader(file, this.options.inject).loadConfig();
            default:
                throw new TypeError('Wrong config type.');
        }
    }


    protected getEnvironmentConfig(rawConfig: any): object {
        let envConfig = {};

        if (!this.options.environments || !this.options.environments.length) {
            throw new Error('You must define at least one environment name.');
        }

        for (let envName of this.options.environments) {
            envConfig = _.merge(envConfig, rawConfig[envName]);

            if (envName == this.currentEnvironment) {
                break;
            }
        }

        return envConfig;
    }
}

export default ConfigLoader;