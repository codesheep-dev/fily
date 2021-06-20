import { Disk } from './../models/config.model';
import { join } from 'path';
import { checkExistingDiskRootFolder } from '../utils/filesystem';
import { rename, existsSync, unlinkSync } from 'fs';
import { ExpressFileUploadFile } from '../models/express-file-upload-file.model';

/**
 * Store a file locally
 *
 * @param file: ExpressFileUploadFile
 * @param filename: string
 * @param disk: Disk
 * @return string|null
 */
export function storeLocal(file: ExpressFileUploadFile, filename: string, disk: Disk): string | null {
  try {
    const destination = join(process.cwd(), disk.root);

    checkExistingDiskRootFolder(destination);

    if (file.tempFilePath !== '') {
      rename(file.tempFilePath, destination, (error: any) => {
        if (error) throw new Error(`Something went wrong: ${error}`);

        return file?.md5;
      });
    } else if (!!file.mv) {
      file.mv(join(destination, filename), (error: any) => {
        if (error) throw new Error(`Error moving the file to the disk: ${error}`);

        return file?.md5;
      });
    } else {
      throw new Error('The provided file does not support Express File Upload.');
    }
  } catch (error: any) {
    throw new Error(`Something went wrong storing the file locally: ${error}`);
  }

  return null;
}

/**
 * Destroy a file locally
 *
 * @param path: string
 * @param disk: Disk
 * @return void
 */
export function destroyLocal(path: string, disk: Disk): void {
  try {
    if (!existsSync(path)) {
      throw new Error(`The provided path ${path} does not exist!`);
    }

    unlinkSync(path);
  } catch (error: any) {
    throw new Error(`Something went wrong destroying the file locally: ${error}`);
  }
}
