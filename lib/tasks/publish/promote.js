const { exec } = require('child_process');

const config = require('../../utils').getConfig();
const logger = require('../../logger');

const { getDatabaseFromInput } = require('./utils');

function getDatabaseId(options) {
  return new Promise((resolve, reject) => {
    if (options.databaseInfo && options.databaseInfo.databaseId) {
      return resolve(options.databaseInfo.databaseId);
    }
    
    getDatabaseFromInput().then(resolve);
  });
}

function promote(options) {
  return new Promise((resolve, reject) => {
    getDatabaseId(options).then(databaseId => {
      if (!databaseId) return reject('Could not find database to promote');

      logger.statement({ message: 'Promote remote database...', level: 1 });
      const apiApp = config.productionAPIApp;
      const restartApps = [apiApp, ...config.productionWebApps];
      const restarts = restartApps.map(appName => `&& heroku restart --app ${appName}`).join(' ');

      const cmd = `heroku pg:promote ${databaseId} --app ${apiApp} ${restarts}`;

      exec(cmd, {}, (err, stdout) => {
        if (err) return reject(err);

        stdout.split('\n').forEach(line => {
          logger.statement({ message: line, level: 1 });
        });

        resolve();
      });
    });
  });
}

module.exports = promote;
