const log = require('../log');
const loggerOptions = require('../options');

const plain = options => {
  options = loggerOptions(options);
  const { message, tab } = options;

  options.output = `${tab}${message}`;
  
  return log(options);
};

module.exports = plain;
