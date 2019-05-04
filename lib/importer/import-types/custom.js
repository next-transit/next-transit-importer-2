const fs = require('fs');
const { Readable } = require('stream');

const stringify = require('csv-stringify');

const BaseType = require('./base');

class CustomType extends BaseType {
  constructor(id, title, type, customType, truncate = true) {
    super(id, title, type, customType);

    this.modelName = type;
    this.customType = customType;
    this.truncate = truncate;
  }

  createWriteStream() {
    if (!this.writeStream) {
      this.writeStream = fs.createWriteStream(
        this.writePath,
        { flags: 'w', autoClose: false }
      );
      this.writeStream.on('close', () => {
        this.writeStream = null;
      });
    }
  }

  async writeData(data) {
    return new Promise((resolve, reject) => {
      this.createWriteStream();

      stringify(data, {
        columns: this.columnsMap,
        delimiter: '\t',
        eof: true
      }, (err, output) => {
        if (err) { return reject(err); }

        this.writeStream.write(output);
        resolve();
      });
    });
  }

  writeClose() {
    if (this.writeStream) {
      this.writeStream.close();
    }
  }

  async parse() {
    this.logger.startCustom(this);
    await super.parse();
    this.logger.endCustom(this);
  }
}

module.exports = CustomType;
