const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('in1');

  const lines = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of lines) {
    const buffer = []
    for (let i = 0; i < line.length; ++i) {
      buffer.push(line[i]);
      if (new Set([...buffer]).size === 4) {
        console.log(i + 1);
        return;
      }
      if (buffer.length === 4) {
        buffer.shift();
      }
    }
  }
}

processLineByLine();
