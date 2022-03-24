export type Config = {
  filesystems: FileSystems;
};

export type FileSystems = {
  default: string;
  disks: Disk[];
};

export type Disk = {
  driver: string;
  type: string;
} & (FTPDisk | LocalDisk | S3Disk);

export type FTPDisk = {
  root: string;
  host: string;
  user: string;
  password: string;
  port: number;
  secure?: boolean;
};

export type LocalDisk = {
  root: string;
};

export type S3Disk = {
  key?: string;
  secret?: string;
  region?: string;
  bucket: string;
  acl?: string;
};
