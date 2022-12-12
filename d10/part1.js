const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('in1');

  const lines = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let answer = 0;
  let cycle = 0;
  let X = 1;
  for await (const line of lines) {
    if (line === 'noop') {
      ++cycle;
      if (cycle == 20 || cycle == 60 || cycle == 100 || cycle == 140 || cycle == 180 || cycle == 220) {
        console.log(line, cycle, cycle * X);
        answer += cycle * X;
      }
    } else {
      const V = +line.split(' ')[1];
      ++cycle;
      if (cycle == 20 || cycle == 60 || cycle == 100 || cycle == 140 || cycle == 180 || cycle == 220) {
        console.log(line, cycle, cycle * X);
        answer += cycle * X;
      }
      ++cycle;
      if (cycle == 20 || cycle == 60 || cycle == 100 || cycle == 140 || cycle == 180 || cycle == 220) {
        console.log(line, cycle, cycle * X);
        answer += cycle * X;
      }
      X += V;
    }
  }

  console.log(answer);
}

processLineByLine();
