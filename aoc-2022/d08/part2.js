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

  let maxScore = 0;

  for (let i = 0; i < grid.length; ++i) {
    for (let j = 0; j < grid[i].length; ++j) {
      const tree = grid[i][j];
      let right = 1;
      for (let k = j + 1; k < grid[i].length - 1; ++k) {
        if (grid[i][k] < tree) {
          right += 1;
        } else {
          break;
        }
      }

      let left = 1;
      for (let k = j - 1; k > 0; --k) {
        if (grid[i][k] < tree) {
          left += 1;
        } else {
          break;
        }
      }

      let up = 1;
      for (let k = i - 1; k > 0; --k) {
        if (grid[k][j] < tree) {
          up += 1;
        } else {
          break;
        }
      }

      let down = 1;
      for (let k = i + 1; k < grid.length - 1; ++k) {
        if (grid[k][j] < tree) {
          down += 1;
        } else {
          break;
        }
      }

      const score = right * left * up * down;
      // console.log(tree, right, left, up, down, score);

      if (score > maxScore) {
        maxScore = score;
      }
    }
  }
  
  console.log(maxScore);
}

processLineByLine();
