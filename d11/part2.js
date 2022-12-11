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

  monkeys = [];
  let i = 0;
  while (i < lines.length) {
    monkeys.push({
      items: lines[i + 1].split(': ')[1].split(', ').map(n => +n),
      operation: lines[i + 2].split(' = ')[1],
      test: +lines[i + 3].split('by ')[1],
      ifTrue: +lines[i + 4].split('monkey ')[1],
      ifFalse: +lines[i + 5].split('monkey ')[1],
      inspected: 0
    })
    i += 7;
  }

  // console.log(monkeys);

  let mod = monkeys.map(monkey => monkey.test).reduce((a, b) => a * b);

  for (let round = 0; round < 10000; ++round) {
    for (let monkey = 0; monkey < monkeys.length; ++monkey) {
      for (let old of monkeys[monkey].items) {
        ++monkeys[monkey].inspected;
        let current = eval(monkeys[monkey].operation);
        current = Math.floor(current % mod);
        if (current % monkeys[monkey].test === 0) {
          monkeys[monkeys[monkey].ifTrue].items.push(current);
        } else {
          monkeys[monkeys[monkey].ifFalse].items.push(current);
        }
      }
      monkeys[monkey].items = [];
    }
  }

  const inspected = monkeys.map(monkey => monkey.inspected);
  inspected.sort((a, b) => b - a);
  console.log(inspected[0] * inspected[1]);
}

processLineByLine();
