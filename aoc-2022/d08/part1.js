const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('in1');

  const lines = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const grid = [];
  for await (const line of lines) {
    grid.push(line.split('').map(s => +s));
  }

  const visibleTrees = [];
  for (const treeLine of grid) {
    const visibleLine = []
    for (const tree of treeLine) {
      visibleLine.push(0);
    }
    visibleTrees.push(visibleLine);
  }

  for (let i = 0; i < grid.length; ++i) {
    let maxHeight = -1;
    for (let j = 0; j < grid[i].length; ++j) {
      if (grid[i][j] > maxHeight) {
        maxHeight = grid[i][j];
        visibleTrees[i][j] = 1;
      }
    }
    
    maxHeight = -1;
    for (let j = grid[i].length - 1; j >= 0; --j) {
      if (grid[i][j] > maxHeight) {
        maxHeight = grid[i][j];
        visibleTrees[i][j] = 1;
      }
    }
  }

  for (let j = 1; j < grid[0].length - 1; ++j) {
    let maxHeight = -1;
    for (let i = 0; i < grid.length; ++i) {
      if (grid[i][j] > maxHeight) {
        maxHeight = grid[i][j];
        visibleTrees[i][j] = 1;
      }
    }
    
    maxHeight = -1;
    for (let i = grid.length - 1; i >= 0; --i) {
      if (grid[i][j] > maxHeight) {
        maxHeight = grid[i][j];
        visibleTrees[i][j] = 1;
      }
    }
  }

  console.log(visibleTrees.flat().reduce((a, b) => a + b, 0))
}

processLineByLine();
