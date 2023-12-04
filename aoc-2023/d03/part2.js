const fs = require('fs');
const readline = require('readline');

const INPUT_FILE = 'in1';

function is_digit(char) {
  return char >= '0' && char <= '9'
}

function get_gear_neighbors(lines, i, j, k) {
  const gears = [];

  for (const ii of [i - 1, i, i + 1]) {
    if (ii < 0 || ii >= lines.length) {
      continue;
    }

    for (var jj = Math.max(0, j - 1); jj < Math.min(j + k + 1, lines[i].length); ++jj) {
      const char = lines[ii][jj];
      if (char == '*') {
        gears.push([ii, jj]);
      }
    }
  }

  return gears;
}

async function process_lines() {
  const file_stream = fs.createReadStream(INPUT_FILE);
  const line_reader = readline.createInterface({
    input: file_stream, crlfDelay: Infinity
  });

  var total = 0;

  const lines = [];

  for await (const line of line_reader) {
    lines.push(line);
  }

  const gears_numbers = new Map();

  for (var i = 0; i < lines.length; ++i) {
    var j = 0;
    while (j < lines[i].length) {
      const char = lines[i].charAt(j);

      if (is_digit(char)) {
        var k = 1;
        while (j + k < lines[i].length && is_digit(lines[i].charAt(j + k))) {
          k += 1;
        }

        const number = parseInt(lines[i].slice(j, j + k));

        const gears = get_gear_neighbors(lines, i, j, k);
        if (gears.length > 0) {
          for (const gear of gears) {
            const key = JSON.stringify(gear);
            if (gears_numbers.get(key)) {
              gears_numbers.get(key).push(number);
            } else {
              gears_numbers.set(key, [number]);
            }
          }
        }

        j += k - 1;
      }

      ++j;
    }
  }

  gears_numbers.forEach((value, key) => {
    if (value.length === 2) {
      total += value[0] * value[1];
    }
  });

  console.log(total);
}

process_lines();
