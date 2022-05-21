module.exports = async options => {
  let agencyDownloader;

  try {
    agencyDownloader = require(`../../agencies/${options.agency}/download`);
  } catch (e) {
    return console.error(`Error loading ${options.agency} downloader`, e);
  }

  await agencyDownloader.download();
};
