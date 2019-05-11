const ps = process.stdout;

class Writer {
  constructor() {
    this.staticLines = [];
    this.staticCount = 0;
  }

  _getStaticIndex(label) {
    let index = this.staticLines.findIndex(line => line.label === label);

    if (index === -1) {
      this.staticLines.unshift({ label });
      index = 0;
    }

    return index;
  }

  _writeStatics() {
    this.staticLines.forEach((line, i) => {
      if (i) { ps.write('\n'); }
      ps.clearLine();
      ps.write(`${line.text}\r`);
    });

    this.staticCount = this.staticLines.length;
  }

  clearStatic(label) {
    const index = this._getStaticIndex(label);

    if (index > -1) {
      this.staticLines[index].text = '';
      this.flush();
      this.staticLines.splice(index, 1);
      this.flush();
    }
  }

  flush(text) {
    if (this.staticCount > 1) {
      ps.moveCursor(0, 1 - this.staticCount);
    }

    if (text) {
      const parts = text.split('\n');

      parts.forEach((t, i) => {
        ps.clearLine();
        ps.write(`${t}`);
        if (i < parts.length - 1) {
          ps.write('\n');
        }
      });
    }

    this._writeStatics();
  }

  writeLine(text) {
    this.flush(`${text}\n`);
  }

  writeStatic(text, label) {
    const index = this._getStaticIndex(label);
    this.staticLines[index].text = text;
    this.flush();
  }
}

module.exports = Writer;
