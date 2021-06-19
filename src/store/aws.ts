import { S3 } from 'aws-sdk';
import { createReadStream } from 'fs';
import { Readable } from 'stream';
import { Disk } from '../models/config.model';
import { ExpressFileUploadFile } from '../models/express-file-upload-file.model';
import { connect } from '../utils/aws';

/**
 * Upload a file with AWS S3. Returns the location of the uploaded file.
 *
 * @param file: ExpressFileUploadFile
 * @param filename: string
 * @param disk: Disk
 * @returns string
 */
export async function storeAws(file: ExpressFileUploadFile, filename: string, disk: Disk): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const s3: S3 = connect(disk);
      let stream: Readable;

      if (file.tempFilePath !== '') {
        stream = createReadStream(file.tempFilePath);
      } else if (!!file.data) {
        stream = Readable.from(file.data);
      } else {
        return reject(new Error('The provided file does not support Express File Upload.'));
      }

      s3.upload(
        {
          Bucket: disk.bucket as string,
          Key: filename,
          Body: stream,
        },
        (error: any, data: any) => {
          if (error) return reject(error);

          return resolve(data.Location);
        },
      );
    } catch (error: any) {
      return reject(new Error(`Could not store file with AWS: ${error}`));
    }
  });
}
