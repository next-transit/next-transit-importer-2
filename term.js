const { terminal, TextBuffer } = require('terminal-kit');

const buffer = new TextBuffer({ dst: terminal, height: 1 });

terminal('Hello\n\n');

// const progress = terminal.progressBar({
//   width: 120,
//   title: 'Some progress...',
//   percent: true
// });

let val = 0;
setInterval(() => {
  val += 0.2;
  buffer.setText(val.toString());
  // progress.update(val);
}, 800);

terminal('Hello 2\n\n');

setTimeout(() => {
  terminal('\n');
  process.exit(0);
}, 5000);
