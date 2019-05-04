const loggerOptions = options => {
  if (typeof options === 'string') {
    options = { message: options };
  }
  options = {
    char: '*',
    level: 0,
    data: {},
    ...options
  };

  options.tab = '';
  while(options.level--) {
    options.tab += '    ';
  }

  const { data, message } = options;

  Object.keys(data).forEach(key => {
    options.message = options.message.replace(`{${key}}`, `[${data[key]}]`);
  });

  return options;
};

module.exports = loggerOptions;
