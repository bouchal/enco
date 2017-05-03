import ConfigLoader from './lib/ConfigLoader';

module.exports = (config = {}) => {
    return new ConfigLoader(config);
};