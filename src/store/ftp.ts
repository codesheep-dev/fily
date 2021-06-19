import { ExpressFileUploadFile } from './../models/express-file-upload-file.model';
import { Disk } from './../models/config.model';
import { createReadStream } from 'fs';
import { Readable } from 'stream';
import { connect } from '../utils/ftp';
import * as md5 from 'md5';
import { streamToBuffer } from '../utils/streams';

/**
 * Store a file with FTP
 *
 * @param file: ExpressFileUploadFile
 * @param filename: string
 * @param disk: Disk
 * @return Promise<string|void>
 */
export async function storeFtp(file: ExpressFileUploadFile, filename: string, disk: Disk): Promise<string | void> {
  try {
    let stream: Readable;

    if (file.tempFilePath !== '') {
      stream = createReadStream(file.tempFilePath);
    } else if (!!file.data && !!file.data.data) {
      stream = Readable.from(file.data.data);
    } else {
      throw new Error('The provided file does not support Express File Upload.');
    }

    const ftp = await connect(disk);
    await ftp.ensureDir(disk.root);
    await ftp.uploadFrom(stream, `${disk.root}/${filename}`);

    ftp.close();

    return md5(await streamToBuffer(stream));
  } catch (error) {
    throw new Error(`Something went wrong storing the file with FTP on disk "${disk.driver}": ${error}`);
  }
}
