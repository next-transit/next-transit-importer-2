const { statement } = require('../styles');

let lastPersist = '';

const persist = options => {
  lastPersist = statement({
    ...options,
    persist: true
  })
};

const progress = options => {
  const { count, length } = options;
  const percent = Math.ceil(count / length * 100 / 2);
  let chartLen = 50;
  let row = '';
  let i = 0;
  while(++i < chartLen) {
    row += percent > i ? '⌗' : ' ';
  }
  persist({
    ...options,
    message: `[${row}]`
  });
};

module.exports = {
  persist,
  progress,
};
