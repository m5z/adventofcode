const fs = require('fs');
const readline = require('readline');

function charToPriority(char) {
  if (char >= 'a' && char <= 'z') {
    return char.charCodeAt(0) - 96;
  } 
  return char.charCodeAt(0) - 38;
}

async function processLineByLine() {
  const fileStream = fs.createReadStream('in1');

  const lines = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let answer = 0;
  let i = 0;
  let rucksack = new Set();
  let common;
  
  for await (const line of lines) {
    rucksack = new Set();

    for (let i = 0; i < line.length; i++) {
      rucksack.add(line[i]);
    }
    
    if (i == 0) {
      common = rucksack;
    } else {
      common = new Set([...rucksack].filter((item) => common.has(item)));
    }

    i++;

    if (i > 2) {
      if (common.length > 0) {
        console.log('ERROR');
        return;
      }

      for (const item of common) {
        answer += charToPriority(item);
      }

      rucksack = new Set();
      i = 0;
    }
  }

  console.log(answer);
}

processLineByLine();