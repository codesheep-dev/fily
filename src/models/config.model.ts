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
  host?: string;
  user?: string;
  password?: string;
  port?: number;
  secure?: boolean;
}
