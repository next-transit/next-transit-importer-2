const moment = require('moment');

const logger = require('../../logger');

const backup = require('./backup');
const upload = require('./upload');

async function exportdb(options) {
  logger.marquee('Export');

  const today = moment().format('YYYY-MM-DD');
  const backupPath = `backups/nexttransit_${today}.dump`;

  await backup({ ...options, backupPath });
  await upload({ ...options, backupPath });
}

module.exports = exportdb;
