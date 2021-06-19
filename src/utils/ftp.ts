import { Disk } from '../models/config.model';
import { Client } from 'basic-ftp';

/**
 * Connect to a remote FTP server and return the instance.
 *
 * @param disk: Disk
 * @returns Promise<Client>
 */
export async function connect(disk: Disk): Promise<Client> {
  const client = new Client();

  try {
    await client.access({
      host: disk.host,
      user: disk.user,
      password: disk.password,
      secure: disk.secure || true,
    });

    return client;
  } catch (error: any) {
    throw new Error(`Could not connect to FTP server: ${error}}`);
  }
}
