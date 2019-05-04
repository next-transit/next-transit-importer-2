const { getRouteDirections } = require('./directions');

async function processRoute(type, route, length, count) {
  const directions = await getRouteDirections(type, route);
  await type.writeData(directions);
  type.logger.progress({ length, count, level: 2 });
}

module.exports = {
  processRoute
};
