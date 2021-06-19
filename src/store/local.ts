import { Disk } from './../models/config.model';
import { join } from 'path';
import { checkExistingDiskRootFolder } from '../utils/filesystem';
import { rename } from 'fs';
import { ExpressFileUploadFile } from '../models/express-file-upload-file.model';

/**
 * Store a file locally using express-fileupload package
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
  } catch (error) {
    throw new Error(`Something went wrong storing the file locally: ${error}`);
  }

  return null;
}
