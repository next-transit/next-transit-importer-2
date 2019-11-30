const { exec } = require('child_process');

const logger = require('../../logger');

const { getBackupURLFromInput, getDatabaseFromInput } = require('./utils');

function getBackupUrl(options) {
  return new Promise((resolve, reject) => {
    if (options.archive) {
      return resolve(options.archive);
    }

    getBackupURLFromInput().then(resolve);
  });
}

function getDatabaseId(options) {
  return new Promise((resolve, reject) => {
    if (options.databaseInfo && options.databaseInfo.databaseId) {
      return resolve(options.databaseInfo.databaseId);
    }

    getDatabaseFromInput().then(resolve).catch(reject);
  });
}

function restore(options) {
  return new Promise((resolve, reject) => {
    getBackupUrl(options).then(backupUrl => {
      if (!backupUrl) {
        return reject('Could not find an archive URL to use.')
      }

      options.archive = backupUrl;

      getDatabaseId(options).then(databaseId => {
        if (!databaseId) {
          return reject('Could not find a databaseId to use.');
        }

        logger.statement({ message: 'Restore backup to remote database...', level: 1 });

        const cmd = `heroku pg:backups:restore '${options.archive}' ${databaseId} --app nexttransit-api --confirm nexttransit-api`;

        logger.statement({ message: cmd, level: 1 });

        exec(cmd, {}, (err, stdout) => {
          if (err) return reject(err);
          stdout.split('\n').forEach(line => {
            logger.statement({ message: line, level: 1 });
          });
          resolve();
        });
      });
    });
  });
}

module.exports = restore;
