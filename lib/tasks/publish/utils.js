const { exec } = require('child_process');
const readline = require('readline');

const AWS = require('aws-sdk');

const config = require('../../utils').getConfig();
const logger = require('../../logger');

AWS.config.credentials = new AWS.SharedIniFileCredentials({ profile: 'next-transit' });
const S3 = new AWS.S3({ apiVersion: '2006-03-01' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const DISPLAY_KEYS = ['Connections', 'Created', 'Addon'];

function blobToDbInfo(blob) {
  return blob
    .split('\n')
    .map(line => {
      const [key, value] = line.split(':');
      return { key: key.replace('-', ''), value: (value || '').trim() };
    })
    .filter(line => DISPLAY_KEYS.includes(line.key))
    .reduce((acc, line) => {
      acc[line.key] = line.value;
      return acc;
    }, {});
}

function listsDatabases() {
  return new Promise((resolve, reject) => {
    const cmd = `heroku pg:info --app ${config.heroku_api_app_name}`;
    exec(cmd, {}, (err, stdout) => {
      if (err) return reject(err);

      const databases = stdout.split('===').filter(Boolean).map(blobToDbInfo);
      
      databases.forEach((db, i) => {
        console.log('');
        logger.plain({ message: `Database ${i + 1}.`, level: 1, style: 'title' });
        logger.statement({ message: `Name: ${db.Addon}`, level: 1, style: 'data' });
        logger.statement({ message: `Created: ${db.Created}`, level: 1, style: 'data' });
        logger.statement({ message: `Connections: ${db.Connections}`, level: 1, style: 'data' });
      });

      resolve(databases.map(db => db.Addon));
    });
  });
}

function getChoiceInput(items) {
  return new Promise((resolve, reject) => {
    let index = -1;

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    process.stdout.write('\n');
    rl.question(`Choose a number between 1 and ${items.length}: `.grey, answer => {
      if (answer) {
        index = parseInt(String(answer), 10);
      }

      rl.close();
      resolve(index);
    });
  });
}

function getDatabaseFromInput() {
  return new Promise((resolve, reject) => {
    listsDatabases()
      .then(dbNames => {
        getChoiceInput(dbNames).then(deleteIndex => {
          if (deleteIndex > 0) {
            resolve(dbNames[deleteIndex - 1]);
          } else {
            resolve();
          }
        });
      });
  });
}

function getBackupURLFromInput() {
  return new Promise((resolve, reject) => {
    S3.listObjects({ Bucket: config.s3Bucket, MaxKeys: 5, Prefix: 'nexttransit_' }, (err, data) => {
      if (err) return reject(err);

      const objects = data.Contents.map(object => ({
          ...object,
          LastModifiedDate: new Date(Date.parse(object.LastModified))
        }))
        .sort((a, b) => {
          if (a.LastModifiedDate < b.LastModifiedDate) return 1;
          if (a.LastModifiedDate > b.LastModifiedDate) return -1;
          return 0;
        })
      
      objects.forEach((object, i) => {
          const num = `${i + 1}.`.cyan;
          const key = `${object.Key}`.cyan;
          const message = `${num} ${key} (${object.LastModifiedDate})`;
          logger.statement({ message, level: 2 });
        });
      
      getChoiceInput(objects).then(archiveIndex => {
        const selectedObject = objects[archiveIndex];

        if (selectedObject) {
          return resolve(`https://${config.s3Bucket}.s3.amazonaws.com/${selectedObject.Key}`);
        }

        resolve();
      });
    });
  });
}

module.exports = {
  getBackupURLFromInput,
  getDatabaseFromInput,
  listsDatabases,
};
