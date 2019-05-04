const utils = require('../utils');

const config = utils.getConfig();

const models = require('next-transit-data')(config.databaseUrl);

module.exports = models;
