import { Disk, Config } from './../models/config.model';
import { getConfigFile } from '../env/config';

export async function getDisk(driver: string): Promise<Disk | undefined> {
  const config: Config = await getConfigFile();

  if (!config) {
    throw new Error('No filesystems configuration was found in the config file.');
  }

  const disks: Disk[] = config.filesystems.disks;

  if (!disks || disks.length < 1) {
    throw new Error('No disks was detected in the config file. Make sure to provide at least one disk.');
  }

  return disks.find((disk: Disk) => disk.driver === driver);
}

export async function getDefaultDiskDriver(): Promise<string> {
  const config: Config = await getConfigFile();

  if (!config.filesystems) {
    throw new Error('No filesystems configuration was found in the config file.');
  }

  const disks: Disk[] = config.filesystems.disks;
  const defaultDisk: string = config.filesystems.default;

  if (!disks || !defaultDisk) {
    throw new Error(
      'No default disk was detected in the config file. Make sure to provide a default disk or provide one in the methods.',
    );
  }

  const disk = disks.find((item: Disk) => item.driver === defaultDisk);

  if (!disk) {
    throw new Error(
      `A default disk was defined as ${defaultDisk}, but no such disk could be found in the "disks" array.`,
    );
  }

  return disk.driver;
}
