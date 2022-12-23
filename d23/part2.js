const fs = require('fs');
const readline = require('readline');

const INPUT_FILE = 'in1';

async function processLineByLine() {
  const fileStream = fs.createReadStream(INPUT_FILE);

  const line_reader = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const lines = [];
  for await (const line of line_reader) {
    lines.push(line.split('').map(x => x === '#' ? 1 : 0));
  }

  const elves = [];
  let occupied = new Set();
  for (let i = 0; i < lines.length; ++i) {
    for (let j = 0; j < lines[i].length; ++j) {
      if (lines[i][j]) {
        elves.push(new Elf(i, j));
        occupied.add(convertCoords(i, j));
      }
    }
  }

  const dirs = [3, 1, 2, 0];

  let moves = 0;
  while (true) {
    // console.log(10 - movesLeft);
    // console.log(elves);
    // draw(elves);
    
    let candidates = new Map();
    for (let i = 0; i < elves.length; ++i) {
      const elf = elves[i];
      if (!occupied.has(convertCoords(elf.row - 1, elf.col - 1))
        && !occupied.has(convertCoords(elf.row - 1, elf.col))
        && !occupied.has(convertCoords(elf.row - 1, elf.col + 1))
        && !occupied.has(convertCoords(elf.row, elf.col + 1))
        && !occupied.has(convertCoords(elf.row + 1, elf.col + 1))
        && !occupied.has(convertCoords(elf.row + 1, elf.col))
        && !occupied.has(convertCoords(elf.row + 1, elf.col - 1))
        && !occupied.has(convertCoords(elf.row, elf.col - 1))
      ) {
        elf.nextRow = elf.row;
        elf.nextCol = elf.col;
        continue;
      }

      for (const dir of dirs) {
        if (dir === 3) {
          if (!occupied.has(convertCoords(elf.row - 1, elf.col - 1))
            && !occupied.has(convertCoords(elf.row - 1, elf.col))
            && !occupied.has(convertCoords(elf.row - 1, elf.col + 1))
          ) {
            elf.nextRow = elf.row - 1;
            elf.nextCol = elf.col;
            break;
          }
        }
        if (dir === 1) {
          if (!occupied.has(convertCoords(elf.row + 1, elf.col - 1))
            && !occupied.has(convertCoords(elf.row + 1, elf.col))
            && !occupied.has(convertCoords(elf.row + 1, elf.col + 1))
          ) {
            elf.nextRow = elf.row + 1;
            elf.nextCol = elf.col;
            break;
          }
        }
        if (dir === 2) {
          if (!occupied.has(convertCoords(elf.row - 1, elf.col - 1))
            && !occupied.has(convertCoords(elf.row, elf.col - 1))
            && !occupied.has(convertCoords(elf.row + 1, elf.col - 1))
          ) {
            elf.nextRow = elf.row;
            elf.nextCol = elf.col - 1;
            break;
          }
        }
        if (dir === 0) {
          if (!occupied.has(convertCoords(elf.row - 1, elf.col + 1))
            && !occupied.has(convertCoords(elf.row, elf.col + 1))
            && !occupied.has(convertCoords(elf.row + 1, elf.col + 1))
          ) {
            elf.nextRow = elf.row;
            elf.nextCol = elf.col + 1;
            break;
          }
        }
      }

      if (elf.row !== elf.nextRow || elf.col !== elf.nextCol) {
        const coords = convertCoords(elf.nextRow, elf.nextCol);
        const retrieved = candidates.get(coords);
        if (retrieved) {
          candidates.set(coords, retrieved + 1);
        } else {
          candidates.set(coords, 1);
        }
      }
    }

    if (candidates.size === 0) {
      break;
    }

    for (const elf of elves) {
      if (elf.row !== elf.nextRow || elf.col !== elf.nextCol) {
        if (candidates.get(convertCoords(elf.nextRow, elf.nextCol)) === 1) {
          elf.row = elf.nextRow;
          elf.col = elf.nextCol;
        } else {
          elf.nextRow = elf.row;
          elf.nextCol = elf.col;
        }
      }
    }

    occupied = new Set();
    for (const elf of elves) {
      occupied.add(convertCoords(elf.row, elf.col));
    }

    dirs.push(dirs.shift());
    moves++;
  }

  let minI = minJ = Infinity;
  let maxI = maxJ = 0;
  for (const elf of elves) {
    if (elf.row < minI) {
      minI = elf.row;
    }
    if (elf.col < minJ) {
      minJ = elf.col;
    }
    if (elf.row > maxI) {
      maxI = elf.row;
    }
    if (elf.col > maxJ) {
      maxJ = elf.col;
    }
  }

  // console.log(elves);
  draw(elves);
  console.log(moves + 1);
}

processLineByLine();

function Elf(row, col) {
  this.row = row;
  this.col = col;
  this.nextRow = row;
  this.nextCol = col;
}

function convertCoords(i, j) {
  return `${i},${j}`;
}

function draw(elves) {
  let minI = minJ = Infinity;
  let maxI = maxJ = 0;
  for (const elf of elves) {
    if (elf.row < minI) {
      minI = elf.row;
    }
    if (elf.col < minJ) {
      minJ = elf.col;
    }
    if (elf.row > maxI) {
      maxI = elf.row;
    }
    if (elf.col > maxJ) {
      maxJ = elf.col;
    }
  }

  const board = []
  for (let i = 0; i < maxI - minI + 1; ++i) {
    board.push(new Array(maxJ - minJ + 1).fill('.'));
  }

  for (const elf of elves) {
    board[elf.row - minI][elf.col - minJ] = '#';
  }

  for (const line of board) {
    console.log(line.join(''));
  }
  console.log();
}

// x < 4051
