import { FTPDisk } from './../models/config.model';
import { Readable } from 'stream';
import { connect } from '../utils/ftp';

/**
 * Store a file with FTP
 *
 * @param file: Readable
 * @param filename: string
 * @param disk: Disk
 * @return Promise<string|void>
 */
export async function storeFtp(
  file: Readable,
  filename: string,
  disk: FTPDisk & { driver?: string },
): Promise<string | void> {
  return new Promise(async (resolve, reject) => {
    try {
      const ftp = await connect(disk);
      await ftp.ensureDir(disk.root);
      await ftp.uploadFrom(file, `${disk.root}/${filename}`);

      ftp.close();

      resolve();
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
export async function destroyFtp(path: string, disk: FTPDisk & { driver?: string }): Promise<void> {
  try {
    const ftp = await connect(disk);
    await ftp.remove(path, false);

    ftp.close();
  } catch (error: any) {
    throw new Error(`Something went wrong destroying the file with FTP on disk "${disk.driver}": ${error}`);
  }
}
