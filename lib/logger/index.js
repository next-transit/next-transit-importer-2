const { custom, importing, persist, time, timeEnd } = require('./commands');
const styles = require('./styles');
const { timeDiff } = require('./timer');

const logging = {
  ...styles,
  time,
  timeDiff,
  timeEnd,
  ...persist,
  startImport: agency => {
    time(agency.slug);
    importing.startImport(agency);
  },
  endImport: ({ slug }) => {
    const time = timeEnd(slug);
    importing.endImport(time);
  },
  startDataType: type => {
    time(type.id);
    importing.startDataType(type);
  },
  endDataType: type => {
    const time = timeEnd(type.id);
    importing.endDataType(type, time);
  },
  endParse: type => {
    const time = timeEnd(`${type.id}-parse`);
    importing.endParse(time);
  },
  startSave: importing.startSave,
  endSave: type => {
    const time = timeEnd(`${type.id}-save`);
    importing.endSave(time);
  },
  startCustom: type => {
    time(`${type.id}-read`);
    custom.startCustom(type.title);
  },
  warnCustom: custom.warnCustom,
  endCustom: type => {
    const time = timeEnd(`${type.id}-read`);
    custom.endCustom(time);
  }
};

module.exports = logging;
