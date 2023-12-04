const fs = require('fs');
const readline = require('readline');

const INPUT_FILE = 'in1';

function is_digit(char) {
  return char >= '0' && char <= '9'
}

function has_neighbor(lines, i, j, k) {
  for (const ii of [i - 1, i, i + 1]) {
    if (ii < 0 || ii >= lines.length) {
      continue;
    }

    for (var jj = Math.max(0, j - 1); jj < Math.min(j + k + 1, lines[i].length); ++jj) {
      const char = lines[ii][jj];
      if (char != '.' && !is_digit(char)) {
        return true;
      }
    }
  }

  return false;
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

  for (var i = 0; i < lines.length; ++i) {
    var j = 0;
    while (j < lines[i].length) {
      const char = lines[i].charAt(j);

      if (is_digit(char)) {
        var k = 1;
        while (j + k < lines[i].length && is_digit(lines[i].charAt(j + k))) {
          k += 1;
        }

        if (has_neighbor(lines, i, j, k)) {
          const number = parseInt(lines[i].slice(j, j + k));
          total += number;
        }

        j += k - 1;
      }

      ++j;
    }
  }

  console.log(total);
}

process_lines();
