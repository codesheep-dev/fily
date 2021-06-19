import { Disk } from './../models/config.model';
import { Options } from './../models/options.model';
import { DISK_TYPES } from './../utils/disk-types';
import { getDisk, getDefaultDiskDriver } from '../utils/disks';
import { storeLocal } from './local';
import { storeFtp } from './ftp';
import { ExpressFileUploadFile } from '../models/express-file-upload-file.model';

/**
 * Store a file and return the hash
 *
 * @param file: ExpressFileUploadFile
 * @param options: Options
 * @return Promise<string|void|null>
 */
export async function store(file: ExpressFileUploadFile, options: Options): Promise<string | void | null> {
  try {
    const filename: string = options && options?.filename ? options?.filename : file.name;
    const driver: string = options && options?.driver ? options?.driver : await getDefaultDiskDriver();
    const disk: Disk | undefined = await getDisk(driver);

    if (!disk) {
      throw new Error(`No disk could be found for the driver ${driver}.`);
    }

    let hash = null;

    switch (disk.type) {
      case DISK_TYPES.LOCAL:
        hash = storeLocal(file, filename, disk);
        break;
      case DISK_TYPES.FTP:
        hash = await storeFtp(file, filename, disk);
        break;
      default:
        throw new Error(`The provided disk type ${disk.type} is not supported.`);
    }

    return Promise.resolve(hash);
  } catch (error) {
    return Promise.reject(error);
  }
}
