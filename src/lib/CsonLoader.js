import cson from 'cson';

import AbstractFileLoader from './AbstractFileLoader';

class CsonLoader extends AbstractFileLoader {
    _loadConfig(file) {
        return cson.load(file)
    }
}

export default CsonLoader;