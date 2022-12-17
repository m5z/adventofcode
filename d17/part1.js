const fs = require('fs');
const readline = require('readline');

const INPUT_FILE = 'in0';

async function processLineByLine() {
  const fileStream = fs.createReadStream(INPUT_FILE);

  const line_reader = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of line_reader) {
    
  }

  // console.log(maxPressure);
}

processLineByLine();
