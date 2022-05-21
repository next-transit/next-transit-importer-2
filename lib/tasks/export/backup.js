const { exec } = require('child_process');

const logger = require('../../logger');

function backup(options) {
  return new Promise((resolve, reject) => {
    if (options.upload) return resolve(options);

    logger.statement({ message: `Backing up database to ${options.backupPath} ...`, level: 1 });

    exec(`pg_dump -Fc --no-acl --no-owner -h localhost -p 5433 -U reedlauber nexttransit_dev > ${options.backupPath}`, {} , err => {
      if (err) return reject(err);
      resolve(options);
    });
  });
}

module.exports = backup;
