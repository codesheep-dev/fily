import { S3Disk } from './../models/config.model';
import AWS, { S3 } from 'aws-sdk';

/**
 * Create a new AWS S3 instance and return it.
 *
 * @param disk: Disk
 * @returns S3
 */
export function connect(disk: S3Disk): S3 {
  const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION } = process.env;

  if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
    if (!disk.secret || !disk.key)
      throw new Error(
        'No AWS credentials found! Please set them in your .env "AWS_ACCESS_KEY_ID" and "AWS_SECRET_ACCESS_KEY" or provide them in the disk configuration.',
      );

    AWS.config.update({
      secretAccessKey: disk.secret,
      accessKeyId: disk.key,
    });
  }

  AWS.config.update({
    region: AWS_REGION ?? disk.region,
  });

  const s3 = new S3();

  return s3;
}
