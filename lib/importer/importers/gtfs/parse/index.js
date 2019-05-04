const fs = require('fs');

const logger = require('../../../../logger');

const parser = require('./parser');

async function getFileLength(inputPath) {
  return new Promise((resolve, reject) => {
    let count = 0;
    fs.createReadStream(inputPath)
      .on('data', chunk => {
        for (let i = 0; i < chunk.length; ++i) {
          if (chunk[i] === 10) count++;
        }
      })
      .on('end', () => {
        resolve(count);
      });
  });
}

async function importFile(gtfs, inputDir, append) {
  const { type } = gtfs;
  const inputPath = gtfs.getInputPath(inputDir);
  const flags = append ? 'a' : 'w';
  const writeStream = fs.createWriteStream(type.writePath, { flags });
  const fileLength = await getFileLength(inputPath);

  await parser(
    gtfs.type,
    inputPath,
    writeStream,
    append,
    gtfs.type.columnsMap,
    fileLength
  );
}

async function parse(gtfs) {
  const { type } = gtfs;
  const { agency } = type;
  let append = false;

  logger.time(`${gtfs.type.id}-parse`);

  const inputDirs = (agency.import_paths || '').split(',').map(str => `${type.agencyPath}${str.trim()}`);

  for (let inputDir of inputDirs) {
    await importFile(gtfs, inputDir, append);
    append = true;
  }

  logger.endParse(gtfs.type);
}

module.exports = parse;
