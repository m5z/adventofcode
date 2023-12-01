const fs = require('fs');
const readline = require('readline');

const INPUT_FILE = 'in1';
const TARGET_Y = 2000000;

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

  const checkedRanges = [];
  const beaconsInLine = new Set();
  for (let i = 0; i < sensors.length; ++i) {
    const reach = Math.abs(sensors[i][0] - beacons[i][0]) + Math.abs(sensors[i][1] - beacons[i][1]);
    
    const verticalDiff = Math.abs(sensors[i][1] - TARGET_Y);
    if (verticalDiff <= reach) {
      checkedRanges.push([sensors[i][0] - (reach - verticalDiff), sensors[i][0] + (reach - verticalDiff)]);
    }

    if (beacons[i][1] == TARGET_Y) {
      beaconsInLine.add(beacons[i][0]);
    }
  }

  const mergedRanges = mergeRanges(checkedRanges);

  let scannedFields = 0;
  for (const range of mergedRanges) {
    scannedFields += range[1] - range[0];
  }

  console.log(scannedFields + 1 - beaconsInLine.size);
}

processLineByLine();

function mergeRanges(ranges) {
  const stack = [];

  ranges.sort((a, b) => a[0] - b[0]);

  stack.push(ranges[0]);
  for (const range of ranges.slice(1)) {
    const top = stack[stack.length - 1];
    if (top[1] < range[0]) {
      stack.push(range);
    } else if (top[1] < range[1]) {
      top[1] = range[1];
    }
  }
  
  return stack;
}