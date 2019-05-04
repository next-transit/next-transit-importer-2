async function getLongestTripStops(type, route, directionId, now) {
  const { agency } = type;
  const trip = await type.data.getLongestTrip(agency.id, route.route_id, directionId);

  if (!trip) {
    type.logger.warnCustom(
      type,
      `Couldn't find longest trip for route: ${route.route_short_name}, ${directionId}`
    );
    return [];
  }

  const stops = await type.data.getTripStops(agency.id, trip.trip_id);

  return stops.map(stop => ({
    agency_id: agency.id,
    route_id: route.route_id,
    direction_id: directionId,
    stop_id: stop.stop_id,
    stop_sequence: stop.stop_sequence,
    stop_name: stop.stop_name,
    stop_lat: stop.stop_lat,
    stop_lon: stop.stop_lon,
    created_at: now,
    updated_at: now
  }));
}

module.exports = {
  getLongestTripStops
};
