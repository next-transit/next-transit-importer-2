async function getDirectionStops(type, route, directionId) {
  const first = await type.data.getRouteDirectionStop(type.agency.id, route, directionId, true);
  const last = await type.data.getRouteDirectionStop(type.agency.id, route, directionId, false);

  return { first, last };
}

module.exports = {
  getDirectionStops
};
