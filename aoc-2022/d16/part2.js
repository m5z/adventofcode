const fs = require('fs');
const readline = require('readline');

const INPUT_FILE = 'in1';
const MAX_TIME = 26;

async function processLineByLine() {
  const fileStream = fs.createReadStream(INPUT_FILE);

  const line_reader = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const nodes = [];
  const nameToNode = new Map();
  let currentId = 0;

  for await (const line of line_reader) {
    const split = line.split(';')
    const valveName = split[0].split(' ')[1];
    const rate = +split[0].split('=')[1];
    const neighbors = split[1].replace(" valve ", " valves ").split(" valves ")[1].split(", ");
    const node = new Valve(valveName, currentId, rate, neighbors);
    ++currentId;
    nameToNode.set(valveName, node);
    nodes.push(node);
  }

  for (const node of nodes) {
    for (let i = 0; i < node.neighbors.length; ++i) {
      node.neighbors[i] = nameToNode.get(node.neighbors[i]);
    }
  }

  const distances = calculateDistances(nodes);

  const maxPressure = getMaxPressure(nodes, distances, nameToNode.get("AA"));
  console.log(maxPressure);
}

processLineByLine();

function getMaxPressure(nodes, distances, startingNode) {
  const stack = [[startingNode, false, MAX_TIME, startingNode, true, MAX_TIME, 0, new Array(nodes.length).fill(false)]];

  let maxPressure = 0;
  while (stack.length > 0) {

    const state = stack.pop();
    const currentNode1 = state[0];
    const busy1 = state[1];
    const timeLeft1 = state[2];
    const currentNode2 = state[3];
    const busy2 = state[4];
    const timeLeft2 = state[5];
    const currentPressure = state[6];
    const valves = state[7];

    if (!busy1) {
      for (let i = 0; i < nodes.length; ++i) {
        const node = nodes[i];
        const distance = distances[currentNode1.id][node.id];
        if (node !== currentNode1 && !valves[node.id] && node.rate > 0 && timeLeft1 - distance - 1 > 0) {
          const pressure = node.rate * (timeLeft1 - distance - 1);
          const newValves = [...valves];
          newValves[node.id] = true;
          if (maxPressure < currentPressure + pressure) {
            maxPressure = currentPressure + pressure;
          }
          stack.push([node, true, timeLeft1 - distance - 1, currentNode2, false, timeLeft2, currentPressure + pressure, newValves]);
        }
      }
    }

    if (!busy2) {
      for (let i = 0; i < nodes.length; ++i) {
        const node = nodes[i];
        const distance = distances[currentNode2.id][node.id];
        if (node !== currentNode2 && !valves[node.id] && node.rate > 0 && timeLeft2 - distance - 1 > 0) {
          const pressure = node.rate * (timeLeft2 - distance - 1);
          const newValves = [...valves];
          newValves[node.id] = true;
          if (maxPressure < currentPressure + pressure) {
            maxPressure = currentPressure + pressure;
          }
          stack.push([currentNode1, false, timeLeft1, node, true, timeLeft2 - distance - 1, currentPressure + pressure, newValves]);
        }
      }
    }
  }
  return maxPressure;
}

function calculateDistances(nodes) {
  const distances = [];
  for (let i = 0; i < nodes.length; ++i) {
    distances.push(new Array(nodes.length).fill(Infinity));
  }

  for (let i = 0; i < nodes.length; ++i) {
    distances[i][i] = 0;

    const stack = [nodes[i]];
    while (stack.length > 0) {
      const currentNode = stack.pop();
      for (const neighbor of currentNode.neighbors) {
        if (distances[i][neighbor.id] >= distances[i][currentNode.id] + 1) {
          distances[i][neighbor.id] = distances[neighbor.id][i] = distances[i][currentNode.id] + 1;
          stack.push(neighbor);
        }
      }
    }
  }
  return distances;
}

function Valve(valveName, id, rate, neighbors) {
  this.name = valveName;
  this.id = id;
  this.rate = rate;
  this.neighbors = neighbors;
}