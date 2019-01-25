import * as yaml from 'yaml';

import AbstractFileLoader from './AbstractFileLoader';

export default class YamlLoader extends AbstractFileLoader {

    protected parseConfig(config: string): object {
        return yaml.parse(config);
    }
}