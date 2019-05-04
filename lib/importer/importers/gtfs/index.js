const parse = require('./parse');

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

module.exports = {
  parse: (type, agency) => parse(new Gtfs(type, agency))
};
