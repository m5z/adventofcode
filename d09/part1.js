const fs = require('fs');
const readline = require('readline');

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

  const tailVisited = new Set();
  let hi = ti = 0, hj = tj = 0;

  tailVisited.add('0,0');
  for (const move of moves) {
    if (move[0] === 'D') {
      for (let k = 0; k < move[1]; ++k) {
        ++hi;
        if (Math.abs(hi - ti) > 1 || Math.abs(hj - tj) > 1) {
          ti = hi - 1;
          tj = hj;
          tailVisited.add(`${ti},${tj}`);
        }
      }
    } else if (move[0] === 'U') {
      for (let k = 0; k < move[1]; ++k) {
        --hi;
        if (Math.abs(hi - ti) > 1 || Math.abs(hj - tj) > 1) {
          ti = hi + 1;
          tj = hj;
          tailVisited.add(`${ti},${tj}`);
        }
      }
    } else if (move[0] === 'R') {
      for (let k = 0; k < move[1]; ++k) {
        ++hj;
        if (Math.abs(hi - ti) > 1 || Math.abs(hj - tj) > 1) {
          ti = hi;
          tj = hj - 1;
          tailVisited.add(`${ti},${tj}`);
        }
      }
    } else if (move[0] === 'L') {
      for (let k = 0; k < move[1]; ++k) {
        --hj;
        if (Math.abs(hi - ti) > 1 || Math.abs(hj - tj) > 1) {
          ti = hi;
          tj = hj + 1;
          tailVisited.add(`${ti},${tj}`);
        }
      }
    }
    // console.log(move, ti, tj);
    // console.log(tailVisited);
  }

  console.log(tailVisited.size);
}

processLineByLine();
