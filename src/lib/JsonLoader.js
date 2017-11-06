import json from 'jsonfile';

import AbstractFileLoader from './AbstractFileLoader';

class JsonLoader extends AbstractFileLoader {
    _loadConfig(file) {
        return json.readFileSync(file)
    }
}

export default JsonLoader;