const { deleteImport, importData } = require('../../data');
const logger = require('../../logger');

async function save(type) {
  const { agency, columns, modelName, truncate, writePath } = type;

  if (truncate) {
    await deleteImport(modelName, agency.id, writePath, columns);
  } else {
    await importData(modelName, writePath, columns);
  }
}

module.exports = {
  save
};
