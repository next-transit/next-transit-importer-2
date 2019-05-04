const timer = require('../timer');

const timeEnd = label => {
  const ms = timer.timeEnd(label);
  return timer.format(ms);
};

module.exports = timeEnd;
