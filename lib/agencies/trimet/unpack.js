const { exec } = require('child_process');
const fs = require('fs');
const moment = require('moment');

const logger = require('../../logger');

const now = moment();

const DATA_PATH = './data/gtfs/trimet';

async function unzipFile(filePath) {
  return new Promise((resolve, reject) => {
    logger.statement({ message: `Unziping file ${filePath}`, level: 1 });
    const readPath = `${DATA_PATH}/${filePath}`;
    const writePath = `${DATA_PATH}/${filePath.split('.')[0]}`;

    const cp = exec(`unzip -o ${readPath} -d ${writePath}`, {}, err => {
      if (err) return reject(err);
    });

    cp.on('close', resolve);
  });
}

async function unzipFiles(fileName) {
  await unzipFile(fileName);
}

async function unpack() {
  return new Promise((resolve, reject) => {
    logger.marquee({ message: 'Unzipping GTFS files...' });

    const nowStr = now.format('YYYY-MM-DD')
    const todayFile = `gtfs_${nowStr}.zip`;
    const todayPath = `${DATA_PATH}/${todayFile}`;

    fs.stat(todayPath, (err, stats) => {
      if (err && err.code !== 'ENOENT') {
        reject(err);
        return;
      }

      if (err) {
        logger.warning({ message: 'No download for today present. Maybe download first?', level: 1 });
        resolve();
      } else {
        unzipFiles(todayFile).then(() => {
          logger.statement({ message: 'Done', level: 1 });
          resolve();
        });
      }
    });
  });
}

module.exports = {
  unpack
};
