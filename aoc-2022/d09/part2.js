const fs = require('fs');
const readline = require('readline');

function updateRope(ropeCoords, tailVisited) {
  for (let i = 1; i < ropeCoords.length; ++i) {
    if (Math.abs(ropeCoords[i][0] - ropeCoords[i - 1][0]) > 1) {
      ropeCoords[i][1] += Math.sign(ropeCoords[i - 1][1] - ropeCoords[i][1]);
      ropeCoords[i][0] += Math.sign(ropeCoords[i - 1][0] - ropeCoords[i][0]);
    } else if (Math.abs(ropeCoords[i][1] - ropeCoords[i - 1][1]) > 1) {
      ropeCoords[i][0] += Math.sign(ropeCoords[i - 1][0] - ropeCoords[i][0]);
      ropeCoords[i][1] += Math.sign(ropeCoords[i - 1][1] - ropeCoords[i][1]);
    }
  }
  tailVisited.add(`${ropeCoords[ropeCoords.length - 1][0]},${ropeCoords[ropeCoords.length - 1][1]}`);
  // printRope(ropeCoords);
}

function printRope(ropeCoords) {
  let minI = minJ = maxI = maxJ = 0;
  for (let [i, j] of ropeCoords) {
    if (i < minI) {
      minI = i;
    } else if (i > maxI) {
      maxI = i;
    }
    if (j < minJ) {
      minJ = j;
    } else if (j > maxJ) {
      maxJ = j;
    }
  }

  const grid = [];
  for (let i = 0; i < maxI - minI + 1; ++i) {
    grid.push(Array(maxJ - minJ + 1).fill(0));
  }
  
  for (let [i, j] of ropeCoords) {
    grid[i - minI][j - minJ] = 1;
  }

  for (let row of grid) {
    console.log(row.join(''));
  }
  console.log('');
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
    // console.log(move);
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
  
  console.log(tailVisited.size);
}

processLineByLine();
