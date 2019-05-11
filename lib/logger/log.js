const colors = require('colors');

const Writer = require('./writer');

colors.setTheme({
  data: 'magenta',
  primary: 'grey',
  title: 'cyan'
});

const writer = new Writer();

const log = options => {
  let output = options.output;

  const style = options.style || 'grey';
  const dataStyle = options.dataStyle || 'data';

  output = output.replace(/\[([\s\w\.]+)\]/g, (match, p1) => p1[dataStyle]);
  output = colors[style](output);

  if (options.label && !options.persist) {
    writer.clearStatic(options.label);
  } else if (options.persist) {
    writer.writeStatic(output, options.label);
  } else {
    writer.writeLine(output);
  }

  return output;
};

module.exports = log;
