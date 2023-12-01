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
  let steps;
  let boardWidth = 0;

  for await (const line of line_reader) {
    if (line.length > 0) {
      if (line[0] === ' ' || line[0] === '.' || line[0] === '#') {
        board.push(line.split(''));
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

  let currentFacing = 0;
  let currentRow = 0;
  let currentCol = board[0].indexOf('.');

  for (const step of steps) {
    if (step === 'R') {
      currentFacing = (currentFacing + 1) % 4;
    } else if (step === 'L') {
      currentFacing = currentFacing === 0 ? 3 : currentFacing - 1;
    } else {
      for (let i = 0; i < step; ++i) {
        if (currentFacing === 0) {
          let nextCol = currentCol + 1;
          if (nextCol == board[currentRow].length) {
            nextCol = firstInRow[currentRow];
          }
          if (board[currentRow][nextCol] === '#') {
            break;
          }
          currentCol = nextCol;
        }
        if (currentFacing === 2) {
          let nextCol = currentCol - 1;
          if (nextCol < firstInRow[currentRow]) {
            nextCol = lastInRow[currentRow];
          }
          if (board[currentRow][nextCol] === '#') {
            break;
          }
          currentCol = nextCol;
        }
        if (currentFacing === 1) {
          let nextRow = currentRow + 1;
          if (nextRow > lastInCol[currentCol]) {
            nextRow = firstInCol[currentCol];
          }
          if (board[nextRow][currentCol] === '#') {
            break;
          }
          currentRow = nextRow;
        }
        if (currentFacing === 3) {
          let nextRow = currentRow - 1;
          if (nextRow < firstInCol[currentCol]) {
            nextRow = lastInCol[currentCol];
          }
          if (board[nextRow][currentCol] === '#') {
            break;
          }
          currentRow = nextRow;
        }
      }
    }
  }
  
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
}