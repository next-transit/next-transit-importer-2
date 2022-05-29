const { exec } = require('child_process');
const fs = require('fs');
const moment = require('moment');

const { unpack, unzipFile } = require('../../utils/unpacking');

const logger = require('../../logger');

const now = moment();

const DATA_PATH = './data/gtfs/trimet';

async function unzipFiles(fileName) {
  await unzipFile(fileName);
}

async function unpackTrimet() {
  await unpack(DATA_PATH, async (todayFile) => {
    await unzipFiles(todayFile);
  });
}

module.exports = {
  unpack: unpackTrimet
};
