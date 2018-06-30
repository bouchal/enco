import fs from 'fs'

class AbstractFileLoader {
    /**
     * @param file
     * @returns {*}
     */
    constructor(file) {
        if (new.target === AbstractFileLoader) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }

        return this._loadConfig(file);
    }

    _loadConfig(file) {
        return this._parseConfig(this._injectVariables(fs.readFileSync(file, "utf-8")));
    }

    /**
     *
     * @param config
     * @private
     */
    _injectVariables(config) {
        return config.replace(/#\{(.+)\}/g, (match, code) => {
            const base = new Function("return " + code)();

            if (typeof base == 'string') {
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