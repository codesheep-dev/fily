import { existsSync, mkdirSync } from 'fs';

export async function checkExistingDiskRootFolder(path: string): Promise<void> {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }
}
