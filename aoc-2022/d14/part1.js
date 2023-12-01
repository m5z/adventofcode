const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('in1');

  const line_reader = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const coords = [];
  for await (const line of line_reader) {
    coords.push(line.split(' -> ').map(xy => xy.split(',').map(x => +x)));
  }

  const depth = findDepth(coords);
  const grid = initGrid(depth);
  buildCave(coords, grid);

  let sand = 0;
  let failedDrops = 0;
  while(failedDrops < 2) {
    if (dropSand(grid)) {
      failedDrops = 0;
    } else {
      ++failedDrops;
    }
    ++sand;
  }

  console.log(sand - failedDrops);
}

processLineByLine();

function dropSand(grid) {
  let x = 500, y = 0;
  if (grid[y][x] !== 0) {
    return false;
  }
  while (y + 1 < grid.length) {
    if (grid[y + 1][x] === 0) {
      ++y;
    } else if (grid[y + 1][x - 1] === 0) {
      ++y;
      --x;
    } else if (grid[y + 1][x + 1] === 0) {
      ++y;
      ++x;
    } else {
      grid[y][x] = 1;
      return true;
    }
  }
  return false;
}

function buildCave(coords, grid) {
  for (let i = 0; i < coords.length; ++i) {
    for (let j = 1; j < coords[i].length; ++j) {
      const prevX = coords[i][j - 1][0];
      const prevY = coords[i][j - 1][1];
      const x = coords[i][j][0];
      const y = coords[i][j][1];
      // console.log(prevX, prevY, '->', x, y)
      if (x === prevX) {
        for (let k = 0; Math.abs(k) <= Math.abs(y - prevY); k += Math.sign(y - prevY)) {
          // console.log(x, prevY + k);
          grid[prevY + k][x] = 1;
        }
      } else {
        for (let k = 0; Math.abs(k) <= Math.abs(x - prevX); k += Math.sign(x - prevX)) {
          // console.log(prevX + k, y);
          grid[y][prevX + k] = 1;
        }
      }
    }
  }
}

function initGrid(depth) {
  const grid = [];
  for (let i = 0; i < depth; ++i) {
    grid.push(new Array(1000).fill(0));
  }
  return grid;
}

function findDepth(coords) {
  let maxY = 0;
  for (let i = 0; i < coords.length; ++i) {
    for (let j = 0; j < coords[i].length; ++j) {
      if (coords[i][j][1] > maxY) {
        maxY = coords[i][j][1];
      }
    }
  }
  return maxY + 1;
}
