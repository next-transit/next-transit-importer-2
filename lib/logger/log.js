const colors = require('colors');

colors.setTheme({
  data: 'magenta',
  primary: 'grey',
  title: 'cyan'
});

let lastOutput = '';

const log = options => {
  let output = options.output;

  const style = options.style || 'grey';
  const dataStyle = options.dataStyle || 'data';

  output = output.replace(/\[([\s\w\.]+)\]/g, (match, p1) => p1[dataStyle]);
  output = colors[style](output);

  // Always clear "current" line in case the previous log was a persist write
  // Helps prevent characters from the previous write appearing on a shorter line
  const clearLine = lastOutput.split('').map(c => ' ').join('');
  process.stdout.write(`${clearLine}\r`);

  if (options.persist) {
    process.stdout.write(`${output}\r`);
  } else {
    console.log(output);
  }

  lastOutput = output;

  return output;
};

module.exports = log;
