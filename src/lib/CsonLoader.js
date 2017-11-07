import cson from 'cson';

import AbstractFileLoader from './AbstractFileLoader';

class CsonLoader extends AbstractFileLoader {
    _parseConfig(config) {
        return cson.parse(config)
    }
}

export default CsonLoader;