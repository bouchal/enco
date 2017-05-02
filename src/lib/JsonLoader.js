import json from 'jsonfile';

import AbstractFileLoader from './AbstractFileLoader';

class CsonLoader extends AbstractFileLoader {
    _loadConfig(file) {
        return json.readFileSync(file)
    }
}

export default CsonLoader;