import * as cson from 'cson';

import AbstractFileLoader from './AbstractFileLoader';

export default class CsonLoader extends AbstractFileLoader {

    protected parseConfig(config: string): object {
        return cson.parse(config);
    }
}