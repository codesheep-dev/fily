#!/usr/bin/env node

import { init } from '../actions/init';
import { Command } from 'commander';
const cli = new Command();

function handleError(error: Error) {
  console.error(`ERROR: ${error.message}`, error.stack); // tslint:disable-line
  process.exit(1);
}

cli
  .command('init')
  .description('initialize a new boilerplate configuration file for Fily')
  .action(() => {
    try {
      init();
      console.log('Initialization successful. Please edit the generated "fily.config.js" file'); // tslint:disable-line
    } catch (error: any) {
      handleError(error);
    }
  });

cli.parse(process.argv);
