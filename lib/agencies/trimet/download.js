const http = require('http');
const fs = require('fs');
const moment = require('moment');

const logger = require('../../logger');

const GTFS_URL = 'http://developer.trimet.org/schedule/gtfs.zip';
const LOCAL_PATH = './data/gtfs/trimet';

const now = moment();

function getAsset() {
  return new Promise((resolve, reject) => {
    const nowStr = now.format('YYYY-MM-DD');
    const destFileName = `gtfs_${nowStr}.zip`;
    const file = fs.createWriteStream(`${LOCAL_PATH}/${destFileName}`, { emitClose: true });

    file.on('close', resolve);

    http.get(GTFS_URL, (response) => {
      response.on('error', reject).pipe(file);
    });
  });
}

async function download() {
  return new Promise((resolve, reject) => {
    logger.marquee({ message: 'Downloading GTFS from Trimet...' });

    getAsset()
      .then(() => {
        logger.statement({ message: 'Download complete.', level: 1 });
        resolve();
      })
      .catch(err => {
        logger.warning({ message: 'Download failed', level: 1 });
        reject(err);
      });
  });
}

module.exports = {
  download,
};