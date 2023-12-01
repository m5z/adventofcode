const fs = require('fs');
const readline = require('readline');

const INPUT_FILE = 'in1';

async function processLineByLine() {
  const fileStream = fs.createReadStream(INPUT_FILE);

  const line_reader = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const numbers = new Map([
    ["one", "1"],
    ["two", "2"],
    ["three", "3"],
    ["four", "4"],
    ["five", "5"],
    ["six", "6"],
    ["seven", "7"],
    ["eight", "8"],
    ["nine", "9"],
    ["0", "0"],
    ["1", "1"],
    ["2", "2"],
    ["3", "3"],
    ["4", "4"],
    ["5", "5"],
    ["6", "6"],
    ["7", "7"],
    ["8", "8"],
    ["9", "9"],
  ]);

  const numbers_regex = /one|two|three|four|five|six|seven|eight|nine|\d/;

  var total = 0;
  for await (const line of line_reader) {
    const firstDigit = line.match(numbers_regex)[0];

    var lastDigit;
    for (var i = line.length - 1; i >= 0; i--) {
      const m = line.slice(i, line.length).match(numbers_regex)
      if (m) {
        lastDigit = m[0];
        break;
      }
    }

    num = parseInt(numbers.get(firstDigit) + numbers.get(lastDigit));
    total += num;
  }
  console.log(total);
}

processLineByLine();
