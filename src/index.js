import ConfigLoader from './lib/ConfigLoader';

export default (config = {}) => {
    return new ConfigLoader(config);
}