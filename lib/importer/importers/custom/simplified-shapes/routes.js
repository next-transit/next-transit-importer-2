const moment = require('moment');

const { getLongestTripShape } = require('./trips');

async function getRouteShapes(type, route) {
  const directionIds = [0, 1];
  const nowStr = moment().format('YYYY-MM-DD HH:mm:ss');

  const directionShapes0 = await getLongestTripShape(type, route, 0, nowStr);
  const directionShapes1 = await getLongestTripShape(type, route, 1, nowStr);

  return [...directionShapes0, ...directionShapes1];
}

async function processRoute(type, route, length, count) {
  const shapes = await getRouteShapes(type, route);
  await type.writeData(shapes);
  type.logger.progress({ length, count, level: 2 });
}

module.exports = {
  processRoute
};
