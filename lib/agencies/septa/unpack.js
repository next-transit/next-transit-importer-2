const { exec } = require('child_process');
const fs = require('fs');
const moment = require('moment');

const now = moment();

const DATA_PATH = './data/gtfs/septa';

async function unzipFile(filePath) {
  return new Promise((resolve, reject) => {
    console.log(`    Unziping file ${filePath}`);
    const readPath = `${DATA_PATH}/${filePath}`;
    const writePath = `${DATA_PATH}/${filePath.split('.')[0]}`;

    const cp = exec(`unzip -o ${readPath} -d ${writePath}`, {}, err => {
      if (err) return reject(err);
    });

    cp.on('close', resolve);
  });
}

async function unzipFiles(fileName) {
  const fileNameOnly = fileName.split('.')[0];

  await unzipFile(fileName)
  await unzipFile(`${fileNameOnly}/google_bus.zip`);
  await unzipFile(`${fileNameOnly}/google_rail.zip`);
}

function unpack() {
  console.log('Unzipping GTFS files...');

  const nowStr = now.format('YYYY-MM-DD')
  const todayFile = `gtfs_${nowStr}.zip`;
  const todayPath = `${DATA_PATH}/${todayFile}`;

  fs.stat(todayPath, (err, stats) => {
    if (err && err.code !== 'ENOENT') return console.error(err);

    if (err) {
      console.log('No download for today present. Maybe download first?');
    } else {
      unzipFiles(todayFile).then(() => console.log('    Done'));
    }
  });
}

module.exports = {
  unpack
};
