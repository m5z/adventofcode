const fs = require('fs');
const readline = require('readline');

function part1(line) {
  if (line === 'A X') {
    return 1 + 3;
  } else if (line === 'A Y') {
    return 2 + 6;
  } else if (line === 'A Z') {
    return 3 + 0;
  } else if (line === 'B X') {
    return 1 + 0;
  } else if (line === 'B Y') {
    return 2 + 3;
  } else if (line === 'B Z') {
    return 3 + 6;
  } else if (line === 'C X') {
    return 1 + 6;
  } else if (line === 'C Y') {
    return 2 + 0;
  } else if (line === 'C Z') {
    return 3 + 3;
  } else {
    console.log("ERROR");
    return -1;
  }
}

function part2(line) {
  if (line === 'A X') {
    return 3 + 0;
  } else if (line === 'A Y') {
    return 1 + 3;
  } else if (line === 'A Z') {
    return 2 + 6;
  } else if (line === 'B X') {
    return 1 + 0;
  } else if (line === 'B Y') {
    return 2 + 3;
  } else if (line === 'B Z') {
    return 3 + 6;
  } else if (line === 'C X') {
    return 2 + 0;
  } else if (line === 'C Y') {
    return 3 + 3;
  } else if (line === 'C Z') {
    return 1 + 6;
  } else {
    console.log("ERROR");
    return -1;
  }
}

async function processLineByLine() {
  const fileStream = fs.createReadStream('in1');

  const lines = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  score = 0;
  for await (const line of lines) {
    currentScore = part2(line);
    if (currentScore !== -1) {
      score += currentScore;
    }
  }

  console.log(score);
}

processLineByLine();