const noop = record => record;

const transformers = {};

const getAgencyTypes = agency => {
  let transformer = transformers[agency.slug];

  if (!transformer) {
    try {
      transformer = require(`${process.env.PWD}/lib/agencies/${agency.slug}/transforms`);
    } catch(e) {
      transformer = {};
    }

    transformers[agency.slug] = transformer;
  }
  
  return transformer;
};

const getTransformer = (agency, type) => {
  const agencyTypes = getAgencyTypes(agency);
  return agencyTypes[type] || noop;
};

module.exports = getTransformer;
