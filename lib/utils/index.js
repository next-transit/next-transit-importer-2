const fs = require('fs');

const getConfig = () => {
  let columns = {};
  let local = {};

  if(fs.existsSync(`${__dirname}/../../config/local.json`)) {
    local = require('../../config/local.json');
  }

  if(fs.existsSync(`${__dirname}/../../config/columns.json`)) {
    columns = require('../../config/columns.json');
  }

  const config = {
    ...local,
    columns,
  };

  return config;
};

module.exports = {
  getConfig
};
