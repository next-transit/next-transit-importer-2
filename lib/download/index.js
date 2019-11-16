module.exports = options => {
  let agencyDownloader;

  try {
    agencyDownloader = require(`../agencies/${options.agency}/download`);
  }
  catch (e) {
    console.error(`Error loading ${options.agency} downloader`);
  }

  agencyDownloader.download();
};