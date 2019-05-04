const Logger = require('./console_logger');
const logger = new Logger();

let count = 10;
const items = [];
let progress = '';

async function wait(item) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      printItem(item, item - 1);
      resolve();
    }, 1000);
  });
}

while(count--) {
  items.push(count);
}

async function printItems() {
  logger.writeStatic(`[]`, 'progress');
  for(let item in items) {
    await wait(item);
  } 
}

// ############################
function printItem(item, prev) {
  logger.writeLine(`Finished item ${prev}`);
  logger.writeStatic(`Writing ${item}`, 'writing');
  progress += '#';
  logger.writeStatic(`[${progress}]`, 'progress');
}

printItems().then(() => {
  process.stdout.clearLine();
  logger.writeLine(`Done.\n`);

  process.exit(0);  
});
