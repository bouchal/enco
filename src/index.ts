import ConfigLoader, {Options} from './lib/ConfigLoader';

export default (config: Options = {}): any => {
    return new ConfigLoader(config).loadConfig();
};