const fs = require('fs');
const readline = require('readline');

const INPUT_FILE = 'in1';

async function process_lines() {
  const file_stream = fs.createReadStream(INPUT_FILE);
  const line_reader = readline.createInterface({
    input: file_stream, crlfDelay: Infinity
  });

  const lines = [];
  const copies = [];
  for await (const line of line_reader) {
    lines.push(line);
    copies.push(1);
  }

  for (var i = 0; i < lines.length; ++i) {
    const line = lines[i];

    const split = line.split(/[ ]+\|[ ]+/);
    const winning = new Set(split[0].split(/:[ ]+/)[1].split(/[ ]+/));
    const your = new Set(split[1].split(/[ ]+/));
    
    var hits = 0;
    for (const number of your) {
      if (winning.has(number)) {
        hits += 1;
      }
    }

    for (var j = i + 1; j <= i + hits; ++j) {
      copies[j] += copies[i];
    }
  }

  const total = copies.reduce(function(a, b){
    return a + b;
  });

  console.log(total);
}

process_lines();
