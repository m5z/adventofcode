const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('in1');

  const lines = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let cycle = 0;
  let X = 1;
  const screen = [];
  for await (const line of lines) {
    if (line === 'noop') {
      ++cycle;
      draw();
    } else {
      ++cycle;
      draw();
      ++cycle;
      draw();
      X += +line.split(' ')[1];
    }
  }

  let line = '';
  for (let i = 0; i < screen.length; ++i) {
    if (i % 40 == 0) {
      console.log(line);
      line = '';
    }
    line += screen[i];
  }
  console.log(line);

  function draw() {
    cycle %= 40;
    if (Math.abs(cycle - 1 - X) <= 1) {
      screen.push('#');
    } else {
      screen.push('.');
    }
  }
}

processLineByLine();
