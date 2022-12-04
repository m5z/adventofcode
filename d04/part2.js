const fs = require('fs');
const readline = require('readline');

function strToRange(str) {
  const split = str.split('-');
  return [+split[0], +split[1]];
}

function disjoint(range1, range2) {
  if (range1[0] <= range2[0]) {
    return range1[1] < range2[0];
  } 
  return range2[1] < range1[0];
}

async function processLineByLine() {
  const fileStream = fs.createReadStream('in1');

  const lines = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let answer = 0;

  for await (const line of lines) {
    const split = line.split(',');
    const range1 = strToRange(split[0]);
    const range2 = strToRange(split[1]);
    if (!disjoint(range1, range2)) {
        answer++;
      }
  }

  console.log(answer);
}

processLineByLine();
