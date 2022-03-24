import { S3Disk } from './../models/config.model';
import { S3 } from 'aws-sdk';
import { Readable } from 'stream';
import { connect } from '../utils/s3';

/**
 * Upload a file with AWS S3. Returns the location of the uploaded file.
 *
 * @param file: Readable
 * @param filename: string
 * @param disk: Disk
 * @returns string
 */
export async function storeS3(file: Readable, filename: string, disk: S3Disk): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const s3: S3 = connect(disk);
      const params: S3.Types.PutObjectRequest = {
        Bucket: disk.bucket as string,
        Key: filename,
        Body: file,
      };

      if (disk.acl) {
        params.ACL = disk.acl;
      }

      s3.upload(params, (error: any, data: any) => {
        if (error) return reject(error);

        return resolve(data.Location);
      });
    } catch (error: any) {
      return reject(new Error(`Could not store file with S3: ${error}`));
    }
  });
}

/**
 * Destroy a file (object) on AWS. Returns the "Deletemarker" on AWS.
 *
 * @param path: string
 * @param disk: Disk
 * @returns Promise<string>
 */
export async function destroyS3(path: string, disk: S3Disk): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const s3: S3 = connect(disk);

      s3.deleteObject(
        {
          Bucket: disk.bucket as string,
          Key: path,
        },
        (error: any, data: any) => {
          if (error) return reject(error);

          return resolve(data.DeleteMarker);
        },
      );
    } catch (error: any) {
      return reject(new Error(`Could not destroy file with S3: ${error}`));
    }
  });
}
