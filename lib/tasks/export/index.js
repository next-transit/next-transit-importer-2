const moment = require('moment');

const logger = require('../../logger');

const backup = require('./backup');
const upload = require('./upload');

function exportdb(options) {
  logger.marquee('Export');

  const today = moment().format('YYYY-MM-DD');
  const backupPath = `backups/nexttransit_${today}.dump`;

  backup({ ...options, backupPath }).then(upload).catch(console.error);
}

module.exports = exportdb;
