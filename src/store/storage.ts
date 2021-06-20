import { Disk } from './../models/config.model';
import { Options } from './../models/options.model';
import { DISK_TYPES } from '../enums/disk-types';
import { getDisk, getDefaultDiskDriver } from '../utils/disks';
import { destroyLocal, storeLocal } from './local';
import { destroyFtp, storeFtp } from './ftp';
import { ExpressFileUploadFile } from '../models/express-file-upload-file.model';
import { destroyAws, storeAws } from './aws';
import { join, normalize } from 'path';

/**
 * Store a file
 *
 * @param file: ExpressFileUploadFile
 * @param options: Options
 * @return Promise<any>
 */
export function store(file: ExpressFileUploadFile, options?: Options): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const filename: string = options && options?.filename ? options?.filename : file.name;
      const driver: string = options && options?.driver ? options?.driver : await getDefaultDiskDriver();
      const disk: Disk | undefined = await getDisk(driver);

      if (!disk) {
        return reject(new Error(`No disk could be found for the driver ${driver}.`));
      }

      switch (disk.type) {
        case DISK_TYPES.LOCAL:
          return resolve(storeLocal(file, filename, disk));
        case DISK_TYPES.FTP:
          return resolve(storeFtp(file, filename, disk));
        case DISK_TYPES.AWS:
          return resolve(storeAws(file, filename, disk));
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
export function destroy(filename: string, options?: Options): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const driver: string = options && options?.driver ? options?.driver : await getDefaultDiskDriver();
      const disk: Disk | undefined = await getDisk(driver);

      if (!disk) {
        return reject(new Error(`No disk could be found for the driver ${driver}.`));
      }

      const fullPath = normalize(join(disk.root ? disk.root : '', filename));

      switch (disk.type) {
        case DISK_TYPES.LOCAL:
          return resolve(destroyLocal(fullPath, disk));
        case DISK_TYPES.FTP:
          return resolve(await destroyFtp(fullPath, disk));
        case DISK_TYPES.AWS:
          return resolve(await destroyAws(fullPath, disk));
        default:
          return reject(new Error(`The provided disk type ${disk.type} is not supported.`));
      }
    } catch (error: any) {
      return reject(error);
    }
  });
}
