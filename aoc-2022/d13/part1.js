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
    lines.push(line);
  }

  let answer = 0;
  for (let i = 0; i < lines.length; i += 3) {
    const left = eval(lines[i]);
    const right = eval(lines[i + 1]);

    if (isRightOrder(left, right)) {
      // console.log(i / 3 + 1);
      answer += i / 3 + 1;
    }
  }
  console.log(answer);
}

processLineByLine();

function isRightOrder(left, right) {
  for (let i = 0; i < left.length; ++i) {
    if (i >= right.length) {
      return false;
    } else if (Number.isInteger(left[i]) && Number.isInteger(right[i])) {
      if (left[i] !== right[i]) {
        return left[i] < right[i];
      }
    } else if (Array.isArray(left[i]) || Array.isArray(right[i])) {
      if (Number.isInteger(left[i])) {
        left[i] = [left[i]];
      } else if (Number.isInteger(right[i])) {
        right[i] = [right[i]];
      }
      const nested = isRightOrder(left[i], right[i]);
      if (nested !== undefined) {
        return nested;
      }
    }
  }
  if (left.length < right.length) {
    return true;
  }
  return undefined;
}