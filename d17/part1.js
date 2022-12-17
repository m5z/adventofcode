const fs = require('fs');
const readline = require('readline');

// const INPUT_FILE = 'in0';
const INPUT_FILE = 'in1';
const CHAMBER_WIDTH = 7;
// const MAX_PIECES = 10;
const MAX_PIECES = 2022;

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
  let jet = 0;
  let piece = 0;

  while (piece < MAX_PIECES) {
    const currentPiece = pieces[piece % pieces.length];
    
    let piecePosI = chamber.length + 3;
    let piecePosJ = 2;

    // console.log('new piece', piece, currentPiece, piecePosI, piecePosJ);

    let falling = true;
    while (falling) {
      if (canMoveHorizontally(chamber, currentPiece, piecePosI, piecePosJ, jets[jet])) {
        piecePosJ += jets[jet];
        // console.log("moved horizontally", piecePosI, piecePosJ, jet, jets[jet]);
      }
      jet = (jet + 1) % jets.length;

      if (canMoveVertically(chamber, currentPiece, piecePosI, piecePosJ)) {
        piecePosI -= 1;
        // console.log("moved vertically", piecePosI, piecePosJ);
      } else {
        placePiece(chamber, currentPiece, piecePosI, piecePosJ);
        falling = false;
      }
    }
    
    ++piece;
  }

  // printChamber(chamber);
  console.log(chamber.length);
}

processLineByLine();

function printChamber(chamber) {
  for (let i = chamber.length - 1; i >= 0; --i) {
    console.log("|" + chamber[i].map(x => x === 0 ? '.' : '#').join('') + "|");
  }
  console.log();
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
  // console.log(piecePosI);

  if (piecePosI - 1 < 0) {
    return false;
  }
  
  if (piecePosI - 1 >= chamber.length) {
    return true;
  }

  for (let i = 0; i < currentPiece.length; ++i) {
    for (let j = 0; j < currentPiece[i].length; ++j) {
      // console.log(i, j, piecePosI + i - 1 < chamber.length, currentPiece[i][j] === 1);
      // if (piecePosI + i - 1 < chamber.length) {
      //   console.log(chamber[piecePosI + i - 1][piecePosJ + j] === 1);
      // }
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

  // console.log(piecePosI, piecePosJ);

  for (let i = 0; i < currentPiece.length; ++i) {
    for (let j = 0; j < currentPiece[i].length; ++j) {
      if (currentPiece[i][j]) {
        chamber[piecePosI + i][piecePosJ + j] = currentPiece[i][j];
      }
    }
  }
}

// console.table(chamber);
// 2800 < x < 3068
