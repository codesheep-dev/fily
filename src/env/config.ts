import { Config } from './../models/config.model';
import { statSync } from 'fs';
import { join } from 'path';

const DEFAULT_CONFIG_FILE_NAME = 'fily.config.js';

function getConfigPath(): string {
  return join(process.cwd(), DEFAULT_CONFIG_FILE_NAME);
}

function hasConfigFile(): boolean | void {
  try {
    statSync(getConfigPath());

    return true;
  } catch (error) {
    throw new Error('No config file is found. Make sure to create a "fily.config.js" file in your root folder.');
  }
}

export async function getConfigFile() {
  if (hasConfigFile()) {
    const config = await Promise.resolve(require(getConfigPath()));

    if (!config || config === {}) {
      throw new Error('Config file configuration is incorrect. Make sure to provide an adequate configuration.');
    }

    return config;
  }
}

export function configFileShouldNotExist(): void {
  const configPath: string = getConfigPath();
  const error = new Error(`Fily config file already exists: ${configPath}`);

  try {
    statSync(configPath);
    throw error;
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw error;
    }
  }
}
