const moment = require('moment');

const { getDirectionStops } = require('./stops');

const NORTH_SOUTH = Symbol('North-South');
const EAST_WEST = Symbol('East-West');
const DIRECTION_TITLES = {
  [NORTH_SOUTH]: ['Southbound', 'Northbound'],
  [EAST_WEST]: ['Westbound', 'Eastbound']
};
const RAIL_HEADSIGNS = ['Outbound', 'Inbound'];

async function getDirectionTitle(type, route, directionId) {
  const { first, last } = await getDirectionStops(type, route, directionId);

  const headsign = last ? last.stop_name : null;
  let title = directionId.toString();

  if (route.is_rail) {
    title = RAIL_HEADSIGNS[directionId];
  } else if(first && last) {
    const diffX = Math.abs(first.stop_lon - last.stop_lon);
    const diffY = Math.abs(first.stop_lat - last.stop_lat);
    const cardinal = diffX > diffY ? EAST_WEST : NORTH_SOUTH;
    title = DIRECTION_TITLES[cardinal][directionId];
  }

  return { headsign, title };
}

async function getRouteDirections(type, route) {
  const directionIds = [0, 1];
  const directions = [];
  const nowStr = moment().format('YYYY-MM-DD HH:mm:ss');

  for(let directionId of directionIds) {
    const { headsign, title } = await getDirectionTitle(type, route, directionId);

    directions.push({
      agency_id: type.agency.id,
      route_id: route.route_id,
      route_short_name: route.route_short_name,
      direction_id: directionId,
      direction_name: title,
      direction_long_name: headsign,
      created_at: nowStr,
      updated_at: nowStr
    });
  }

  return directions;
}

module.exports = {
  getRouteDirections
};
