import { Config } from "./../src/models/config.model";
const DISK_TYPES = require("../lib/utils/disk-types");
require("dotenv").config();

export const config: Config = {
  filesystems: {
    default: "local",
    disks: [
      {
        driver: "local",
        type: DISK_TYPES.LOCAL,
        root: "/storage",
      },
      {
        driver: "my-ftp-server",
        type: DISK_TYPES.FTP,
        root: "files",
        url: process.env.MY_FTP_SERVER_URL,
        user: process.env.MY_FTP_SERVER_USER,
        password: process.env.MY_FTP_SERVER_PASSWORD,
        port: 443,
      },
    ],
  },
};
