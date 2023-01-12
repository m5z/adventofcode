const fs = require('fs');
const readline = require('readline');

const INPUT_FILE = 'in1';

async function processLineByLine() {
  const fileStream = fs.createReadStream(INPUT_FILE);

  const line_reader = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const blueprints = [];
  for await (const line of line_reader) {
    const split = line.split(".").map(s => s.split(" "));
    blueprints.push([
      new Robot('ore', +split[0][6], 0, 0),
      new Robot('clay', +split[1][5], 0, 0),
      new Robot('obsidian', +split[2][5], +split[2][8], 0),
      new Robot('geode', +split[3][5], 0, +split[3][8]),
    ]);
  }

  const ratings = [];
  for (let i = 0; i < Math.min(blueprints.length, 3); ++i) {
    ratings.push(rate(blueprints[i], i + 1));
  }

  console.log(ratings.reduce((result, a) => result * a));
}

processLineByLine();

function rate(blueprint, blueprintId) {
  let maxGeodes = 0;
  const stack = [new State([1, 0, 0, 0], [0, 0, 0, 0], 32)];

  let maxOreCost = 0;
  for (const robot of blueprint) {
    if (robot.oreCost > maxOreCost) {
      maxOreCost = robot.oreCost;
    }
  }

  const clayCost = blueprint[2].clayCost;
  const obsidianCost = blueprint[3].obsidianCost;

  let iterations = 0;
  while (stack.length > 0) {
    iterations++;
    // console.log(stack.length);

    const state = stack.pop();
    
    // console.log(state);
    
    if (state.resources[3] > maxGeodes) {
      maxGeodes = state.resources[3];
    }

    const potentialMaxGeodes = state.resources[3] + (state.resources[3] + state.timeLeft) * state.timeLeft / 2;

    if (state.timeLeft > 0 && potentialMaxGeodes > maxGeodes) {
    // if (state.timeLeft > 0) {
      if (state.robots[0] < maxOreCost && state.resources[0] <= maxOreCost && state.resources[0] >= blueprint[0].oreCost) {
        const newState = state.copy();
        newState.resources[0] -= blueprint[0].oreCost;
        for (let i = 0; i < state.robots.length; ++i) {
          newState.resources[i] += state.robots[i];
        }
        ++newState.robots[0];
        stack.push(newState);
      }

      if (state.robots[1] < clayCost && state.resources[1] <= clayCost && state.resources[0] >= blueprint[1].oreCost) {
        const newState = state.copy();
        newState.resources[0] -= blueprint[1].oreCost;
        for (let i = 0; i < state.robots.length; ++i) {
          newState.resources[i] += state.robots[i];
        }
        ++newState.robots[1];
        stack.push(newState);
      }

      if (state.robots[2] < obsidianCost && state.resources[2] <= obsidianCost && state.resources[0] >= blueprint[2].oreCost && state.resources[1] >= blueprint[2].clayCost) {
        const newState = state.copy();
        newState.resources[0] -= blueprint[2].oreCost;
        newState.resources[1] -= blueprint[2].clayCost;
        for (let i = 0; i < state.robots.length; ++i) {
          newState.resources[i] += state.robots[i];
        }
        ++newState.robots[2];
        stack.push(newState);
      }

      if (state.resources[0] >= blueprint[3].oreCost && state.resources[2] >= blueprint[3].obsidianCost) {
        const newState = state.copy();
        newState.resources[0] -= blueprint[3].oreCost;
        newState.resources[2] -= blueprint[3].obsidianCost;
        for (let i = 0; i < state.robots.length; ++i) {
          newState.resources[i] += state.robots[i];
        }
        ++newState.robots[3];
        stack.push(newState);
      }

      if (state.resources[0] <= maxOreCost || state.resources[1] <= clayCost || state.resources[2] <= obsidianCost) {
        for (let i = 0; i < state.robots.length; ++i) {
          state.resources[i] += state.robots[i];
        }
        --state.timeLeft;
        stack.push(state);
      }
    }
  }

  console.log(`Blueprint ${blueprintId}: ${maxGeodes}, iterations: ${iterations}`);
  return maxGeodes;
}

function Robot(type, oreCost, clayCost, obsidianCost) {
  this.type = type;
  this.oreCost = oreCost;
  this.clayCost = clayCost;
  this.obsidianCost = obsidianCost;
}

function State(robots, resources, timeLeft) {
  this.robots = robots;
  this.resources = resources;
  this.timeLeft = timeLeft;

  this.copy = function() {
    return new State([...this.robots], [...this.resources], this.timeLeft - 1);
  }
}