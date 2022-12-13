const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('in1');

  const line_reader = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const lines = [];
  for await (const line of line_reader) {
    if (line !== '') {
      lines.push(eval(line));
    }
  }

  const marker1 = [[2]];
  const marker2 = [[6]];

  lines.push(marker1);
  lines.push(marker2);

  lines.sort((a, b) => isRightOrder(a, b));
  // console.log(lines);

  let marker1pos, marker2pos;
  for (let i = 0; i < lines.length; ++i) {
    if (lines[i] === marker1) {
      marker1pos = i + 1;
    } else if (lines[i] === marker2) {
      marker2pos = i + 1;
    }
  }
  console.log(marker1pos * marker2pos);
}

processLineByLine();
// console.log(isRightOrder([9], [3]));

function isRightOrder(left, right) {
  // console.log(left, right);
  for (let i = 0; i < left.length; ++i) {
    if (i >= right.length) {
      return 1;
    } else if (Number.isInteger(left[i]) && Number.isInteger(right[i])) {
      if (left[i] !== right[i]) {
        return left[i] - right[i];
      }
    } else if (Array.isArray(left[i]) || Array.isArray(right[i])) {
      let nested;
      if (Number.isInteger(left[i])) {
        nested = isRightOrder([left[i]], right[i]);
      } else if (Number.isInteger(right[i])) {
        nested = isRightOrder(left[i], [right[i]]);
      } else {
        nested = isRightOrder(left[i], right[i]);
      }
      if (nested !== 0) {
        return nested;
      }
    }
  }
  if (left.length < right.length) {
    return -1;
  }
  return 0;
}