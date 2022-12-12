const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('in1');

  const line_reader = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const terrain = []
  const originalTraversed = [];
  let traversed;
  for await (const line of line_reader) {
    const split = line.split('');
    terrain.push(split);
    originalTraversed.push(split.map(x => Infinity));
  }

  let start, end;
  for (let i = 0; i < terrain.length; ++i) {
    for (let j = 0; j < terrain[0].length; ++j) {
      if (terrain[i][j] === 'S') {
        terrain[i][j] = 'a';
      } else if (terrain[i][j] === 'E') {
        end =[i, j];
        terrain[i][j] = 'z';
      }
    }
  }

  function canGo(from, to) {
    return (terrain[to[0]][to[1]].charCodeAt(0) - terrain[from[0]][from[1]].charCodeAt(0) <= 1 
      && traversed[to[0]][to[1]] > traversed[from[0]][from[1]] + 1);
  }

  function traverse(from) {
    if (from[0] > 0 && canGo(from, [from[0] - 1, from[1]])) {
      // console.log('down');
      traversed[from[0] - 1][from[1]] = traversed[from[0]][from[1]] + 1;
      traverse([from[0] - 1, from[1]]);
    }
    if (from[0] < terrain.length - 1 && canGo(from, [from[0] + 1, from[1]])) {
      // console.log('up');
      traversed[from[0] + 1][from[1]] = traversed[from[0]][from[1]] + 1;
      traverse([from[0] + 1, from[1]]);
    }
    if (from[1] > 0 && canGo(from, [from[0], from[1] - 1])) {
      // console.log('left');
      traversed[from[0]][from[1] - 1] = traversed[from[0]][from[1]] + 1;
      traverse([from[0], from[1] - 1]);
    }
    if (from[1] < terrain[0].length - 1 && canGo(from, [from[0], from[1] + 1])) {
      // console.log('right');
      traversed[from[0]][from[1] + 1] = traversed[from[0]][from[1]] + 1;
      traverse([from[0], from[1] + 1]);
    }
  }
 
  let minSteps = Infinity;
  
  for (let i = 0; i < terrain.length; ++i) {
    for (let j = 0; j < terrain[0].length; ++j) {
      if (terrain[i][j] === 'a') {
        traversed = [];
        for (const row of terrain) {
          traversed.push(row.map(x => Infinity));
        }
        traversed[i][j] = 0;
        // console.table(traversed);
        traverse([i, j])
        if (traversed[end[0]][end[1]] < minSteps) {
          minSteps = traversed[end[0]][end[1]];
        }
      }
    }
  }

  // console.table(traversed);

  console.log(minSteps);
}

processLineByLine();
