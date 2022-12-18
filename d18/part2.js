const fs = require('fs');
const readline = require('readline');

const INPUT_FILE = 'in1';

async function processLineByLine() {
  const fileStream = fs.createReadStream(INPUT_FILE);

  const line_reader = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const cubes = [];
  for await (const line of line_reader) {
    cubes.push(line.split(',').map(n => +n));
  }

  const areaSize = findAreaSize(cubes);

  const visited = [];
  const externalSides = [];
  for (let i = 0; i < areaSize[0]; ++i) {
    visited.push([]);
    externalSides.push([]);
    for (let j = 0; j < areaSize[1]; ++j) {
      visited[i].push([]);
      externalSides[i].push([]);
      for (let k = 0; k < areaSize[2]; ++k) {
        visited[i][j].push(0);
        externalSides[i][j].push(0);
      }  
    }  
  }

  for (const cube of cubes) {
    visited[cube[0]][cube[1]][cube[2]] = 2; 
  }

  const stack = [[areaSize[0] - 1, areaSize[1] - 1, areaSize[2] - 1]];
  visited[areaSize[0] - 1][areaSize[1] - 1][areaSize[2] - 1] = 1;
  let steps = 0;
  while (stack.length > 0) {
    const current = stack.pop();
    steps++;

    if (current[0] - 1 >= 0) {
      if (visited[current[0] - 1][current[1]][current[2]] == 0) {
        stack.push([current[0] - 1, current[1], current[2]]);
        visited[current[0] - 1][current[1]][current[2]] = 1;
      } else if (visited[current[0] - 1][current[1]][current[2]] == 2) {
        externalSides[current[0] - 1][current[1]][current[2]]++;
      }
    }
    if (current[0] + 1 < areaSize[0]) {
      if (visited[current[0] + 1][current[1]][current[2]] == 0) {
        stack.push([current[0] + 1, current[1], current[2]]);
        visited[current[0] + 1][current[1]][current[2]] = 1;
      } else if (visited[current[0] + 1][current[1]][current[2]] == 2) {
        externalSides[current[0] + 1][current[1]][current[2]]++;
      }
    }
    if (current[1] - 1 >= 0) {
      if (visited[current[0]][current[1] - 1][current[2]] == 0) {
        stack.push([current[0], current[1] - 1, current[2]]);
        visited[current[0]][current[1] - 1][current[2]] = 1;
      } else if (visited[current[0]][current[1] - 1][current[2]] == 2) {
        externalSides[current[0]][current[1] - 1][current[2]]++;
      }
    }
    if (current[1] + 1 < areaSize[1]) {
      if (visited[current[0]][current[1] + 1][current[2]] == 0) {
        stack.push([current[0], current[1] + 1, current[2]]);
        visited[current[0]][current[1] + 1][current[2]] = 1;
      } else if (visited[current[0]][current[1] + 1][current[2]] == 2) {
        externalSides[current[0]][current[1] + 1][current[2]]++;
      }
    }
    if (current[2] - 1 >= 0) {
      if (visited[current[0]][current[1]][current[2] - 1] == 0) {
        stack.push([current[0], current[1], current[2] - 1]);
        visited[current[0]][current[1]][current[2] - 1] = 1;
      } else if (visited[current[0]][current[1]][current[2] - 1] == 2) {
        externalSides[current[0]][current[1]][current[2] - 1]++;
      }
    }
    if (current[2] + 1 < areaSize[2]) {
      if (visited[current[0]][current[1]][current[2] + 1] == 0) {
        stack.push([current[0], current[1], current[2] + 1]);
        visited[current[0]][current[1]][current[2] + 1] = 1;
      } else if (visited[current[0]][current[1]][current[2] + 1] == 2) {
        externalSides[current[0]][current[1]][current[2] + 1]++;
      }
    }
  }

  console.log(externalSides.flat(2).reduce((sum, a) => sum + a));

  const unvisited = [];
  for (let i = 0; i < areaSize[0]; ++i) {
    for (let j = 0; j < areaSize[1]; ++j) {
      for (let k = 0; k < areaSize[2]; ++k) {
        if (visited[i][j][k] === 0) {
          unvisited.push([i, j, k]);
        }
      }  
    }  
  }

  console.log(countExternalSides(cubes) - countExternalSides(unvisited));

  // why are results different?
}

processLineByLine();

function findAreaSize(cubes) {
  return [
    Math.max(...cubes.map(cube => cube[0])) + 2,
    Math.max(...cubes.map(cube => cube[1])) + 2,
    Math.max(...cubes.map(cube => cube[2])) + 2
  ];
}

function countExternalSides(cubes) {
  const sides = [];
  for (const cube of cubes) {
    sides.push(6);
  }
  for (let i = 0; i < cubes.length; ++i) {
    for (let j = i; j < cubes.length; ++j) {
      if (cubes[i][0] === cubes[j][0] && cubes[i][1] === cubes[j][1] && Math.abs(cubes[i][2] - cubes[j][2]) === 1
        || cubes[i][0] === cubes[j][0] && cubes[i][2] === cubes[j][2] && Math.abs(cubes[i][1] - cubes[j][1]) === 1
        || cubes[i][1] === cubes[j][1] && cubes[i][2] === cubes[j][2] && Math.abs(cubes[i][0] - cubes[j][0]) === 1) {
        sides[i]--;
        sides[j]--;
      }
    }  
  }
  return sides.reduce((sum, a) => sum + a);
}
