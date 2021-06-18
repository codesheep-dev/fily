import { Disk } from './../models/config.model';
import { join } from 'path';
import { checkExistingDiskRootFolder } from '../utils/filesystem';
import { rename } from 'fs';

/**
 * Store a file locally using express-file-upload package
 *
 * @param file: File & { tmpPath: string, mv: (path: string, cb: (error: any) => void) => void }
 * @param filename: string
 * @param disk: Disk
 * @return void
 */
export function storeLocalWithExpressFileUpload(
  file: File & { tmpPath: string; mv: (path: string, cb: (error: any) => void) => void },
  filename: string,
  disk: Disk,
): void {
  try {
    const destination = join(process.cwd(), disk.root);

    checkExistingDiskRootFolder(destination);

    if (!!file.tmpPath && file.tmpPath !== '') {
      rename(file.tmpPath, destination, (error: any) => {
        if (error) throw new Error(`Something went wrong: ${error}`);
      });
    } else if (!!file.mv) {
      file.mv(join(destination, filename), (error: any) => {
        if (error) throw new Error(`Error moving the file to the disk: ${error}`);
      });
    } else {
      throw new Error('The provided file does not support Express File Upload. Did you mean to store it regularly?');
    }
  } catch (error) {
    throw new Error(`Something went wrong storing the file locally: ${error}`);
  }
}

/**
 * Store a file locally
 *
 * @param file: File
 * @param filename: string
 * @param disk: Disk
 * @return void
 */
export async function storeLocal(file: File & { path: string }, filename: string, disk: Disk): Promise<void> {
  try {
    if (!file.path) {
      throw new Error("This file does not have a 'path' property.");
    }

    const destination = join(process.cwd(), disk.root);

    checkExistingDiskRootFolder(destination);

    rename(file.path, destination, (error: any) => {
      if (error) throw new Error(`Something went wrong: ${error}`);
    });
  } catch (error) {
    throw new Error(`Something went wrong storing the file locally: ${error}`);
  }
}
