const fs = require('fs');
const readline = require('readline');

const INPUT_FILE = 'in1';

async function processLineByLine() {
  const fileStream = fs.createReadStream(INPUT_FILE);

  const line_reader = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const board = [];
  const boardWithPath = [];
  let steps;
  let boardWidth = 0;

  for await (const line of line_reader) {
    if (line.length > 0) {
      if (line[0] === ' ' || line[0] === '.' || line[0] === '#') {
        board.push(line.split(''));
        boardWithPath.push(line.split(''));
        if (line.length > boardWidth) {
          boardWidth = line.length;
        }
      } else {
        steps = lineToSteps(line);
      }
    }
  }

  const firstInRow = new Array(board.length).fill(Infinity)
  const lastInRow = new Array(board.length).fill(0)
  const firstInCol = new Array(boardWidth).fill(Infinity);
  const lastInCol = new Array(boardWidth).fill(0);
  for (let i = 0; i < board.length; ++i) {
    for (let j = 0; j < board[i].length; ++j) {
      if (board[i][j] !== ' ') {
        if (j < firstInRow[i]) {
          firstInRow[i] = j;
        }
        if (j > lastInRow[i]) {
          lastInRow[i] = j;
        }
        if (i < firstInCol[j]) {
          firstInCol[j] = i;
        }
        if (i > lastInCol[j]) {
          lastInCol[j] = i;
        }
      }
    }
  }

  const [horizontalWarping, verticalWarping] = createWarping(INPUT_FILE);

  let currentRow = 0;
  let currentCol = board[0].indexOf('.');
  let currentFacing = 0;
  let nextRow, nextCol, nextFacing;

  for (const step of steps) {
    if (step === 'R') {
      currentFacing = (currentFacing + 1) % 4;
    } else if (step === 'L') {
      currentFacing = currentFacing === 0 ? 3 : currentFacing - 1;
    } else {
      markOnBoard(boardWithPath, currentRow, currentCol, currentFacing);
      for (let i = 0; i < step; ++i) {
        nextFacing = currentFacing;
        if (currentFacing === 0) {
          if (currentCol + 1 > lastInRow[currentRow]) {
            const warp = horizontalWarping[currentRow][currentCol];
            nextRow = warp[0];
            nextCol = warp[1];
            nextFacing = warp[2];
          } else {
            nextRow = currentRow;
            nextCol = currentCol + 1;
          }
        }
        if (currentFacing === 2) {
          if (currentCol - 1 < firstInRow[currentRow]) {
            const warp = horizontalWarping[currentRow][currentCol];
            nextRow = warp[0];
            nextCol = warp[1];
            nextFacing = warp[2];
          } else {
            nextRow = currentRow;
            nextCol = currentCol - 1;
          }
        }
        if (currentFacing === 1) {
          if (currentRow + 1 > lastInCol[currentCol]) {
            const warp = verticalWarping[currentRow][currentCol];
            nextRow = warp[0];
            nextCol = warp[1];
            nextFacing = warp[2];
          } else {
            nextRow = currentRow + 1;
            nextCol = currentCol;
          }
        }
        if (currentFacing === 3) {
          if (currentRow - 1 < firstInCol[currentCol]) {
            const warp = verticalWarping[currentRow][currentCol];
            nextRow = warp[0];
            nextCol = warp[1];
            nextFacing = warp[2];
          } else {
            nextRow = currentRow - 1;
            nextCol = currentCol;
          }
        }
        if (board[nextRow][nextCol] === '#') {
          break;
        }
        currentRow = nextRow;
        currentCol = nextCol;
        
        currentFacing = nextFacing;
        markOnBoard(boardWithPath, currentRow, currentCol, currentFacing);
      }
    }
  }

  // draw(boardWithPath);
  // console.log(currentRow + 1, currentCol + 1, currentFacing);
  console.log(1000 * (currentRow + 1) + 4 * (currentCol + 1) + currentFacing);
}

