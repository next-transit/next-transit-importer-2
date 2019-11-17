const fs = require('fs');
const AWS = require('aws-sdk');

AWS.config.credentials = new AWS.SharedIniFileCredentials({ profile: 'next-transit' });

const logger = require('../../logger');
const config = require('../../utils').getConfig();

function upload(options) {
  return new Promise((resolve, reject) => {
    if (options.local) {
      return resolve();
    }

    const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

    logger.statement({ message: 'Uploading to S3 ...', level: 1 });

    const fileStream = fs.createReadStream(`./${options.backupPath}`);

    const uploadParams = {
      ACL: 'public-read',
      Body: fileStream,
      Bucket: config.s3Bucket,
      Key: options.backupPath.replace('backups/', ''),
    };

    s3.upload(uploadParams, err => {
      if (err) { console.error(err); reject(err); }

      resolve();
    });
  });
}

module.exports = upload;
