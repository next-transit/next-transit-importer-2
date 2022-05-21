const { processRoute } = require('./routes');

async function parse(type) {
  const routes = await type.data.getRoutes(type.agency.id);

  const { length } = routes;
  let count = 0;

  for (let route of routes) {
    await processRoute(type, route, length, ++count);
  }

  type.writeClose();
}

module.exports = {
  parse
};
