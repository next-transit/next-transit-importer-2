const logger = require('../../logger');

const create = require('./create');
const destroy = require('./destroy');
const promote = require('./promote');
const restore = require('./restore');

function publish(options) {
  return new Promise((resolve, reject) => {
    // const runAll = !!options.create && !!options.restore && !!options.promote && !!options.delete;

    // Store things at runtime that may need to be shared across different actions
    options.state = {};

    // if (runAll) {
    //   logger.marquee('Publish database');
    // }

    if (options.create) {
      create().then(info => {
        options.state.databaseInfo = info;
        logger.statement({ message: 'Done', level: 1 });
        resolve();
      }).catch(err => {
        console.error(err);
        // logger.warning(err);
        reject();
      });
    }

    if (options.restore) {
      restore(options).then(() => {
        logger.statement({ message: 'Done', level: 1 });
        resolve();
      }).catch(err => {
        console.error(err);
        // logger.warning(err);
        reject();
      });
    }

    if (options.promote) {
      promote(options).then(() => {
        logger.statement({ message: 'Done', level: 1 });
        resolve();
      }).catch(err => {
        console.error(err);
        // logger.warning(err);
        reject();
      });
    }

    if (options.delete) {
      destroy().then(() => {
        logger.statement({ message: 'Done', level: 1 });
        resolve();
      }).catch(err => {
        console.error(err);
        // logger.warning(err);
        reject();
      });
    }
  });
}

module.exports = publish;
