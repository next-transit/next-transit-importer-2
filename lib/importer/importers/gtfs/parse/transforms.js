const agencyTransforms = require('./agencies');

const noop = record => record;

const calendar_dates = record => {
  const daysBool = record.exception_type === '1' ? 1 : 0;
  record.monday = record.tuesday = record.wednesday = record.thursday = record.friday = record.saturday = record.sunday = daysBool;
  record.exact_date = record.date;
  return record;
};

const stops = record => {
  return record;
};

const stop_times = record => {
  return record;
};

const trips = record => {
  return record;
};

const transforms = {
  calendar_dates,
  stops,
  stop_times,
  trips
};

module.exports = (agency, type) => {
  const transformer = transforms[type] || noop;
  const agencyTransformer = agencyTransforms(agency, type);

  return record => {
    return agencyTransformer(transformer(record));
  };
};
