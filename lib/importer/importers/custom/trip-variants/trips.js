const moment = require('moment');

const VARIANT_NAMES = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
const routeVariants = {};
const tripVariants = {};

function getVariantName(tripInfo) {
  const { route_id, direction_id, min_sequence, max_sequence } = tripInfo;
  const routeKey = `${route_id}-${direction_id}`;
  const tripKey = `${routeKey}-${min_sequence}-${max_sequence}`;

  if (!tripVariants[tripKey]) {
    let routeVariant = routeVariants[routeKey] || 0;
    let tripVariant = 0;

    if (routeVariant) {
      tripVariant = routeVariant;
      routeVariant++;
    }

    routeVariants[routeKey] = routeVariant;
    tripVariants[tripKey] = tripVariant;
  }

  return VARIANT_NAMES[tripVariants[tripKey]];
}

function processTripInfo(agencyId, tripInfo, now) {
  const variantName = getVariantName(tripInfo);

  if (variantName) {
    return {
      agency_id: agencyId,
      route_id: tripInfo.route_id,
      direction_id: tripInfo.direction_id,
      trip_headsign: tripInfo.trip_headsign,
      variant_name: variantName,
      stop_count: parseInt(tripInfo.stops_count, 10),
      first_stop_sequence: tripInfo.min_sequence,
      last_stop_sequence: tripInfo.max_sequence,
      created_at: now,
      updated_at: now
    };
  }
}

async function processTrips(type, route) {
  const { agency, data } = type;
  const tripInfos = await data.getTripsAggregates(agency.id, route.route_id);
  const nowStr = moment().format('YYYY-MM-DD HH:mm:ss');

  return tripInfos
    .map(tripInfo => processTripInfo(agency.id, tripInfo, nowStr))
    .filter(Boolean);
}

module.exports = {
  processTrips
};
