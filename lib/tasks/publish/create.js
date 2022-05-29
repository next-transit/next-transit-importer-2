const { exec } = require('child_process');

const logger = require('../../logger');

function extractDatabaseName(output) {
  const matches = output.match(/Created ([a-z0-9\-]+) as ([A-Z_]+)/);

  if (matches) {
    const databaseId = matches[1];
    const databaseName = matches[2];

    return { databaseId, databaseName };
  }

  return null;
}

function create() {
  return new Promise((resolve, reject) => {
    logger.statement({ message: 'Create remote database...', level: 1 });
    const cmd = `heroku addons:add heroku-postgresql:hobby-basic --app nexttransit-api`;

    exec(cmd, {}, (err, stdout) => {
      if (err) return reject(err);

      const databaseInfo = extractDatabaseName(stdout);

      if (databaseInfo) {
        const data = {
          id: databaseInfo.databaseId,
          name: databaseInfo.databaseName,
        };
        const message = `Created ${data.id} as ${data.name}`;
        logger.statement({ message, level: 1, data, dataStyle: 'white' });
      } else {
        stdout.split('\n').forEach(line => {
          logger.statement({ message: line, level: 1 });
        });
      }

      resolve(databaseInfo);
    });
  });
}

module.exports = create;
