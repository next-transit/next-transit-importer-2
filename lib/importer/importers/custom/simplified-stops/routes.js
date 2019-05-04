const moment = require('moment');

const { getLongestTripStops } = require('./stops');

async function getRouteStops(type, route) {
  const directionIds = [0, 1];
  const shapes = [];
  const nowStr = moment().format('YYYY-MM-DD HH:mm:ss');

  const directionStops0 = await getLongestTripStops(type, route, 0, nowStr);
  const directionStops1 = await getLongestTripStops(type, route, 1, nowStr);

  return [...directionStops0, ...directionStops1];
}

async function processRoute(type, route, length, count) {
  const stops = await getRouteStops(type, route);
  await type.writeData(stops);
  type.logger.progress({ length, count, level: 2 });
}

module.exports = {
  processRoute
};
