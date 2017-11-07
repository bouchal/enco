import cson from 'cson';

import AbstractFileLoader from './AbstractFileLoader';

class JsonLoader extends AbstractFileLoader {
    _parseConfig(config) {
        return cson.parseJSONString(config)
    }
}

export default JsonLoader;