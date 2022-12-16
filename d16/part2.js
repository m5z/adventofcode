const fs = require('fs');
const readline = require('readline');

const INPUT_FILE = 'in1';

const MIN = 0;
const MAX = 4000000;

async function processLineByLine() {
  const fileStream = fs.createReadStream(INPUT_FILE);

  const line_reader = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const sensors = [];
  const beacons = [];
  for await (const line of line_reader) {
    const split = line.split('=');
    sensors.push([+split[1].split(',')[0], +split[2].split(':')[0]]);
    beacons.push([+split[3].split(',')[0], +split[4]]);
  }

  const checkedRanges = new Array(MAX + 1);
  for (let i = 0; i < checkedRanges.length; ++i) {
    checkedRanges[i] = [];
  }

  for (let i = 0; i < sensors.length; ++i) {
    const reach = Math.abs(sensors[i][0] - beacons[i][0]) + Math.abs(sensors[i][1] - beacons[i][1]);
    
    for (let y = MIN; y <= MAX; ++y) {
      const verticalDiff = Math.abs(sensors[i][1] - y);
      if (verticalDiff <= reach) {
        if (!checkedRanges[y]) {
          checkedRanges[y] = [];
        }
        checkedRanges[y].push([sensors[i][0] - (reach - verticalDiff), sensors[i][0] + (reach - verticalDiff)]);
      }
    }
  }

  for (let i = 0; i <= MAX; ++i) {
    const mergedRanges = mergeRanges(checkedRanges[i]);

    if (mergedRanges.length !== 1) {
      console.log((mergedRanges[0][1] + 1)* 4000000 + i);
      return;
    }
  }
}

processLineByLine();

function mergeRanges(ranges) {
  const stack = [];

  ranges.sort((a, b) => a[0] - b[0]);

  stack.push(ranges[0]);
  for (const range of ranges.slice(1)) {
    const top = stack[stack.length - 1];
    if (top[1] + 1 < range[0]) {
      stack.push(range);
    } else if (top[1] < range[1]) {
      top[1] = range[1];
    }
  }
  
  return stack;
}
