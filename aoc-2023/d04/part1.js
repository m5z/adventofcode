const fs = require('fs');
const readline = require('readline');

const INPUT_FILE = 'in1';

async function process_lines() {
  const file_stream = fs.createReadStream(INPUT_FILE);
  const line_reader = readline.createInterface({
    input: file_stream, crlfDelay: Infinity
  });

  const lines = [];
  for await (const line of line_reader) {
    lines.push(line);
  }

  var total = 0;

  for (const line of lines) {
    const split = line.split(/[ ]+\|[ ]+/);
    const winning = new Set(split[0].split(/:[ ]+/)[1].split(/[ ]+/));
    const your = new Set(split[1].split(/[ ]+/));
    
    var hits = 0;
    for (const number of your) {
      if (winning.has(number)) {
        hits += 1;
      }
    }

    if (hits > 0) {
      total += Math.pow(2, hits - 1);
    }
  }

  console.log(total);
}

process_lines();
