const readline = require('readline');

class Logger {
  constructor() {
    this.levels = [];
    this.position = 0;
  }

  _getOrAddLevel(id) {
    let levelIndex = this.levels.findIndex(l => l.id === id);

    if (levelIndex === -1) {
      this.levels.push({ id });
      levelIndex = this.levels.length - 1;
    }

    return levelIndex;
  }

  _goToPosition(levelIndex, content) {
    levelIndex = 0 - levelIndex;
    const pos = this.position;
    const change = levelIndex - this.position;
    this.position = this.position + change;
    // console.log(`print to`, levelIndex, `${pos} -> ${change} -> ${this.position}`, content);
    process.stdout.moveCursor(0, change);
  }

  _write(content, levelIndex) {
    this._goToPosition(levelIndex, content);
    process.stdout.clearLine();
    process.stdout.write(content);
  }

  writeLine(content) {
    this._write(`${content}\n`, this.levels.length);
  }

  writeStatic(content, levelId) {
    let levelIndex = this.levels.length;

    if (levelId) {
      levelIndex = this._getOrAddLevel(levelId);
    }

    this._write(`${content}\r`, levelIndex);
  }
}

module.exports = Logger;
