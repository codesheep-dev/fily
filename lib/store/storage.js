const DISK_TYPES = require('../utils/disk-types');
const { getDisk, getDefaultDiskDriver } = require('../utils/disks');
const { storeLocal } = require('./local');

/**
 * Store a file
 * 
 * @param {File} file 
 * @param {object} options 
 */
async function store(file, options) {
    try {
        const filename = options && options['filename'] ? options['filename'] : file.name;
        const driver = options && options['driver'] ? options['driver'] : await getDefaultDiskDriver();
        const disk = await getDisk(driver);

        if (!disk) {
            throw new Error(`No disk could be found for the driver ${driver}.`);
        }

        switch (disk.type) {
            case DISK_TYPES.LOCAL:
                storeLocal(file, filename, disk);
                break;
            case DISK_TYPES.FTP:
                // storeFtp(file, filename, disk);
                break;
            default:
                throw new Error(`The provided disk type ${type} is not supported.`);
        }

        return Promise.resolve();
    } catch (error) {
        return Promise.reject(error);
    }
}

module.exports = {
    store,
};