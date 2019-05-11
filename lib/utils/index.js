const fs = require('fs');

const getConfig = () => {
  let config = {
    columns: {}
  };
  let local = {};

  if(fs.existsSync(`${__dirname}/../../config/local.json`)) {
    local = require('../../config/local.json');
  }

  if(fs.existsSync(`${__dirname}/../../config/columns.json`)) {
    config.columns = require('../../config/columns.json');
  }

  config.databaseUrl = process.env.DATABASE_URL || local.database_url;

  return config;
};

module.exports = {
  getConfig
};
