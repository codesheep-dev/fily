const storage = require('./store/storage');
const DISK_TYPES = require('./utils/disk-types');

module.exports = {
    ...storage,
    DISK_TYPES,
};