processLineByLine();

function lineToSteps(line) {
  const directions = []
  const split = line.split('');
  let currentNumber = [];
  for (let i = 0; i < split.length; ++i) {
    if (split[i] !== 'R' && split[i] !== 'L') {
      currentNumber.push(split[i]);
    } else {
      directions.push(+currentNumber.join(''));
      directions.push(split[i]);
      currentNumber = [];
    }
  }
  directions.push(+currentNumber.join(''));
  return directions;
}

function draw(board) {
  for (const line of board) {
    console.log(line.join(''));
  }
  console.log();
}

function markOnBoard(boardWithPath, currentRow, currentCol, currentFacing) {
  if (currentFacing === 0) {
    currentFacing = '>';
  } else if (currentFacing === 1) {
    currentFacing = 'v';
  } else if (currentFacing === 2) {
    currentFacing = '<';
  } else {
    currentFacing = '^';
  }
  boardWithPath[currentRow][currentCol] = currentFacing;
}

function createWarping(input_file) {
  if (input_file === 'in0') {
    return createIn0Warping();
  }
  if (input_file === 'in1') {
    return createIn1Warping();
  }
  throw "Unknown input file"
}

function createIn0Warping() {
  const horizontalWarping = [];
  for (let i = 0; i < 12; ++i) {
    horizontalWarping.push(new Array(16));
  }

  const verticalWarping = [];
  for (let i = 0; i < 12; ++i) {
    verticalWarping.push(new Array(16));
  }

  connect(4, 0, 1, 11, 0, 11, -1, 11, 0, 2, 0, horizontalWarping, horizontalWarping);
  // horizontalWarping[0][11] = [11, 15, 2];
  // horizontalWarping[1][11] = [10, 15, 2];
  // horizontalWarping[2][11] = [9, 15, 2];
  // horizontalWarping[3][11] = [8, 15, 2];
  // horizontalWarping[11][15] = [0, 11, 0];
  // horizontalWarping[10][15] = [1, 11, 0];
  // horizontalWarping[9][15] = [2, 11, 0];
  // horizontalWarping[8][15] = [3, 11, 0];

  connect(4, 4, 1, 11, 0, 8, 0, 15, -1, 1, 3, horizontalWarping, verticalWarping);
  // horizontalWarping[4][11] = [8, 15, 1];
  // horizontalWarping[5][11] = [8, 14, 1];
  // horizontalWarping[6][11] = [8, 13, 1];
  // horizontalWarping[7][11] = [8, 12, 1];
  // verticalWarping[8][15] = [4, 11, 3];
  // verticalWarping[8][14] = [5, 11, 3];
  // verticalWarping[8][13] = [6, 11, 3];
  // verticalWarping[8][12] = [7, 11, 3];

  connect(4, 4, 1, 0, 0, 11, 0, 15, -1, 3, 0, horizontalWarping, verticalWarping);
  // horizontalWarping[4][0] = [11, 15, 3];
  // horizontalWarping[5][0] = [11, 14, 3];
  // horizontalWarping[6][0] = [11, 13, 3];
  // horizontalWarping[7][0] = [11, 12, 3];
  // verticalWarping[11][15] = [4, 0, 0];
  // verticalWarping[11][14] = [5, 0, 0];
  // verticalWarping[11][13] = [6, 0, 0];
  // verticalWarping[11][12] = [7, 0, 0];

  connect(4, 4, 0, 7, -1, 3, -1, 8, 0, 0, 1, verticalWarping, horizontalWarping);
  // verticalWarping[4][7] = [3, 8, 0];
  // verticalWarping[4][6] = [2, 8, 0];
  // verticalWarping[4][5] = [1, 8, 0];
  // verticalWarping[4][4] = [0, 8, 0];
  // horizontalWarping[3][8] = [4, 7, 1];
  // horizontalWarping[2][8] = [4, 6, 1];
  // horizontalWarping[1][8] = [4, 5, 1];
  // horizontalWarping[0][8] = [4, 4, 1];

  connect(4, 7, 0, 7, -1, 8, 1, 8, 0, 0, 3, verticalWarping, horizontalWarping);
  // verticalWarping[7][7] = [8, 8, 0];
  // verticalWarping[7][6] = [9, 8, 0];
  // verticalWarping[7][5] = [10, 8, 0];
  // verticalWarping[7][4] = [11, 8, 0];
  // horizontalWarping[8][8] = [7, 7, 3];
  // horizontalWarping[9][8] = [7, 6, 3];
  // horizontalWarping[10][8] = [7, 5, 3];
  // horizontalWarping[11][8] = [7, 4, 3];

  connect(4, 4, 0, 0, 1, 0, 0, 11, -1, 1, 1, verticalWarping, verticalWarping);
  // verticalWarping[4][0] = [0, 11, 1];
  // verticalWarping[4][1] = [0, 10, 1];
  // verticalWarping[4][2] = [0, 9, 1];
  // verticalWarping[4][3] = [0, 8, 1];
  // verticalWarping[0][11] = [4, 0, 1];
  // verticalWarping[0][10] = [4, 1, 1];
  // verticalWarping[0][9] = [4, 2, 1];
  // verticalWarping[0][8] = [4, 3, 1];

  connect(4, 7, 0, 0, 1, 11, 0, 11, -1, 3, 3, verticalWarping, verticalWarping);
  // verticalWarping[7][0] = [11, 11, 3];
  // verticalWarping[7][1] = [11, 10, 3];
  // verticalWarping[7][2] = [11, 9, 3];
  // verticalWarping[7][3] = [11, 8, 3];
  // verticalWarping[11][11] = [7, 0, 3];
  // verticalWarping[11][10] = [7, 1, 3];
  // verticalWarping[11][9] = [7, 2, 3];
  // verticalWarping[11][8] = [7, 3, 3];

  return [horizontalWarping, verticalWarping];
}

