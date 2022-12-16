const fs = require('fs');
const readline = require('readline');

const INPUT_FILE = 'in0';
const MAX_TIME = 30;

async function processLineByLine() {
  const fileStream = fs.createReadStream(INPUT_FILE);

  const line_reader = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const nodes = [];
  const nameToNode = new Map();
  for await (const line of line_reader) {
    const split = line.split(';')
    const valveName = split[0].split(' ')[1];
    const rate = +split[0].split('=')[1];
    const neighbors = split[1].replace(" valve ", " valves ").split(" valves ")[1].split(", ");
    const node = new Node(rate, neighbors);
    nameToNode.set(valveName, node);
    nodes.push(node);
  }

  for (const node of nodes) {
    for (let i = 0; i < node.neighbors.length; ++i) {
      node.neighbors[i] = nameToNode.get(node.neighbors[i]);
    }
  }

  traverse(nameToNode.get("AA"));
  
  console.log(nameToNode);
}

processLineByLine();

function traverse(node) {
  if (!node.valveOpen && node.rate > 0) {
    node.valveOpen = true;
    node.timeToEnter += 1;
    node.totalPressure += node.rate * (MAX_TIME - node.timeToEnter);

    for (const neighbor of node.neighbors) {
      if (node.timeToEnter + 1 < MAX_TIME 
        && neighbor.timeToEnter < node.timeToEnter 
        && neighbor.totalPressure <= node.rate * (MAX_TIME - node.timeToEnter)) {
        neighbor.timeToEnter = node.timeToEnter + 1;
        neighbor.totalPressure = node.rate * (MAX_TIME - node.timeToEnter);
        traverse(neighbor);
      }
    }
  }
}

function Node(rate, neighbors) {
  this.rate = rate;
  this.neighbors = neighbors;
  this.valveOpen = false;
  this.totalPressure = 0;
  this.timeToEnter = 0;
}