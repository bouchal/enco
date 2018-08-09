import fs from 'fs'

class AbstractFileLoader {
    /**
     * @param {string} file
     * @param {object} injected
     * @returns {*}
     */
    constructor(file, injected = {}) {
        if (new.target === AbstractFileLoader) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }

        this._injected = injected;

        return this._loadConfig(file);
    }

    /**
     * @param {string} file
     * @private
     */
    _loadConfig(file) {
        return this._parseConfig(this._injectVariables(fs.readFileSync(file, "utf-8")));
    }

    /**
     *
     * @param config
     * @private
     */
    _injectVariables(config) {
        const injectedKeys = Object.keys(this._injected);
        const injectedValues = injectedKeys.map((key) => {
            return this._injected[key]
        });

        return config.replace(/#\{(.+)\}/g, (match, code) => {
            const base = new Function(injectedKeys, "return " + code)(...injectedValues);

            if (typeof base === 'string') {
                return '"' + base + '"';
            }

            if (!base) {
                return null;
            }

            return base;
        })
    }

    _parseConfig(config) {
        throw new TypeError("Must override method _parseConfig");
    }
}

export default AbstractFileLoader;