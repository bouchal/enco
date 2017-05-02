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
        throw new TypeError("Must override method _loadConfig");
    }
}

export default AbstractFileLoader;