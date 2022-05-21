const moment = require('moment');

const logger = require('../../../../logger');

const getStartEndCounts = calendarDates => {
  const startEnds = calendarDates.filter(date => !!date.start_date && !!date.end_date);

  return startEnds.reduce((acc, date) => {
    const startDate = moment(date.start_date).format('YYYY-MM-DD');
    const endDate = moment(date.end_date).format('YYYY-MM-DD');
    const key = `${startDate}-${endDate}`;
    const existing = acc[key] || { label: `${startDate} - ${endDate}`, count: 0 };
    existing.count++;
    acc[key] = existing;
    return acc;
  }, {});
};

const getExactCounts = calendarDates => {
  const exacts = calendarDates.filter(date => !!date.exact_date);

  return exacts.reduce((acc, date) => {
    const exactDate = moment(date.exact_date).format('YYYY-MM-DD');
    const existing = acc[exactDate] || { label: `${exactDate}`, count: 0 };
    existing.count++;
    acc[exactDate] = existing;
    return acc;
  }, {});
};

const getDateCounts = calendarDates => {
  const dates = {
    ...getStartEndCounts(calendarDates),
    // ...getExactCounts(calendarDates),
  };

  return Object.values(dates).sort((a, b) => {
    if (a.count > b.count) return -1;
    if (a.count < b.count) return 1;
    return 0;
  });
};

async function parse(type) {
  const nowStr = moment().format('YYYY-MM-DD HH:mm:ss');

  const calendarDates = await type.data.getCalendarDates();

  getDateCounts(calendarDates).forEach(date => {
    logger.statement({ message: `${date.label} (${date.count})`, level: 2 });
  });
}

function save(type) {
  return new Promise((resolve, reject) => {
    resolve();
  });
}

module.exports = {
  parse,
  save
};
