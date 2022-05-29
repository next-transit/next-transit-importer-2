const { unpack, unzipFile } = require('../../utils/unpacking');

const DATA_PATH = './data/gtfs/septa';

async function unzipFiles(fileName) {
  const fileNameOnly = fileName.split('.')[0];

  await unzipFile(`${DATA_PATH}/${fileName}`);
  await unzipFile(`${DATA_PATH}/${fileNameOnly}/google_bus.zip`);
  await unzipFile(`${DATA_PATH}/${fileNameOnly}/google_rail.zip`);
}

async function unpackSepta() {
  await unpack(DATA_PATH, async (todayFile) => {
    await unzipFiles(todayFile);
  });
}

module.exports = {
  unpack: unpackSepta
};
