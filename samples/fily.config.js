/**
 * Optionally you can use the "dotenv" package here to use ENV values in this configuration.
 */
require('dotenv').config();

/**
 * The configuration
 */
module.exports = {
  filesystems: {
    /**
     * The default disk to use, will be used if no disk is provided
     */
    default: 'local',

    /**
     * All of the disks. Available types are "local" and "ftp".
     */
    disks: [
      {
        // The driver, c.q. the name of this disk.
        driver: 'local',
        // The type of the disk, how to store files with this disk.
        type: 'local',
        // The root directory where files will be placed.
        root: '/storage',
      },
      {
        driver: 'my-ftp-server',
        type: 'ftp',
        root: 'files',
        // The URL of the Ftp server.
        url: process.env.MY_FTP_SERVER_URL,
        // The user of the Ftp server.
        user: process.env.MY_FTP_SERVER_USER,
        // The password of the Ftp server.
        password: process.env.MY_FTP_SERVER_PASSWORD,
        // The port of the Ftp server.
        port: 443,
      },
    ],
  },
};

module.exports = {
  filesystems: {
    default: 'uploads',
    disks: [
      {
        driver: 'uploads',
        type: 'local',
        root: '/uploads',
      },
    ],
  },
};
