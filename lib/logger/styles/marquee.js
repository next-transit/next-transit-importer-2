const log = require('../log');
const loggerOptions = require('../options');

const marquee = options => {
  options = loggerOptions(options);
  const { message, char, tab } = options;
  const middle = `${char} ${message} ${char}`;
  const border = middle
    .replace(/\[([\s\w\.]+)\]/g, '$1')
    .split('')
    .map(c => char)
    .join('');

  const output = `
${tab}${border}
${tab}${middle}
${tab}${border}
`;

  options.output = output;

  return log(options);
};

module.exports = marquee;
