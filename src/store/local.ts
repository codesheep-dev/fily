import { LocalDisk } from './../models/config.model';
import { join, normalize } from 'path';
import { checkExistingDiskRootFolder } from '../utils/filesystem';
import { existsSync, unlinkSync, createWriteStream } from 'fs';
import { Readable } from 'stream';

/**
 * Store a file locally
 *
 * @param file: Readable
 * @param filename: string
 * @param disk: Disk
 * @return string|null
 */
export function storeLocal(file: Readable, filename: string, disk: LocalDisk): string | null {
  try {
    const destination = join(process.cwd(), disk.root);
    checkExistingDiskRootFolder(destination);

    const stream = createWriteStream(join(destination, filename));
    file.pipe(stream);
  } catch (error: any) {
    throw new Error(`Something went wrong storing the file locally: ${error}`);
  }

  return null;
}

/**
 * Destroy a file locally
 *
 * @param path: string
 * @return void
 */
export function destroyLocal(path: string, disk: LocalDisk): void {
  try {
    const normalizedPath = normalize(join(disk.root, path));

    if (!existsSync(normalizedPath)) {
      throw new Error(`The provided path ${normalizedPath} does not exist!`);
    }

    unlinkSync(normalizedPath);
  } catch (error: any) {
    throw new Error(`Something went wrong destroying the file locally: ${error}`);
  }
}

// export function getLocal(path: string): void {
//   try {
//     if (!existsSync(path)) {
//       throw new Error(`The provided path ${path} does not exist!`);
//     }

//     const file = readFileSync(path);
//   } catch (error: any) {
//     throw new Error(`Something went wrong getting the file locally: ${error}`);
//   }
// }
