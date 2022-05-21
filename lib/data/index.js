const models = require('../models');

const _cache = {};

const cached = (key, resolve, requestData) => {
  if (_cache[key]) {
    resolve(_cache[key]);
  } else {
    requestData(data => {
      _cache[key] = data;
      resolve(data);
    });
  }
};

async function getAgency(agencySlug) {
  return new Promise((resolve, reject) => {
    models.agencies
      .select({ public:false })
      .where('slug = ?', [agencySlug])
      .first(agency => {
        if (!agency) {
          return reject(`Agency ${agencySlug} was not found.`);
        }

        resolve(agency);
      });
  });
}

async function getCalendarDates(agencyId) {
  return new Promise((resolve, reject) => {
    models.calendar_dates
      .select(agencyId)
      .error(reject)
      .all(resolve);
  });
}

async function getCount(modelName, agencyId) {
  return new Promise((resolve, reject) => {
    models[modelName]
      .select(agencyId)
      .error(reject)
      .count(resolve);
  });
}

async function getLongestTrip(agencyId, routeId, directionId) {
  return new Promise((resolve, reject) => {
    cached(`longest-trip-${routeId}-${directionId}`, resolve, complete => {
      models.trips
        .get_longest_trip(agencyId, routeId, directionId)
        .then(complete, reject);
    });
  });
}

async function getRouteDirectionStop(agencyId, route, directionId, first) {
  return new Promise((resolve, reject) => {
    var sortDir = first ? '' : ' DESC';

    models.simplified_stops.select()
      .columns('ss.stop_id, ss.stop_name, ss.stop_sequence, ss.stop_lat, ss.stop_lon')
      .where('ss.agency_id = ?', agencyId)
      .where('ss.route_id = ?', route.route_id)
      .where('ss.direction_id = ?', directionId)
      .orders(`ss.stop_sequence${sortDir}`)
      .error(reject)
      .first(resolve);
  });
}

async function getRoutes(agencyId) {
  return new Promise((resolve, reject) => {
    cached('routes', resolve, complete => {
      models.routes
        .select(agencyId)
        .error(reject)
        .all(complete);
    });
  });
}

async function getShapes(agencyId, shapeId) {
  return new Promise((resolve, reject) => {
    models.shapes
      .select(agencyId)
      .where('shape_id = ?', shapeId)
      .orders('shape_pt_sequence')
      .error(reject)
      .all(resolve);
  });
}

async function getRouteStopCount(agencyId, routeId, directionId) {
  return new Promise(function(resolve, reject) {
    models.simplified_stops
      .select('count(*) as stop_count')
      .where('agency_id = ?', agencyId)
      .where('route_id = ?', routeId)
      .where('direction_id = ?', directionId)
      .error(reject)
      .first(result => resolve(parseInt(result.stop_count, 10) || 0));
  });
}

async function getTrips(agencyId) {
  return new Promise((resolve, reject) => {
    models.trips
      .select(agencyId)
      .error(reject)
      .all(resolve);
  });
}

async function getTripInfo(agencyId, tripId) {
  return new Promise((resolve, reject) => {
    models.stop_times
      .select('MIN(stop_sequence) as min_sequence, MAX(stop_sequence) as max_sequence')
      .where('agency_id = ?', agencyId)
      .where('trip_id = ?', tripId)
      .group_by('trip_id')
      .sql((sql, params) => console.log(sql, params))
      .error(reject)
      .first(resolve)
  });
}

async function getTripsAggregates(agencyId, routeId) {
  return new Promise((resolve, reject) => {
    const aggColumns = [
      'st.trip_id',
      't.route_id',
      't.direction_id',
      't.trip_headsign'
    ];
    const columns = [
      'MIN(stop_sequence) as min_sequence',
      'MAX(stop_sequence) as max_sequence',
      'COUNT(st.*) as stops_count',
      ...aggColumns
    ].join(', ');

    models.stop_times
      .select(columns)
      .where('agency_id = ?', agencyId)
      .where('t.route_id = ?', routeId)
      .join('trips t on st.trip_id = t.trip_id')
      .group_by(aggColumns.join(', '))
      .error(reject)
      .all(resolve);
  });
}

async function getTripStops(agencyId, tripId) {
  return new Promise((resolve, reject) => {
    models.stop_times
      .select('s.*, st.stop_sequence')
      .join('stops s ON st.stop_id = s.stop_id')
      .where('s.agency_id = ?', agencyId)
      .where('st.trip_id = ?', tripId)
      .orders('st.stop_sequence')
      .all(resolve, reject);
  });
}

async function insertStats(stats) {
  return new Promise((resolve, reject) => {
    models.stats
      .insert(stats)
      .error(reject)
      .commit(resolve);
  });
}

async function importData(modelName, writePath, columns) {
  return new Promise((resolve, reject) => {
    models[modelName]
      .import(writePath, columns)
      .error(reject)
      .commit(resolve);
  });
}

async function deleteImport(modelName, agencyId, writePath, columns) {
  return new Promise((resolve, reject) => {
    models[modelName]
      .delete_import(agencyId, writePath, columns)
      .error(reject)
      .commit(resolve);
  });
}

module.exports = {
  deleteImport,
  getAgency,
  getCalendarDates,
  getCount,
  getLongestTrip,
  getRouteDirectionStop,
  getRoutes,
  getRouteStopCount,
  getShapes,
  getTripInfo,
  getTrips,
  getTripsAggregates,
  getTripStops,
  importData,
  insertStats
};
