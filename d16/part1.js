const fs = require('fs');
const readline = require('readline');

const INPUT_FILE = 'in1';
const MAX_TIME = 30;

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
  const stack = [[startingNode, MAX_TIME, 0, new Array(nodes.length).fill(false)]];

  let maxPressure = 0;
  while (stack.length > 0) {
    const currentState = stack.pop();
    const currentNode = currentState[0];
    const timeLeft = currentState[1];
    const currentPressure = currentState[2];
    const valves = currentState[3];

    for (const node of nodes) {
      const distance = distances[currentNode.id][node.id];
      if (node !== currentNode && !valves[node.id] && node.rate > 0 && timeLeft - distance - 1 > 0) {
        const pressure = node.rate * (timeLeft - distance - 1);
        const newValves = [...valves];
        newValves[node.id] = true;
        if (maxPressure < currentPressure + pressure) {
          maxPressure = currentPressure + pressure;
        }
        stack.push([node, timeLeft - distance - 1, currentPressure + pressure, newValves]);
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