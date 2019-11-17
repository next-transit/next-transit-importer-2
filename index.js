#!/usr/bin/env node
const colors = require('colors');
const program = require('commander');

const commands = require('./lib/commands');
const importer = require('./lib/import');

module.exports = () => {
  program
    .version('2.0.0', '--version')
    .usage('[options]');

  program
    .command('download')
    .description('Download raw agency GTFS files')
    .option('-a, --agency [agency]', 'Agency slug', /^(septa|trimet)$/)
    .action(commands.download);

  program
    .command('unzip')
    .description('Unzip a downloaded GTFS archive')
    .option('-a, --agency [agency]', 'Agency slug', /^(septa|trimet)$/)
    .action(commands.unpack);

  program
    .command('import')
    .description('Parse and import GTFS data to database')
    .option('-a, --agency [agency]', 'Agency slug', /^(septa|trimet)$/)
    .option('-d, --dry', 'Dry run. Parses files, but does not save to database')
    .option('-t, --type <type>', 'Specific type of data to import (e.g. routes)')
    .option('-v, --verbose', 'Verbose mode')
    .action(() => {
      importer.start(program);
    })

  program
    .command('export')
    .description('Export current database to S3')
    .option('-l, --local', 'Create a backup only. Do not export to S3')
    .option('-u, --upload', 'Upload only.')
    .action(commands.export);

  program
    .command('publish')
    .description('Send new data to production environment')
    .option('-c, --create', 'Create new database only')
    .option('-r, --restore <archive>', 'Restore backup to a production database')
    .option('-p, --promote', 'Promote database to be used by production')
    .option('-x, --delete', 'Remove a production database')

  program.parse(process.argv);

  if (!program.args.length) {
    program.help(text => colors.red(text));
    process.exit(0);
    return;
  }
};
