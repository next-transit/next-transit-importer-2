const NORTH_SIDE_ROUTES = [
	'CHE',
	'LAN',
	'FOX',
	'NOR',
	'WAR',
	'WTR'
];

const directions = record => {
	if(NORTH_SIDE_ROUTES.includes(record.route_id)) {
		record.direction_name = record.direction_id === 0 ? 'Inbound' : 'Outbound';
	}

	return record;
};

module.exports = {
	directions
};
