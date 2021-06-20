import { ExpressFileUploadFile } from './../models/express-file-upload-file.model';
import { Disk } from './../models/config.model';
import { createReadStream } from 'fs';
import { Readable } from 'stream';
import { connect } from '../utils/ftp';

/**
 * Store a file with FTP
 *
 * @param file: ExpressFileUploadFile
 * @param filename: string
 * @param disk: Disk
 * @return Promise<string|void>
 */
export async function storeFtp(file: ExpressFileUploadFile, filename: string, disk: Disk): Promise<string | void> {
  return new Promise(async (resolve, reject) => {
    try {
      let stream: Readable;

      if (file.tempFilePath !== '') {
        stream = createReadStream(file.tempFilePath);
      } else if (!!file.data) {
        stream = Readable.from(file.data);
      } else {
        return reject(new Error('The provided file does not support Express File Upload.'));
      }

      const ftp = await connect(disk);
      await ftp.ensureDir(disk.root);
      await ftp.uploadFrom(stream, `${disk.root}/${filename}`);

      ftp.close();

      resolve(file?.md5);
    } catch (error: any) {
      reject(new Error(`Something went wrong storing the file with FTP on disk "${disk.driver}": ${error}`));
    }
  });
}

/**
 * Destroy a file with Ftp
 *
 * @param path: string
 * @param disk: Disk
 * @return Promise<void>
 */
export async function destroyFtp(path: string, disk: Disk): Promise<void> {
  try {
    const ftp = await connect(disk);
    await ftp.remove(path, false);

    ftp.close();
  } catch (error: any) {
    throw new Error(`Something went wrong destroying the file with FTP on disk "${disk.driver}": ${error}`);
  }
}
