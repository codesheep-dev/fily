import { DestroyOptions } from './../models/destroy-options.model';
import { Disk, S3Disk, FTPDisk, LocalDisk } from './../models/config.model';
import { StoreOptions } from '../models/store-options.model';
import { DISK_TYPES } from '../enums/disk-types';
import { getDisk, getDefaultDiskDriver } from '../utils/disks';
import { destroyLocal, storeLocal } from './local';
import { destroyFtp, storeFtp } from './ftp';
import { destroyS3, storeS3 } from './s3';
import { Readable } from 'stream';

/**
 * Store a file
 *
 * @param file: Readable
 * @param options: Options
 * @return Promise<any>
 */
export function store(file: Readable, options: StoreOptions): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      if (!options.filename) {
        throw new Error('You must provide a filename when storing.');
      }

      const driver: string = options && options?.driver ? options?.driver : await getDefaultDiskDriver();
      const disk: Disk | undefined = await getDisk(driver);

      if (!disk) {
        return reject(new Error(`No disk could be found for the driver ${driver}.`));
      }

      switch (disk.type) {
        case DISK_TYPES.LOCAL:
          return resolve(storeLocal(file, options.filename, disk as LocalDisk));
        case DISK_TYPES.FTP:
          return resolve(storeFtp(file, options.filename, disk as FTPDisk));
        case DISK_TYPES.S3:
          return resolve(storeS3(file, options.filename, disk as S3Disk));
        default:
          return reject(new Error(`The provided disk type ${disk.type} is not supported.`));
      }
    } catch (error: any) {
      return reject(error);
    }
  });
}

/**
 * Destroy a file
 *
 * @param filename: string
 * @param options: Options
 * @return Promise<any>
 */
export function destroy(filename: string, options?: DestroyOptions): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const driver: string = options && options?.driver ? options?.driver : await getDefaultDiskDriver();
      const disk: Disk | undefined = await getDisk(driver);

      if (!disk) {
        return reject(new Error(`No disk could be found for the driver ${driver}.`));
      }

      // const fullPath = normalize(join(disk.root ? disk.root : '', filename));

      switch (disk.type) {
        case DISK_TYPES.LOCAL:
          return resolve(destroyLocal(filename, disk as LocalDisk));
        case DISK_TYPES.FTP:
          return resolve(await destroyFtp(filename, disk as FTPDisk));
        case DISK_TYPES.S3:
          return resolve(await destroyS3(filename, disk as S3Disk));
        default:
          return reject(new Error(`The provided disk type ${disk.type} is not supported.`));
      }
    } catch (error: any) {
      return reject(error);
    }
  });
}

// export function get(filename: string, options?: Options): Promise<any> {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const driver: string = options && options?.driver ? options?.driver : await getDefaultDiskDriver();
//       const disk: Disk | undefined = await getDisk(driver);

//       if (!disk) {
//         return reject(new Error(`No disk could be found for the driver ${driver}.`));
//       }

//       const fullPath = normalize(join(disk.root ? disk.root : '', filename));

//       switch (disk.type) {
//         case DISK_TYPES.LOCAL:
//           return resolve(getLocal(fullPath));
//         case DISK_TYPES.FTP:
//           return resolve(await getFtp(fullPath, disk));
//         case DISK_TYPES.AWS:
//           return resolve(await getAws(fullPath, disk));
//         default:
//           return reject(new Error(`The provided disk type ${disk.type} is not supported.`));
//       }
//     } catch (error: any) {
//       return reject(error);
//     }
//   });
// }
