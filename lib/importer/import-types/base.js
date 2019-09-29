const data = require('../../data');
const logger = require('../../logger');
const config = require('../../utils').getConfig();

const importers = require('../importers');
const database = require('./database');

const GTFS_BASE_PATH = `${process.env.PWD}/data/gtfs`;

class BaseType {
  constructor(id, title, type, importerType) {
    this.id = id;
    this.title = title;
    this.type = type;
    this.importer = importers[importerType];
    this.parsed = null;
    this.basePath = GTFS_BASE_PATH;
    this.columns = this.columns();
    this.columnsMap = this.columns.reduce((map, c) => ({ ...map, [c]:c }), {});

    this.data = data;
    this.logger = logger;
  }

  columns() {
    const columns = config.columns[this.type] || [];

    return [
      ...columns,
      'created_at',
      'updated_at',
      'agency_id'
    ];
  }

  setAgency(agency) {
    this.agency = agency;
    this.agencyPath = `${this.basePath}/${this.agency.slug}`;
    this.writePath = `${this.agencyPath}/stage/${this.type}.txt`;
  }

  async parse() {
    await this.importer.parse(this);
  }

  async save() {
    const save = this.importer.save || database.save;

    logger.time(`${this.id}-save`);
    try {
      await save(this);
    } catch (e) {
      return logger.fatalError(e);
    }

    logger.endSave(this);
  }
}

module.exports = BaseType;
