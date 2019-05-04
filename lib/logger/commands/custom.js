const { marquee, statement, warning } = require('../styles');

// const { persist } = require('./persist');

const startCustom = title => {
  statement({
    message: 'Gather {title} data',
    data: { title },
    dataStyle: 'white',
    level: 2
  });
};

const warnCustom = message => {
  warning({
    message,
    level: 3
  });
};

const endCustom = time => {
  statement({
    message: 'Data gathered in {time}',
    data: { time },
    level: 2
  });
};

module.exports = {
  endCustom,
  startCustom,
  warnCustom
};
