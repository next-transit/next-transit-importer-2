const { marquee, statement } = require('../styles');

const { persist } = require('./persist');

const startImport = agency => {
  marquee({
    message: 'Import {agency} data',
    data: { agency: agency.agency_name },
    dataStyle: 'white'
  });
};

const endImport = time => {
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
