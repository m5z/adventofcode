const fs = require('fs');
const readline = require('readline');

const INPUT_FILE = 'in1';

async function processLineByLine() {
  const fileStream = fs.createReadStream(INPUT_FILE);

  const line_reader = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const values = new Map();

  for await (const line of line_reader) {
    const split = line.split(": ");
    const left = split[0];
    const right = split[1];
    if (!isNaN(right)) {
      values.set(left, +right);
    } else {
      values.set(left, right);
    }
  }
  
  console.log(evaluate(values, 'root'));
}

processLineByLine();

function evaluate(values, key) {
  const evaluated = values.get(key);
  if (!isNaN(evaluated)) {
    return evaluated;
  } else {
    const split = evaluated.split(" ");
    const left = split[0];
    const right = split[2];
    const operator = split[1];

    const leftValue = evaluate(values, left);
    const rightValue = evaluate(values, right);

    if (operator === '+') {
      const result = leftValue + rightValue;
      values.set(key, result);
      return result;
    }

    if (operator === '-') {
      const result = leftValue - rightValue;
      values.set(key, result);
      return result;
    }

    if (operator === '*') {
      const result = leftValue * rightValue;
      values.set(key, result);
      return result;
    }

    if (operator === '/') {
      const result = leftValue / rightValue;
      values.set(key, result);
      return result;
    }

    throw "Error";
  }
}