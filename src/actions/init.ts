import { join } from 'path';
import { copyFileSync } from 'fs';
import { configFileShouldNotExist } from '../env/config';

function copyConfigFile(): void {
  const source = join(__dirname, '../../samples/fily.config.js');
  const destination = join(process.cwd(), 'fily.config.js');

  copyFileSync(source, destination);
}

export function init(): void {
  configFileShouldNotExist();
  copyConfigFile();
}
