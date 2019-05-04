const { custom, importing, persist, time, timeEnd } = require('./commands');
const { marquee, statement } = require('./styles');
const { timeDiff } = require('./timer');

class Logger {
  // Styled commands
  marquee(...args) {
    marquee(...args);
    return this;
  }

  statement(...args) {
    statement(...args);
    return this;
  }

  // Timer commands
  time(...args) {
    time(...args);
    return this;
  }

  timeDiff(...args) {
    return timeDiff(...args);
  }

  timeEnd(...args) {
    timeEnd(...args);
    return this;
  }

  // Persist commands
  persist(...args) {
    persist.persist(...args);
    return this;
  }

  progress(...args) {
    persist.progress(...args);
    return this;
  }

  // Importing commands
  startImport(agency) {
    time(agency.slug);
    importing.startImport(agency);
    return this;
  }

  endImport(agency) {
    const time = timeEnd(agency.slug);
    importing.endImport(time);
    return this;
  }

  startDataType(type) {
    time(type.id);
    importing.startDataType(type);
    return this;
  }

  endDataType(type) {
    const time = timeEnd(type.id);
    importing.endDataType(type, time);
    return this;
  }

  endParse(type) {
    const time = timeEnd(`${type.id}-parse`);
    importing.endParse(time);
    return this;
  }

  startSave() {
    importing.startSave();
    return this;
  }

  endSave(type) {
    const time = timeEnd(`${type.id}-save`);
    importing.endSave(time);
    return this;
  }

  startCustom(type) {
    time(`${type.id}-read`);
    custom.startCustom(type.title);
    return this;
  }

  warnCustom(type, message) {
    custom.warnCustom(message);
  }

  endCustom(type) {
    const time = timeEnd(`${type.id}-read`);
    custom.endCustom(time);
    return this;
  }
}

module.exports = new Logger();
