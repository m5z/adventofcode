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
    
    if (left === 'humn') {
      continue;
    }

    if (!isNaN(right)) {
      values.set(left, +right);
    } else {
      if (left === 'root') {
        values.set(left, right.replace(right[5], "-"));
      } else {
        values.set(left, right);
      }
    }
  }
  
  const expression = evaluate(values, 'root');

  const y0 = f(expression, 0);
  const y1 = f(expression, 1);
  const a = y1 - y0;

  let candidate = 0;
  while (true) {
    let result = f(expression, candidate);
    console.log(candidate, result);
    if (result === 0) {
      console.log(candidate);
      return;
    } else {
      candidate -= result / a;
    }
  }
}

processLineByLine();

function f(expression, humn) {
  return eval(expression);
}

function evaluate(values, key) {
  const evaluated = values.get(key);
  if (!evaluated) {
    return key;
  } else if (!isNaN(evaluated)) {
    return evaluated;
  } else {
    const split = evaluated.split(" ");
    const left = split[0];
    const right = split[2];
    const operator = split[1];

    const leftValue = evaluate(values, left);
    const rightValue = evaluate(values, right);

    if (isNaN(leftValue) || isNaN(rightValue)) {
      return `(${leftValue} ${operator} ${rightValue})`;
    }

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