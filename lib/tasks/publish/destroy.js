const { exec } = require('child_process');

const config = require('../../utils').getConfig();
const logger = require('../../logger');

const { getDatabaseFromInput } = require('./utils');

function destroyRemoteDatabase(addOnId) {
  return new Promise((resolve, reject) => {
    logger.warning({ message: `Deleting database ${addOnId} ...`, level: 1 });

    const cmd = `heroku addons:destroy ${addOnId} --confirm ${config.heroku_api_app_name}`;

    exec(cmd, {}, (err, stdout) => {
      if (err) return reject(err);

      stdout.split('\n').forEach(line => {
        logger.statement({ message: line, level: 1 });
      });

      resolve();
    });
  });
}

function destroy() {
  return new Promise((resolve, reject) => {
    logger.statement({ message: 'Destroy remote database...', level: 1 });

    getDatabaseFromInput().then(databaseId => {
      if (databaseId) {
        destroyRemoteDatabase(databaseId).then(resolve);
      } else {
        resolve();
      }
    });
  });
}

module.exports = destroy;