function createIn1Warping() {
  const horizontalWarping = [];
  for (let i = 0; i < 4 * 50; ++i) {
    horizontalWarping.push(new Array(3 * 50));
  }

  const verticalWarping = [];
  for (let i = 0; i < 4 * 50; ++i) {
    verticalWarping.push(new Array(3 * 50));
  }

  connect(50, 50, 1, 50, 0, 100, 0, 0, 1, 1, 0, horizontalWarping, verticalWarping);
  connect(50, 50, 1, 99, 0, 49, 0, 100, 1, 3, 2, horizontalWarping, verticalWarping);
  connect(50, 150, 1, 49, 0, 149, 0, 50, 1, 3, 2, horizontalWarping, verticalWarping);
  connect(50, 0, 1, 50, 0, 149, -1, 0, 0, 0, 0, horizontalWarping, horizontalWarping);
  connect(50, 0, 1, 149, 0, 149, -1, 99, 0, 2, 2, horizontalWarping, horizontalWarping);
  connect(50, 0, 0, 50, 1, 150, 1, 0, 0, 0, 1, verticalWarping, horizontalWarping);
  connect(50, 0, 0, 100, 1, 199, 0, 0, 1, 3, 1, verticalWarping, verticalWarping);

  return [horizontalWarping, verticalWarping];
}

function connect(count, sourceI, deltaSourceI, sourceJ, deltaSourceJ, targetI, deltaTargetI, targetJ, deltaTargetJ, direction, reverseDirection, warping, reverseWarping) {
  while (count > 0) {
    warping[sourceI][sourceJ] = [targetI, targetJ, direction];
    reverseWarping[targetI][targetJ] = [sourceI, sourceJ, reverseDirection];
    sourceI += deltaSourceI;
    sourceJ += deltaSourceJ;
    targetI += deltaTargetI;
    targetJ += deltaTargetJ;
    count--;
  }
}
