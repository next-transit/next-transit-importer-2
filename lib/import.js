const Importer = require('./importer');

async function start(options) {
  const importer = new Importer(options);

  let result;

  try {
    await importer.start();
  } catch(e) {
    console.error(e);
    process.exit(1);
  }

  process.exit(0);
}

module.exports = {
  start
};
