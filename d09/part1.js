const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('in0');

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

  // let i = 0, minI = 0, maxI = 0, j = 0, minJ = 0, maxJ = 0;
  // for (const move of moves) {
  //   if (move[0] === 'D') {
  //     i += move[1];
  //   } else if (move[0] === 'U') {
  //     i -= move[1];
  //   } else if (move[0] === 'R') {
  //     j += move[1];
  //   } else if (move[0] === 'L') {
  //     j -= move[1];
  //   }

  //   if (i < minI) {
  //     minI = i;
  //   }
  //   if (i > maxI) {
  //     maxI = i;
  //   }
  //   if (j < minJ) {
  //     minJ = j;
  //   }
  //   if (j > maxJ) {
  //     maxJ = j;
  //   }
  // }

  // const grid = []
  // for (let i = 0; i < maxI - minI + 1; ++i) {
  //   grid.push(Array(maxJ - minJ + 1).fill(0));
  // }

  // console.log(minI, maxI, minJ, maxJ);
  // console.log(grid);

  // let hi = ti = -minI, hj = tj = -minJ;

  const grid = new Map();
  let hi = ti = 0, hj = tj = 0;

  for (const move of moves) {
    if (move[0] === 'D') {
      for (let k = 0; k < move[1]; ++k) {
        ++hi;
        if (Math.abs(hi - ti) + Math.abs(hj - tj) > 1) {
          ti = hi - 1;
          // tj = hj;
        }
        grid.set([ti, tj], 1)
      }
    } else if (move[0] === 'U') {
      for (let k = 0; k < move[1]; ++k) {
        --hi;
        if (Math.abs(hi - ti) + Math.abs(hj - tj) > 1) {
          ti = hi + 1;
          // tj = hj;
        }
        grid.set([ti, tj], 1)
      }
    } else if (move[0] === 'R') {
      for (let k = 0; k < move[1]; ++k) {
        ++hj;
        if (Math.abs(hi - ti) + Math.abs(hj - tj) > 1) {
          // ti = hi;
          tj = hj - 1;
        }
        grid.set([ti, tj], 1)
      }
    } else if (move[0] === 'L') {
      for (let k = 0; k < move[1]; ++k) {
        --hj;
        if (Math.abs(hi - ti) + Math.abs(hj - tj) > 1) {
          // ti = hi;
          tj = hj + 1;
        }
        grid.set([ti, tj], 1)
      }
    }
    console.log(move, ti, tj);
  }

  console.log(grid);
}

processLineByLine();
