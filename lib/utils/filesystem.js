const fs = require('fs');

module.exports = {
    async checkExistingDiskRootFolder(path) {
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true });
        }
    },
};