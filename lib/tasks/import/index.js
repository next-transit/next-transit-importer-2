const Importer = require('../../importer');

module.exports = async options => {
  const importer = new Importer(options);
  await importer.start();
};
