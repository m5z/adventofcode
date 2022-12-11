const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('in0');

  const line_reader = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const lines = [];
  for await (const line of line_reader) {
    lines.push(line);
  }

  for (let i = 0; i < 1000000; ++i) {
    if (monkeyBusiness(lines, i) === 2713310158) {
      console.log(i);
    }
  }
}

processLineByLine();

function monkeyBusiness(lines, factor) {
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
    });
    i += 7;
  }

  for (let round = 0; round < 10000; ++round) {
    for (let monkey = 0; monkey < monkeys.length; ++monkey) {
      for (let old of monkeys[monkey].items) {
        ++monkeys[monkey].inspected;
        let current = eval(monkeys[monkey].operation);
        current = Math.floor(current % factor);
        if (current % monkeys[monkey].test === 0) {
          monkeys[monkeys[monkey].ifTrue].items.push(current);
        } else {
          monkeys[monkeys[monkey].ifFalse].items.push(current);
        }
      }
      monkeys[monkey].items = [];
    }
    
    if (round === 0 && !isEqual(monkeys.map(monkey => monkey.inspected), [2, 4, 3, 6])) {
      return;
    } else if (round === 19 && !isEqual(monkeys.map(monkey => monkey.inspected), [99, 97, 8, 103])) {
      return;
    } else if (round === 999 && !isEqual(monkeys.map(monkey => monkey.inspected), [5204, 4792, 199, 5192])) {
      return;
    } else if (round === 1999 && !isEqual(monkeys.map(monkey => monkey.inspected), [10419, 9577, 392, 10391])) {
      return;
    } else if (round === 2999 && !isEqual(monkeys.map(monkey => monkey.inspected), [15638, 14358, 587, 15593])) {
      return;
    } else if (round === 3999 && !isEqual(monkeys.map(monkey => monkey.inspected), [20858, 19138, 780, 20797])) {
      return;
    } else if (round === 4999 && !isEqual(monkeys.map(monkey => monkey.inspected), [26075, 23921, 974, 26000])) {
      return;
    } else if (round === 5999 && !isEqual(monkeys.map(monkey => monkey.inspected), [31294, 28702, 1165, 31204])) {
      return;
    } else if (round === 6999 && !isEqual(monkeys.map(monkey => monkey.inspected), [36508, 33488, 1360, 36400])) {
      return;
    } else if (round === 7999 && !isEqual(monkeys.map(monkey => monkey.inspected), [41728, 38268, 1553, 41606])) {
      return;
    } else if (round === 8999 && !isEqual(monkeys.map(monkey => monkey.inspected), [46945, 43051, 1746, 46807])) {
      return;
    } else if (round === 9999 && !isEqual(monkeys.map(monkey => monkey.inspected), [52166, 47830, 1938, 52013])) {
      return;
    }
  }

  const inspected = monkeys.map(monkey => monkey.inspected);
  inspected.sort((a, b) => b - a);
  return inspected[0] * inspected[1];
}

function isEqual(a1, a2) {
  let i = a1.length;
  while (i--) {
      if (a1[i] !== a2[i]) return false;
  }
  return true;
}