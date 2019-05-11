const { marquee, statement } = require('../styles');
const { format, time, timeDiff } = require('../timer');

const { persist } = require('./persist');

let interval;
const startImportTimer = () => {
  time('import-progress');

  interval = setInterval(() => {
    const time = format(timeDiff('import-progress'));
    const cpuMb = process.cpuUsage().system / 1000;
    const cpu = `${cpuMb}Mb`;
    const memMb = process.memoryUsage().heapTotal / 1000;
    const mem = `${memMb}Mb`;
    const message = `{time} | CPU: {cpu} | Memory: {mem}`;
    statement({ persist: true, label: 'import-progress', message, data: { cpu, mem, time } });
  }, 0.333);
};
const stopImportTimer = () => {
  clearInterval(interval);
};

const startImport = agency => {
  statement({ persist: true, label: 'import-progress', message: 'Importing...' });
  statement({ persist: true, label: 'space', message: ' ' });
  startImportTimer();

  marquee({
    message: 'Import {agency} data',
    data: { agency: agency.agency_name },
    dataStyle: 'white'
  });
};

const endImport = time => {
  stopImportTimer();

  statement({ label: 'space', message: '' });
  statement({ label: 'import-progress', message: '' });

  marquee({
    message: 'Import completed in {time}',
    data: { time }
  });
};

const startDataType = type => {
  marquee({
    message: '{title}',
    data: { title: type.title },
    dataStyle: 'title',
    level: 1,
  });
};

const endDataType = (type, time) => {
  statement({
    message: '{title} completed in {time}',
    data: { title: type.title, time },
    level: 2
  });
};

const endParse = time => {
  statement({
    message: 'Source data processed in {time}',
    data: { time },
    level: 2
  });
};

const startSave = () => {
  persist({
    message: 'Writing to database...',
    level: 2
  });
};

const endSave = time => {
  statement({
    message: 'Data written to database in {time}',
    data: { time },
    level: 2
  });
};

module.exports = {
  endDataType,
  endImport,
  endParse,
  endSave,
  startDataType,
  startImport,
  startSave
};
