const log = require('../log');
const loggerOptions = require('../options');

const warning = options => {
  options = loggerOptions(options);
  const { message, tab } = options;

  const icon = '∵'.yellow;

  options.output = `${tab}${icon} ${message.blue}`;
  
  log(options);
};

module.exports = warning;
