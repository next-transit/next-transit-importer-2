const fs = require('fs');

const moment = require('moment');
const parse = require('csv-parse');
const stringify = require('csv-stringify');
const transform = require('stream-transform');

const transforms = require('./transforms');

async function parseFile(type, inputPath, writeStream, append, columnsMap, length) {
  return new Promise(resolve => {
    const { agency } = type;
    const typeTransformer = transforms(agency, type.type);
    const nowStr = moment().format('YYYY-MM-DD HH:mm:ss');

    const parser = parse({
      columns: true,
      record_delimiter: '\n',
      trim: true
    });

    let count = 0;
    const transformer = transform((record, callback) => {
      record = typeTransformer(record);
      record.created_at = record.updated_at = nowStr;
      record.agency_id = agency.id;
      if (++count % 5000 === 0) {
        count++;
        type.logger.progress({ label: 'file', length, count, level: 2 });
      }
      callback(null, record);
    });

    const stringifier = stringify({
      columns: columnsMap,
      delimiter: '\t',
      eof: !append
    });

    stringifier.on('finish', resolve);

    fs.createReadStream(inputPath)
      .pipe(parser)
      .pipe(transformer)
      .pipe(stringifier)
      .pipe(writeStream);
  });
}

module.exports = parseFile;
