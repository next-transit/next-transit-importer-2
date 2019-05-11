async function getLongestTripShape(type, route, directionId, now) {
  const { agency } = type;
  const trip = await type.data.getLongestTrip(agency.id, route.route_id, directionId);

  if (!trip) {
    type.logger.warnCustom(
      `Couldn't find longest trip for route: ${route.route_short_name}, ${directionId}`
    );
    return [];
  }

  const shapes = await type.data.getShapes(agency.id, trip.shape_id);

  return shapes.map(shape => ({
    agency_id: agency.id,
    route_id: route.route_id.trim(),
    segment_id: directionId,
    shape_id: shape.shape_id,
    shape_pt_lat: shape.shape_pt_lat,
    shape_pt_lon: shape.shape_pt_lon,
    shape_pt_sequence: shape.shape_pt_sequence,
    created_at: now,
    updated_at: now
  }));
}

module.exports = {
  getLongestTripShape
};
