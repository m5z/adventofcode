const fs = require('fs');
const readline = require('readline');

const INPUT_FILE = 'in1';

async function processLineByLine() {
  const fileStream = fs.createReadStream(INPUT_FILE);

  const line_reader = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const inputLines = [];
  for await (const line of line_reader) {
    inputLines.push(line);
  }
  
  const blizzards = getBlizzards(inputLines);
  const boards = getBoards(inputLines, blizzards);

  const startPosI = 0;
  const startPosJ = 1;
  const startMinutes = 0;

  const finishPosI = inputLines.length - 1;
  const finishPosJ = inputLines[0].length - 2;

  const bestTime1 = calculateBestTime(boards, startPosI, startPosJ, startMinutes, finishPosI, finishPosJ);
  const bestTime2 = calculateBestTime(boards, finishPosI, finishPosJ, bestTime1, startPosI, startPosJ);
  const bestTime3 = calculateBestTime(boards, startPosI, startPosJ, bestTime2, finishPosI, finishPosJ);

  // console.log(bestTime1);
  // console.log(bestTime2);
  console.log(bestTime3);
}

processLineByLine();

function calculateBestTime(boards, startPosI, startPosJ, startMinutes, finishPosI, finishPosJ) {
  const bestTimes = getBestTimes(boards);

  const stack = [[startPosI, startPosJ, startMinutes]];
  while (stack.length > 0) {
    const [posI, posJ, minutes] = stack.shift();

    const boardId = (minutes + 1) % boards.length;
    if (posI - 1 >= 0 && !boards[boardId][posI - 1][posJ] && minutes + 1 < bestTimes[boardId][posI - 1][posJ]) {
      stack.push([posI - 1, posJ, minutes + 1]);
      bestTimes[boardId][posI - 1][posJ] = minutes + 1;
    }
    if (posI + 1 < boards[boardId].length && !boards[boardId][posI + 1][posJ] && minutes + 1 < bestTimes[boardId][posI + 1][posJ]) {
      stack.push([posI + 1, posJ, minutes + 1]);
      bestTimes[boardId][posI + 1][posJ] = minutes + 1;
    }
    if (!boards[boardId][posI][posJ - 1] && minutes + 1 < bestTimes[boardId][posI][posJ - 1]) {
      stack.push([posI, posJ - 1, minutes + 1]);
      bestTimes[boardId][posI][posJ - 1] = minutes + 1;
    }
    if (!boards[boardId][posI][posJ + 1] && minutes + 1 < bestTimes[boardId][posI][posJ + 1]) {
      stack.push([posI, posJ + 1, minutes + 1]);
      bestTimes[boardId][posI + 1][posJ] = minutes + 1;
    }

    if (!boards[boardId][posI][posJ] && minutes + 1 < bestTimes[boardId][posI][posJ]) {
      stack.push([posI, posJ, minutes + 1]);
      bestTimes[boardId][posI][posJ] = minutes + 1;
    } else {
      continue;
    }
  }

  let bestTime = Infinity;
  for (const bestTimesForBoard of bestTimes) {
    if (bestTimesForBoard[finishPosI][finishPosJ] < bestTime) {
      bestTime = bestTimesForBoard[finishPosI][finishPosJ];
    }
  }
  // for (const bestTimesForBoard of bestTimes) {
  //   for (const line of bestTimesForBoard) {
  //     console.log(line.map(n => n === Infinity ? '  ' : `${n}`.padStart(2, '0')).join(', '));
  //   }
  //   console.log();
  // }
  // console.log(bestTime);
  return bestTime;
}

function getBlizzards(inputLines) {
  const blizzards = [];
  for (let i = 0; i < inputLines.length; ++i) {
    for (let j = 0; j < inputLines[i].length; ++j) {
      const char = inputLines[i][j];
      if (char === '>') {
        blizzards.push(new Blizzard(0, 1, i, j));
      }
      if (char === 'v') {
        blizzards.push(new Blizzard(1, 0, i, j));
      }
      if (char === '<') {
        blizzards.push(new Blizzard(0, -1, i, j));
      }
      if (char === '^') {
        blizzards.push(new Blizzard(-1, 0, i, j));
      }
    }
  }
  return blizzards;
}

function getBoards(inputLines, blizzards) {
  const boardTemplate = [];
  for (let i = 0; i < inputLines.length; ++i) {
    boardTemplate.push([]);
    for (let j = 0; j < inputLines[i].length; ++j) {
      boardTemplate[i].push(inputLines[i][j] === '#' ? 1 : 0);
    }
  }

  const initialFingerprint = blizzardsFingerprint(blizzards);
  let currentBoard = copyBoard(boardTemplate);
  for (const blizzard of blizzards) {
    currentBoard[blizzard.posI][blizzard.posJ] = 1;
  }
  const boards = [currentBoard];

  while (true) {
    for (const blizzard of blizzards) {
      blizzard.posI += blizzard.dirI;
      blizzard.posJ += blizzard.dirJ;

      if (blizzard.posI === 0) {
        blizzard.posI = boardTemplate.length - 2;
      }
      if (blizzard.posI === boardTemplate.length - 1) {
        blizzard.posI = 1;
      }
      if (blizzard.posJ === 0) {
        blizzard.posJ = boardTemplate[0].length - 2;
      }
      if (blizzard.posJ === boardTemplate[0].length - 1) {
        blizzard.posJ = 1;
      }
    }

    if (blizzardsFingerprint(blizzards) === initialFingerprint) {
      break;
    }

    currentBoard = copyBoard(boardTemplate);
    for (const blizzard of blizzards) {
      currentBoard[blizzard.posI][blizzard.posJ] = 1;
    }
    boards.push(currentBoard);
  }

  return boards;
}

function getBestTimes(boards) {
  return boards.map(board => board.map(line => new Array(line.length).fill(Infinity)));
}

function copyBoard(board) {
  return board.map(line => [...line]);
}

function blizzardsFingerprint(blizzards) {
  return blizzards.map(blizzard => `(${blizzard.dirI}, ${blizzard.dirJ}, ${blizzard.posI}, ${blizzard.posJ})`).join(', ');
}

function draw(board) {
  for (const line of board) {
    console.log(line.map(char => char ? '#' : '.').join(''));
  }
  console.log();
}

function Blizzard(dirI, dirJ, posI, posJ) {
  this.dirI = dirI;
  this.dirJ = dirJ;
  this.posI = posI;
  this.posJ = posJ;
}