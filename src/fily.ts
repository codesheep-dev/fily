import { S3_ACL_TYPES } from './enums/s3-acl-types';
import { DISK_TYPES } from './enums/disk-types';
import * as storage from './store/storage';

module.exports = {
  ...storage,
  DISK_TYPES,
  S3_ACL_TYPES,
};
