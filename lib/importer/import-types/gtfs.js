const BaseType = require('./base');

class GtfsType extends BaseType {
  constructor(id, title, fileName, modelName, truncate = true) {
    super(id, title, fileName, 'gtfs');

    this.fileName = fileName;
    this.modelName = modelName || fileName;
    this.truncate = truncate;
  }
}

module.exports = GtfsType;
