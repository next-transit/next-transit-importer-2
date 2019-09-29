const { marquee, plain, statement } = require('../styles');
const { format, time, timeDiff } = require('../timer');

const { persist } = require('./persist');

let interval;
const formatBytes = bytes => {
  let units = 'B';
  let val = bytes;

  if (Math.abs(bytes) > 1000 * 1000) {
    units = 'GB';
    val = (bytes / 1000 / 1000).toFixed(1);
  } else if (Math.abs(bytes) > 1000) {
    units = 'MB';
    val = (bytes / 1000).toFixed(1);
  }

  return `${val}${units}`;
};

const formatMemory = (startMem, mem) => {
  const memDiff = mem - startMem;
  const diffSign = memDiff > 0 ? '+' : '';

  const memF = formatBytes(mem);
  const diffF = formatBytes(memDiff);
  return `${memF} (${diffSign}${diffF})`;
}

const startImportTimer = () => {
  time('import-progress');
  const startMem = process.memoryUsage().heapTotal;

  interval = setInterval(() => {
    const time = format(timeDiff('import-progress'));
    const mem = formatMemory(startMem, process.memoryUsage().heapTotal);
    const message = `{time} | Memory: {mem}`;
    plain({ persist: true, label: 'import-progress', message, level: 2, data: { mem, time } });
  }, 0.333);
};
const stopImportTimer = () => {
  clearInterval(interval);
};

const startImport = agency => {
  plain({ persist: true, label: 'import-progress', message: 'Importing...', level: 2 });
  plain({ persist: true, label: 'space', message: ' ' });
  startImportTimer();

  marquee({
    message: 'Import {agency} data',
    data: { agency: agency.agency_name },
    dataStyle: 'white'
  });
};

const endImport = time => {
  stopImportTimer();

  plain({ label: 'space', message: '' });
  plain({ label: 'import-progress', message: '' });

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
    level: 2,
    label: 'writing-db'
  });
};

const endSave = time => {
  persist({ label: 'writing-db', message: '' });
  statement({
    message: 'Data written to database in {time}',
    data: { time },
    level: 2
  });
};

const fatalError = (e) => {
  stopImportTimer();
  console.error(e);
};

module.exports = {
  endDataType,
  endImport,
  endParse,
  endSave,
  fatalError,
  startDataType,
  startImport,
  startSave
};
