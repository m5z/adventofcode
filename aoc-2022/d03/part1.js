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

  for await (const line of lines) {
    let rucksackSize = line.length / 2;

    let rucksack1 = new Set();
    for (let i = 0; i < rucksackSize; i++) {
      rucksack1.add(line[i]);
    }
    
    let rucksack2 = new Set();
    for (let i = rucksackSize; i < line.length; i++) {
      rucksack2.add(line[i]);
    }

    let common = new Set([...rucksack1].filter((item) => rucksack2.has(item)));

    for (const item of common) {
      answer += charToPriority(item);
    }
  }

  console.log(answer);
}

processLineByLine();