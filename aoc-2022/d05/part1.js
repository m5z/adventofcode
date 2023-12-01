const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('in1');

  const lines = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let readStacks = true;
  const stackLines = [];
  const movesLines = [];
  for await (const line of lines) {
    if (line.length === 0) {
      readStacks = false;
    } else if (readStacks) {
      stackLines.push(line);
    } else {
      movesLines.push(line);
    }
  }

  const stacks = [[], [], [], [], [], [], [], [], []];
  for (let i = stackLines.length - 2; i >= 0; --i) {
    for (let j = 0; j * 4 + 1 < stackLines[i].length; ++j) {
      const crate = stackLines[i][j * 4 + 1];
      if (crate !== ' ') {
        stacks[j].push(stackLines[i][j * 4 + 1]);
      }
    }
  }

  for (const moveLine of movesLines) {
    const move = moveLine.split(' ')
    const howMany = +move[1];
    const from = +move[3] - 1;
    const to = +move[5] - 1;
    
    for (let i = 0; i < howMany; ++i) {
      stacks[to].push(stacks[from].pop());
    }
  }

  let answer = '';
  for (const stack of stacks) {
    answer += stack.pop();
  }

  console.log(answer);
}

processLineByLine();
