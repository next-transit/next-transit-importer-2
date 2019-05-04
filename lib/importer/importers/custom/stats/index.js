const moment = require('moment');

const STAT_MODELS = [
  'shapes',
  'stops',
  'routes',
  'directions',
  'simplified_stops',
  'trips',
  'trip_variants',
  'stop_times',
  'simplified_shapes'
];

let stats;

function getProcessSeconds(type) {
  const diff = type.logger.timeDiff(type.agency.slug);
  return Math.round(diff / 1000);
}

async function getCount(type, modelName) {
  return await type.data.getCount(modelName, type.agency.id);
}

async function parse(type) {
  const nowStr = moment().format('YYYY-MM-DD HH:mm:ss');

  stats = {
    agency_id: type.agency.id,
    created_at: nowStr,
    process_seconds: getProcessSeconds(type)
  };

  for (let model of STAT_MODELS) {
    stats[`${model}_count`] = await getCount(type, model);
  }
}

async function save(type) {
  await type.data.insertStats(stats);
}

module.exports = {
  parse,
  save
};
