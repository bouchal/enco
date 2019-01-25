import * as cson from 'cson';

import AbstractFileLoader from './AbstractFileLoader';

export default class JsonLoader extends AbstractFileLoader {

    protected parseConfig(config: string): object {
        return cson.parseJSONString(config);
    }
}