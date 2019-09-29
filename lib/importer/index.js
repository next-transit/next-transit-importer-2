const data = require('../data');
const logger = require('../logger');

const importTypes = require('./import-types');

class Importer {
  constructor(options) {
    this.options = options;
    this.agency = null;
  }

  async importType(type) {
    logger.startDataType(type);

    type.setAgency(this.agency);

    await type.parse();

    if (!this.options.dry) {
      logger.startSave();
      await type.save(this.agency);
    }

    logger.endDataType(type);
  }

  async import() {
    const types = importTypes(this.options.type);

    for (let type of types) {
      await this.importType(type);
    }
  }

  async start() {
    try {
      this.agency = await data.getAgency(this.options.agency);
    } catch(e) { throw e; }

    logger.startImport(this.agency);

    await this.import();

    logger.endImport(this.agency);
  }
}

module.exports = Importer;
