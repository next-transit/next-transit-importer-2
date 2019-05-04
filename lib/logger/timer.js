const timers = {};

const time = label => {
  timers[label] = new Date();
};

const timeDiff = label => {
  const now = new Date();
  const start = timers[label];
  return now.getTime() - start.getTime();
};

const timeEnd = label => {
  const diff = timeDiff(label);
  timers[label] = null;
  return diff;
};

const format = ms => {
  let seconds = ms / 1000;
  let hours = 0;
  let minutes = 0;

  if (seconds > 1) {
    seconds = Math.floor(seconds);
  }
  if (seconds > 59) {
    minutes = Math.floor(seconds / 60);
    seconds = seconds - (minutes * 60);
  }

  if (minutes > 59) {
    hours = Math.floor(minutes / 60);
    minutes = minutes - (hours * 60);
  }

  hours = hours > 0 ? `${hours}h ` : '';
  minutes = minutes > 0 ? `${minutes}m ` : '';
  seconds = `${seconds}s`;

  return `${hours}${minutes}${seconds}`;
};

module.exports = {
  format,
  time,
  timeDiff,
  timeEnd
};
