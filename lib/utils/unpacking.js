const { exec } = require('child_process');
const fs = require('fs');
const moment = require('moment');

const logger = require('../logger');

const unzipFile = async (filePath) => {
  return new Promise((resolve, reject) => {
    logger.statement({ message: `Unzipping file ${filePath}`, level: 1 });
    const writePath = filePath.replace(/\.[a-z]{2,4}$/, '');

    exec(`unzip -o ${filePath} -d ${writePath}`, {}, (err) => {
      if (err) {
        return reject(err);
      }
    }).on('close', resolve);
  });
}


const unpack = async (pathRoot, onUnzip) => {
  return new Promise((resolve, reject) => {
    logger.marquee({ message: 'Unzipping GTFS files...' });

    const nowStr = moment().format('YYYY-MM-DD')
    const todayFile = `gtfs_${nowStr}.zip`;
    const todayPath = `${pathRoot}/${todayFile}`;

    fs.stat(todayPath, (err, stats) => {
      if (err && err.code !== 'ENOENT') {
        reject(err);
        return;
      }

      if (err) {
        logger.warning({ message: 'No download for today present. Maybe download first?', level: 1 });
        resolve();
      } else {
        onUnzip(todayFile).then(() => {
          logger.statement({ message: 'Done', level: 1 });
          resolve();
        }).catch(reject);
      }
    });
  });
}

module.exports = { unpack, unzipFile };
