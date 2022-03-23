![Language](https://img.shields.io/github/languages/top/codesheep-dev/fily?style=for-the-badge)
![Size](https://img.shields.io/bundlephobia/min/fily?style=for-the-badge)
![Downloads](https://img.shields.io/npm/dt/fily?style=for-the-badge)
![Issues](https://img.shields.io/github/issues/webbster-dev/fily?style=for-the-badge)
![License](https://img.shields.io/github/license/webbster-dev/fily?style=for-the-badge)
![Version](https://img.shields.io/npm/v/fily?style=for-the-badge)
![Node](https://img.shields.io/node/v/fily?style=for-the-badge)
![Commit](https://img.shields.io/github/last-commit/webbster-dev/fily?style=for-the-badge)
# Intro
Ever wanted to simply store a file in your NodeJS project? I know I do, and it's not that straightforward as you think.

Fily aims to simplify the process of storing a file - whether you want to put that file on the filesystem, send it over FTP or in an S3 Bucket - all while keeping the process simple and flexible.

## Installation

```bash
// With NPM
$ npm i fily

// With Yarn
$ yarn add fily
```

## CLI Installation

Fily comes with a CLI tool to quickly init a new configuration file.

```bash
// With NPM
$ npm i -g fily

// With Yarn
$ yarn global add fily
```

## CLI Usage

The Fily CLI has one command available.

```bash
Usage: fily [options] [command]

Options:
  -h, --help      display help for command

Commands:
  init            initialize a new boilerplate configuration file for Fily
  help [command]  display help for command
```

## Setup

To start using Fily, execute the following in a terminal:

```bash
$ fily init
```

This will add a new `fily.config.js` file in your current directory. Contents of the file:

```js
/**
 * The configuration
 */
module.exports = {
  filesystems: {
    /**
     * The default disk to use, will be used if no disk is provided in Fily methods
     */
    default: 'local',

    /**
     * All of the disks (example). Available types are "local", "ftp" and "s3".
     */
    disks: [
      {
        // The driver, c.q. the name of this disk.
        driver: 'local',
        // The type of the disk, how it should store files.
        type: 'local',
        // The root directory where files will be placed. Don't put a slash before the path, as this will result in errors when trying to remove the file with `destroy()`.
        root: 'storage',
      },
      {
        driver: 'my-ftp-server',
        type: 'ftp',
        root: 'files',
        // The URL of the Ftp server.
        host: process.env.MY_FTP_SERVER_URL,
        // The user of the Ftp server.
        user: process.env.MY_FTP_SERVER_USER,
        // The password of the Ftp server.
        password: process.env.MY_FTP_SERVER_PASSWORD,
        // The port of the Ftp server.
        port: 443,
      },
      {
        driver: 'aws-s3',
        type: 's3',
        // The key for AWS S3.
        key: process.env.AWS_KEY,
        // The secret for AWS S3.
        secret: process.env.AWS_SECRET,
        // The region for AWS S3.
        region: process.env.AWS_REGION,
        // The bucket for AWS S3.
        bucket: process.env.AWS_BUCKET,
      },
    ],
  },
};
```

## Usage

Fily works with `disks`, inspired by the [Laravel Framework](https://laravel.com/).

Every disk has it's own configuration. This is handy if you have multiple places where you want to store files, for example a logo on a FTP server but avatar uploads on your local filesystem. Also it makes things easy to configure and change, and keeps it in one place. A default disk can also be specified in `fily.config.js`.

Let's say you want to store files in a local folder `/uploads`. Your configuration file would then look like this:

```js
// Optionally use the enum
const { DISK_TYPES } = require("fily");

module.exports = {
  filesystems: {
    default: 'uploads',
    disks: [
      {
        driver: 'uploads',
        type:  DISK_TYPES.local, // Or just 'local'
        root: 'uploads',
      },
    ],
  },
};
```

Or, if you want to store something on an S3 Bucket:
```js
// Optionally use the enum
const { DISK_TYPES } = require("fily");

module.exports = {
  filesystems: {
    default: 's3',
    disks: [
      {
        driver: 's3',
        type: DISK_TYPES.S3, // Or just 's3'
        // The key for AWS S3. You can omit this if you've already got ENV value AWS_ACCESS_KEY_ID set.
        key: process.env.AWS_KEY,
        // The secret for AWS S3. You can omit this if you've already got ENV value AWS_SECRET_ACCESS_KEY set.
        secret: process.env.AWS_SECRET,
        bucket: process.env.AWS_BUCKET,
      },
    ],
  },
};
```

Fily will use the `default` disk specified here if no explicit disk is provided.

Example usage in Express:

```js
const fily = require('fily');

router.post('/file', authorize, async (req, res) => {
  const { file } = req.files;

  // With async/await
  await fily.store(file);

  // With .then/.catch
  fily
    .store(file)
    .then(() => {
      // Do stuff
    })
    .catch((error) => {
      // Do stuff with error
    });

  // Delete a file - insert the full filename with the extension e.g. 'sample.pdf'
  await fily.destroy(file.name);
});
```

Options can also be passed to the method.

```js
fily.store(file, {
  filename: 'my-file.pdf',
  driver: 'my-other-disk',
});
```

## Options

The following options are available:

| Option     | Description                                                 |
| ---------- | ----------------------------------------------------------- |
| `filename` | Set an explicit filename for the file. This is ignored when using the method `destroy()`.                     |
| `driver`   | The driver to use. Should be specified in `fily.config.js`. |

## Methods

The following methods are available:
| Method | Description |
| ------ | ----------- |
| `store(file, options)` | Store a file. Return value is the `hash` from `express-fileupload` File. If `s3` is used as a disk type, return value will be the `Location` property in the bucket. |
| `destroy(filename, options)` | Destroy a file. Return value is void. |

## Types

The following disk types are available:
| Type | Description |
| ------ | ----------- |
| `local` | Stores files in the local filesystem. |
| `ftp` | Stores files on a remote FTP server. |
| `s3` | Stores files on an AWS S3 Bucket. |
