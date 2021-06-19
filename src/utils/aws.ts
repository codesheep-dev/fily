import AWS, { S3 } from 'aws-sdk';
import { Disk } from '../models/config.model';
import { format } from 'date-fns';

/**
 * Create a new AWS S3 instance and return it.
 *
 * @param disk: Disk
 * @returns S3
 */
export function connect(disk: Disk): S3 {
  AWS.config.update({
    region: disk.region,
    secretAccessKey: disk.secret,
    accessKeyId: disk.key,
  });

  const s3 = new S3({ apiVersion: format(new Date(), 'yyyy-MM-dd') });

  return s3;
}
