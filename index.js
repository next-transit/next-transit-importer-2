#!/usr/bin/env node
const colors = require('colors');
const program = require('commander');

const commands = require('./lib/commands');

async function run() {
  let executedCommand;

  const handleCommand = commandName => async cmd => {
    executedCommand = cmd;
    await commands[commandName](cmd);
  }

  program
    .version('2.0.0', '--version')
    .usage('[options]');

  program
    .command('download')
    .description('Download raw agency GTFS files')
    .requiredOption('-a, --agency <agency>', 'Agency slug', /^(septa|trimet)$/)
    .action(handleCommand('download'));

  program
    .command('unzip')
    .description('Unzip a downloaded GTFS archive')
    .requiredOption('-a, --agency <agency>', 'Agency slug', /^(septa|trimet)$/)
    .action(handleCommand('unpack'));

  program
    .command('import')
    .description('Parse and import GTFS data to database')
    .requiredOption('-a, --agency <agency>', 'Agency slug', /^(septa|trimet)$/)
    .option('-p, --path <path>', 'Unzipped files directory')
    .option('-d, --dry', 'Dry run. Parses files, but does not save to database')
    .option('-t, --type <type>', 'Specific type of data to import (e.g. routes)')
    .option('-v, --verbose', 'Verbose mode')
    .action(handleCommand('import'))

  program
    .command('export')
    .description('Export current database to S3')
    .option('-l, --local', 'Create a backup only. Do not export to S3')
    .option('-u, --upload', 'Upload only.')
    .action(handleCommand('export'));

  program
    .command('publish')
    .description('Send new data to production environment')
    .option('-c, --create', 'Create new database only')
    .option('-r, --restore [archive]', 'Restore backup to a production database')
    .option('-p, --promote', 'Promote database to be used by production')
    .option('-x, --delete', 'Remove a production database')
    .action(handleCommand('publish'));

  program
    .command('all')
    .description('Run download, unzip, and import')
    .requiredOption('-a, --agency <agency>', 'Agency slug', /^(septa|trimet)$/)
    .action(async cmd => {
      executedCommand = cmd;
      await commands.download(cmd);
      await commands.unpack(cmd);
      await commands.import(cmd);
    });

  try {
    await program.parseAsync(process.argv);
  } catch(e) {
    console.error(e);
    process.exit(1);
    return;
  }

  if (!executedCommand) {
    program.help(text => colors.red(text));
  }

  process.exit(0);
  return;
};

module.exports = run;
