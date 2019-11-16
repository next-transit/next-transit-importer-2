module.exports = options => {
  let agencyUnpacker;

  try {
    agencyUnpacker = require(`../../agencies/${options.agency}/unpack`);
  } catch (e) {
    return console.error(`Error loading ${options.agency} unpacker`, e);
  }

  agencyUnpacker.unpack();
};
  