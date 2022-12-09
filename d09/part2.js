const fs = require('fs');
const readline = require('readline');

function updateRope(ropeCoords, tailVisited) {
  for (let i = 1; i < ropeCoords.length; ++i) {
    if (Math.abs(ropeCoords[i][0] - ropeCoords[i - 1][0]) == 2) {
      if (Math.abs(ropeCoords[i][1] - ropeCoords[i - 1][1]) == 1) {
        ropeCoords[i][1] = ropeCoords[i - 1][1];
      }
      ropeCoords[i][0] += (ropeCoords[i - 1][0] - ropeCoords[i][0]) / 2;
    } else if (Math.abs(ropeCoords[i][1] - ropeCoords[i - 1][1]) == 2) {
      if (Math.abs(ropeCoords[i][0] - ropeCoords[i - 1][0]) == 1) {
        ropeCoords[i][0] = ropeCoords[i - 1][0];
      }
      ropeCoords[i][1] += (ropeCoords[i - 1][1] - ropeCoords[i][1]) / 2;
    }
  }
  tailVisited.add(`${ropeCoords[ropeCoords.length - 1][0]},${ropeCoords[ropeCoords.length - 1][1]}`);
}

async function processLineByLine() {
  const fileStream = fs.createReadStream('in1');

  const lines = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let moves = [];
  for await (const line of lines) {
    const split = line.split(' ');
    const direction = split[0];
    const steps = +split[1];

    moves.push([direction, steps]);
  }

  const ROPE_LENGTH = 10;

  const tailVisited = new Set();
  
  const ropeCoords = [];
  for (let i = 0; i < ROPE_LENGTH; ++i) {
    ropeCoords.push([0, 0]);
  }

  tailVisited.add('0,0');
  for (const move of moves) {
    if (move[0] === 'D') {
      for (let step = 0; step < move[1]; ++step) {
        ++ropeCoords[0][0];
        updateRope(ropeCoords, tailVisited);
      }
    } else if (move[0] === 'U') {
      for (let step = 0; step < move[1]; ++step) {
        --ropeCoords[0][0];
        updateRope(ropeCoords, tailVisited);
      }
    } else if (move[0] === 'R') {
      for (let step = 0; step < move[1]; ++step) {
        ++ropeCoords[0][1];
        updateRope(ropeCoords, tailVisited);
      }
    } else if (move[0] === 'L') {
      for (let step = 0; step < move[1]; ++step) {
        --ropeCoords[0][1];
        updateRope(ropeCoords, tailVisited);
      }
    }
  }
  
  console.log(tailVisited);
  console.log(tailVisited.size);
}

processLineByLine();
