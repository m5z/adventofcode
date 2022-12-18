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
  const sides = [];
  for await (const line of line_reader) {
    cubes.push(line.split(',').map(n => +n));
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

  console.log(sides.reduce((sum, a) => sum + a));
}

processLineByLine();
