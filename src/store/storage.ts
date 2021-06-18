import { Disk } from './../models/config.model';
import { Options } from './../models/options.model';
import { DISK_TYPES } from './../utils/disk-types';
import { getDisk, getDefaultDiskDriver } from '../utils/disks';
import { storeLocal, storeLocalWithExpressFileUpload } from './local';
import { storeFtp } from './ftp';

/**
 * Store a file
 *
 * @param file: File
 * @param options: Options
 * @return Promise<void>
 */
export async function store(file: File, options: Options): Promise<void> {
  try {
    const filename: string = options && options?.filename ? options?.filename : file.name;
    const driver: string = options && options?.driver ? options?.driver : await getDefaultDiskDriver();
    const disk: Disk | undefined = await getDisk(driver);

    if (!disk) {
      throw new Error(`No disk could be found for the driver ${driver}.`);
    }

    switch (disk.type) {
      case DISK_TYPES.LOCAL:
        if (options?.useExpressFileUpload === true) {
          storeLocalWithExpressFileUpload(
            file as File & { tmpPath: string; mv: (path: string, cb: (error: any) => void) => void },
            filename,
            disk,
          );
        } else {
          await storeLocal(file as File & { path: string }, filename, disk);
        }

        break;
      case DISK_TYPES.FTP:
        await storeFtp(file, filename, disk);

        break;
      default:
        throw new Error(`The provided disk type ${disk.type} is not supported.`);
    }

    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
}
