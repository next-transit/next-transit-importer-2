const GtfsType = require('./gtfs');
const CustomType = require('./custom');

const calendar = new GtfsType('cal', 'Calendar', 'calendar', 'calendar_dates');
const calendarExceptions = new GtfsType('calex', 'Calendar Exceptions', 'calendar_dates', null, false);
const shapes = new GtfsType('shs', 'Shapes', 'shapes');
const stops = new GtfsType('sts', 'Stops', 'stops');
const trips = new GtfsType('trs', 'Trips', 'trips');
const stopTimes = new GtfsType('sttms', 'Stop Times', 'stop_times');
const routes = new GtfsType('rts', 'Routes', 'routes');

const routeShapes = new CustomType('rtshs', 'Route Shapes', 'simplified_shapes', 'simplifiedShapes');
const routeStops = new CustomType('rtsts', 'Route Stops', 'simplified_stops', 'simplifiedStops');
const routeDirections = new CustomType('rtdirs', 'Route Directions', 'directions', 'routeDirections');
const tripVariants = new CustomType('trsvts', 'Trip Variants', 'trip_variants', 'tripVariants');
const stats = new CustomType('stats', 'Statistics', 'stats', 'stats');

const allTypes = [
  calendar,
  calendarExceptions,
  shapes,
  stops,
  trips,
  stopTimes,
  routes,
  routeDirections,
  routeShapes,
  routeStops,
  stats,
  tripVariants
];

module.exports = typeFilter => {
  return allTypes.filter(importType => 
    !typeFilter || importType.type === typeFilter
  );
};
