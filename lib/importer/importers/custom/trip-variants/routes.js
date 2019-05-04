const moment = require('moment');

const { processTrips } = require('./trips');

async function processRoute(type, route, length, count) {
  const tripInfos = await processTrips(type, route);
  await type.writeData(tripInfos);
  type.logger.progress({ length, count, level: 2 });
}

module.exports = {
  processRoute
};
