export interface Config {
  filesystems: FileSystems;
}

export interface FileSystems {
  default: string;
  disks: Disk[];
}

export interface Disk {
  driver: string;
  type: string;
  root: string;

  // FTP
  host?: string;
  user?: string;
  password?: string;
  port?: number;
  secure?: boolean;

  // AWS
  key?: string;
  secret?: string;
  region?: string;
  bucket?: string;
}
