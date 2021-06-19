import { Disk } from './../models/config.model';
import { Options } from './../models/options.model';
import { DISK_TYPES } from '../enums/disk-types';
import { getDisk, getDefaultDiskDriver } from '../utils/disks';
import { storeLocal } from './local';
import { storeFtp } from './ftp';
import { ExpressFileUploadFile } from '../models/express-file-upload-file.model';
import { storeAws } from './aws';

/**
 * Store a file and return the hash
 *
 * @param file: ExpressFileUploadFile
 * @param options: Options
 * @return Promise<any>
 */
export function store(file: ExpressFileUploadFile, options: Options): Promise<any> {
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
          return resolve(await storeFtp(file, filename, disk));
        case DISK_TYPES.AWS:
          return resolve(await storeAws(file, filename, disk));
        default:
          return reject(new Error(`The provided disk type ${disk.type} is not supported.`));
      }
    } catch (error) {
      return reject(error);
    }
  });
}
