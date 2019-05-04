const colors = require('colors');
const program = require('commander');

const importer = require('./lib');

program
  .version('2.0.0', '--version')
  .usage('[options]')
  .option('-a, --agency [agency]', 'Agency slug', /^(septa|trimet)$/)
  .option('-d, --dry', 'Dry run. Parses files, but does not save to database')
  .option('-t, --type [type]', 'Specific type of data to import (e.g. routes)')
  .option('-v, --verbose', 'Verbose mode')
  .parse(process.argv);

if(!program.agency) {
  program.help(text => colors.red(text));
  process.exit(0);
}

importer.start(program);
