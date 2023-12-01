const fs = require('fs');
const readline = require('readline');

const INPUT_FILE = 'in1';

async function processLineByLine() {
  const fileStream = fs.createReadStream(INPUT_FILE);

  const line_reader = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  total = 0;
  for await (const line of line_reader) {
    const digits = []
    for (let i = 0; i < line.length; i++) {
      char = line.charAt(i);
      if (char >= '0' && char <= '9') {
        digits.push(char)
      }
    }
    total += parseInt(digits[0] + digits[digits.length - 1]);
  }
  console.log(total);
}

processLineByLine();
