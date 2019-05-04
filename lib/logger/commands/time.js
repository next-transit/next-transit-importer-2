const timer = require('../timer');

const time = (label, message) => {
  timer.time(label);

  if (message) {
    this.statement(message);
  }
};

module.exports = time;
