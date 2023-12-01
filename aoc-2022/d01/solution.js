const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('in1');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let currentSum = 0;
  let calories = [];
  for await (const line of rl) {
    if(line.length !== 0) {
        currentSum += +line;
    } else {
        // console.log(`Current sum: ${currentSum}`);
        calories.push(currentSum);
        currentSum = 0;
    }
  }
  calories.sort();
  calories.reverse();
  console.log(`Max sum: ${calories[0]}`);
  console.log(`3 top sums: ${calories[0] + calories[1] + calories[2]}`);
}

processLineByLine();