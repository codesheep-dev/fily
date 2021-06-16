const fs = require('fs');
const path = require('path');

const DEFAULT_CONFIG_FILE_NAME = 'fily.config.js';

function getConfigPath() {
    return path.join(process.cwd(), DEFAULT_CONFIG_FILE_NAME);
}

function hasConfigFile() {
    try {
        fs.statSync(getConfigPath());

        return true;
    } catch (error) {
        throw new Error('No config file is found. Make sure to create a "fily.config.js" file in your root folder.');
    }
}

module.exports = {
    async getConfigFile() {
        if (hasConfigFile()) {
            const config = await Promise.resolve(require(getConfigPath()));
    
            if (!config || config === {}) {
                throw new Error('Config file configuration is incorrect. Make sure to provide an adequate configuration.');
            }
    
            return config;
        }
    },
};