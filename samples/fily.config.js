require('dotenv').config();
const DISK_TYPES = require("../lib/utils/disk-types");

const config = {
    filesystems: {
        default: 'local',
        disks: [
            {
                driver: 'local',
                type: DISK_TYPES.LOCAL,
                root: '/storage',
            },
            {
                driver: 'aws',
                type: DISK_TYPES.FTP,
                root: 'files',
                url: 'https://some-ftp-server.com',
                user: env('AWS_USER'),
                password: env('AWS_PASSWORD'),
                port: 443,
            },
        ],
    },
};

module.exports = config;