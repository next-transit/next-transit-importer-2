const request = require('superagent');
const https = require('https');
const fs = require('fs');

const REPO = 'septadev/GTFS';
const LATEST_RELEASE_URL = `https://api.github.com/repos/${REPO}/releases/latest`;
const LOCAL_PATH = './data/gtfs/septa';

function getLatestRelease() {
  return new Promise((resolve, reject) => {
    request
      .get(LATEST_RELEASE_URL)
      .set('User-Agent', 'NEXT-Transit')
      .end((err, response) => {
        if (err) return reject(new Error(err));

        resolve(JSON.parse(response.text));
      });
  });
}

function getAssetInitial(release) {
  return new Promise((resolve, reject) => {
    https.get(release.assets[0].browser_download_url, response => {
      resolve(response.headers.location);
    });
  });
}

function getAssetSecondary(locationUrl) {
  return new Promise((resolve, reject) => {
    const destFileName = 'gtfs_2019-11-16.zip';
    const file = fs.createWriteStream(`${LOCAL_PATH}/${destFileName}`, { emitClose: true });

    file.on('close', resolve)

    https
      .get(locationUrl, response => {
        response
          .on('error', reject)
          .pipe(file);
      });
  });
}

function download() {
  console.log('Downloading GTFS from SEPTA...');

  getLatestRelease()
    .then(getAssetInitial)
    .then(getAssetSecondary)
    .then(() => {
      console.log('Download complete.');
    }).catch(err => {
      console.log('Download failed', err);
    });
}

module.exports = {
  download,
};
