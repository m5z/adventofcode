const fs = require('fs');
const readline = require('readline');

const INPUT_FILE = 'in1';

async function processLineByLine() {
  const fileStream = fs.createReadStream(INPUT_FILE);

  const line_reader = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const snafus = [];  
  for await (const line of line_reader) {
    snafus.push(line);
  }
  
  let result = '0';
  for (const snafu of snafus) {
    result = add(result, snafu);
  }
  console.log(result);
}

processLineByLine();

function add(snafu1, snafu2) {
  if (snafu2.length > snafu1.length) {
    const temp = snafu1;
    snafu1 = snafu2;
    snafu2 = temp;
  }
  
  const result = [];
  let carry = 0;
  let i = snafu1.length - 1;
  let j = snafu2.length - 1;
  while (i >= 0) {
    const a = snafuCharToDec(snafu1[i]);
    const b = j >= 0 ? snafuCharToDec(snafu2[j]) : 0;
    let c = a + b + carry;
    carry = 0;
    if (c < -2) {
      c += 5;
      carry = -1; 
    } else if (c > 2) {
      c -= 5;
      carry = 1;
    }
    result.unshift(decToSnafuChar(c));
    --i;
    --j;
  }
  if (carry > 0) {
    result.unshift(decToSnafuChar(carry));
  }
  return result.join('');
}

function snafuCharToDec(snafuChar) {
  if (snafuChar === '=') {
    return -2;
  }
  if (snafuChar === '-') {
    return -1;
  }
  return +snafuChar;
}

function decToSnafuChar(dec) {
  if (dec === -2) {
    return '=';
  }
  if (dec === -1) {
    return '-';
  }
  return dec.toString();
}

function snafuToDec(snafu) {
  let m = 1;
  let dec = 0;
  for(let i = snafu.length - 1; i >= 0; --i) {
    if (snafu[i] == '=') {
      dec += -2 * m;
    } else if (snafu[i] == '-') {
      dec += -1 * m;
    } else {
      dec += +snafu[i] * m;
    }
    m *= 5;
  }
  return dec;
}
