const parser = require('./parse');

const GTFS_BASE_PATH = `${process.env.PWD}/data/gtfs`;

class Gtfs {
  constructor(type) {
    this.type = type;
    this.basePath = GTFS_BASE_PATH;
  }

  setAgency(agency) {
    super.setAgency(agency);
  }

  getInputPath(dirName) {
    return `${dirName}/${this.type.fileName}.txt`;
  }
}

async function parse(type, agency) {
  await parser(new Gtfs(type, agency));
}

module.exports = {
  parse
};
