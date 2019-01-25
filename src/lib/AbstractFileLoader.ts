import * as fs from 'fs'

export default abstract class AbstractFileLoader {
    protected readonly injected: { [key: string]: any };
    protected readonly filePath: string;

    public constructor(filePath: string, injected: { [key: string]: any } = {}) {
        if (new.target === AbstractFileLoader) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }

        this.filePath = filePath;
        this.injected = injected;
    }

    public loadConfig(): object {
        return this.parseConfig(this.injectVariables(fs.readFileSync(this.filePath, "utf-8")));
    }

    protected injectVariables(configString: string): string {
        const injectedKeys = Object.keys(this.injected);
        const injectedValues = injectedKeys.map((key) => {
            return this.injected[key];
        });

        return configString.replace(/#\{(.+)\}/g, (match: string, code: string) => {
            const base = new Function(...injectedKeys, "return " + code)(...injectedValues);

            if (typeof base === 'string') {
                return '"' + base + '"';
            }

            if (!base) {
                return null;
            }

            return base;
        })
    }

    protected abstract parseConfig(config: string): object;
}