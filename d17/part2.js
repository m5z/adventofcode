const fs = require('fs');
const readline = require('readline');

const CHAMBER_WIDTH = 7;

// const INPUT_FILE = 'in0';
// const CYCLE_START = 16;
// const CYCLE_LENGTH = 35;
// const CYCLE_HEIGHT = 53;

const INPUT_FILE = 'in1';
const CYCLE_START = 306;
const CYCLE_LENGTH = 1705;
const CYCLE_HEIGHT = 2582;

// const MAX_PIECES = 2022;
const MAX_PIECES = 1000000000000;

async function processLineByLine() {
  const fileStream = fs.createReadStream(INPUT_FILE);

  const line_reader = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let jets;
  for await (const line of line_reader) {
    jets = line.split('').map(char => char === "<" ? -1 : 1);
  }

  const pieces = [
    [
      [1, 1, 1, 1]
    ],
    [
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0]
    ],
    [
      [1, 1, 1],
      [0, 0, 1],
      [0, 0, 1]
    ],
    [
      [1],
      [1],
      [1],
      [1]
    ],
    [
      [1, 1],
      [1, 1]
    ]
  ];
  
  const chamber = [];
  const chamberNumbers = [];
  const jetNumbers = [];
  const pieceNumbers = [];
  let jet = 0;
  let piece = 0;

  while (piece < MAX_PIECES) {
    const currentPiece = pieces[piece % pieces.length];
    
    let piecePosI = chamber.length + 3;
    let piecePosJ = 2;

    let falling = true;
    while (falling) {
      if (canMoveHorizontally(chamber, currentPiece, piecePosI, piecePosJ, jets[jet])) {
        piecePosJ += jets[jet];
      }
      jet = (jet + 1) % jets.length;

      if (canMoveVertically(chamber, currentPiece, piecePosI, piecePosJ)) {
        piecePosI -= 1;
      } else {
        placePiece(chamber, currentPiece, piecePosI, piecePosJ);
        falling = false;

        // for (let i = piecePosI; i < chamber.length; ++i) {
        //   let number = lineToNumber(chamber[i]);
        //   if (i < chamberNumbers.length) {
        //     chamberNumbers[i] = number;
        //     jetNumbers[i] = jet % jets.length;
        //     pieceNumbers[i] = piece + 1;
        //   } else {
        //     chamberNumbers.push(number);
        //     jetNumbers.push(jet % jets.length);
        //     pieceNumbers.push(piece + 1);
        //   }
        // }
      }
    }

    ++piece;

    if (piece === CYCLE_START) {
      const skipCycles = Math.floor((MAX_PIECES - CYCLE_START) / CYCLE_LENGTH);
      piece += (skipCycles - 2) * CYCLE_LENGTH;
    }
  }
  
  // printChamberNumbers(chamber);

  // for (const line of chamber) {
  //   chamberNumbers.push(lineToNumber(line));
  // }

  // for (let i = 100; i > 0; --i) {
  //   let periodStart = findPeriod(i, chamberNumbers);
  //   if (periodStart) {
  //     console.log(periodStart, i);
  //     return;
  //   }
  // }

  // for (let i = 0; i < 106; ++i) {
  //   console.log(i, chamberNumbers[i], jetNumbers[i], pieceNumbers[i]);
  // }
  // for (const i of [25, 25 + 53, 25 + 2 * 53]) {
  //   console.log(i, chamberNumbers[i], jetNumbers[i], pieceNumbers[i]);
  // }

  // console.log(chamberNumbers);
  console.log(chamber.length + (Math.floor((MAX_PIECES - CYCLE_START) / CYCLE_LENGTH) - 2) * CYCLE_HEIGHT);
}

processLineByLine();

function findPeriod(length, array) {
  for (let i = 0; i < array.length - length; ++i) {
    let periodFound = true;
    for (let j = 0; j < length; ++j) {
      if (array[i + j] !== array[i + j + length]) {
        periodFound = false;
        break;
      }
    }
    if (periodFound) {
      return i;
    }
  }
}

function printChamber(chamber) {
  for (let i = chamber.length - 1; i >= 0; --i) {
    console.log("|" + chamber[i].map(x => x === 0 ? '.' : '#').join('') + "|");
  }
  console.log();
}

function printChamberNumbers(chamber) {
  for (let i = chamber.length - 1; i >= 0; --i) {
    let number = lineToNumber(chamber[i]);
    console.log(chamber[i].join(''), number);
  }
  console.log();
}

function lineToNumber(line) {
  let number = 0;
  let power = 1;
  for (let j = 0; j < line.length; j++) {
    number += power * line[j];
    power <<= 1;
  }
  return number;
}

function canMoveHorizontally(chamber, currentPiece, piecePosI, piecePosJ, direction) {
  if (piecePosJ + direction < 0 || piecePosJ + direction + currentPiece[0].length > CHAMBER_WIDTH) {
    return false;
  }

  for (let i = 0; i < currentPiece.length; ++i) {
    if (piecePosI + i >= chamber.length) {
      break;
    }
    for (let j = 0; j < currentPiece[0].length; ++j) {
      if (currentPiece[i][j] === 1 && chamber[piecePosI + i][piecePosJ + j + direction] === 1) {
        return false;
      }
    }
  }

  return true;
}

function canMoveVertically(chamber, currentPiece, piecePosI, piecePosJ) {
  if (piecePosI - 1 < 0) {
    return false;
  }
  
  if (piecePosI - 1 >= chamber.length) {
    return true;
  }

  for (let i = 0; i < currentPiece.length; ++i) {
    for (let j = 0; j < currentPiece[i].length; ++j) {
      if (piecePosI + i - 1 < chamber.length && currentPiece[i][j] === 1 && chamber[piecePosI + i - 1][piecePosJ + j] === 1) {
        return false;
      }
    }
  }
  return true;
}

function placePiece(chamber, currentPiece, piecePosI, piecePosJ) {
  let diff = piecePosI + currentPiece.length - chamber.length;
  for (let i = 0; i < diff; ++i) {
    chamber.push(new Array(CHAMBER_WIDTH).fill(0));
  }

  for (let i = 0; i < currentPiece.length; ++i) {
    for (let j = 0; j < currentPiece[i].length; ++j) {
      if (currentPiece[i][j]) {
        chamber[piecePosI + i][piecePosJ + j] = currentPiece[i][j];
      }
    }
  }
}
