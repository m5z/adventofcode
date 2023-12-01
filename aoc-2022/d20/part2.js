const fs = require('fs');
const readline = require('readline');

const INPUT_FILE = 'in1';

async function processLineByLine() {
  const fileStream = fs.createReadStream(INPUT_FILE);

  const line_reader = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const nodes = [];
  let zeroNode;
  for await (const line of line_reader) {
    const number = +line * 811589153;
    const node = new Node(number);
    nodes.push(node);
    if (number === 0) {
      zeroNode = node;
    }
  }
  
  for (let i = 1; i < nodes.length - 1; ++i) {
    connect(nodes[i - 1], nodes[i]);
    connect(nodes[i], nodes[i + 1]);
  }
  connect(nodes[nodes.length - 1], nodes[0]);

  // console.log(nodesToString(zeroNode, nodes.length));

  for (let i = 0; i < 10; ++i) {
    mix(nodes);
  }

  let answer = 0;
  let node = zeroNode;
  for (let i = 1; i <= 3000; ++i) {
    node = node.next;
    if (i === 1000 || i === 2000 || i === 3000) {
      // console.log(node.number);
      answer += node.number;
    }
  }
  console.log(answer);
}

processLineByLine();

function mix(nodes) {
  for (let i = 0; i < nodes.length; ++i) {
    const node = nodes[i];
    if (node.number > 0) {
      let neighbor = node.next;
      connect(node.prev, node.next);
      for (let j = 0; j < node.number % (nodes.length - 1); ++j) {
        neighbor = neighbor.next;
      }
      connect(neighbor.prev, node);
      connect(node, neighbor);
    } else if (node.number < 0) {
      let neighbor = node.prev;
      connect(node.prev, node.next);
      for (let j = 0; j < -node.number % (nodes.length - 1); ++j) {
        neighbor = neighbor.prev;
      }
      connect(node, neighbor.next);
      connect(neighbor, node);
    }
    // console.log(nodesToString(zeroNode, nodes.length));
  }
}

function nodesToString(node, length) {
  numbers = []
  for (let i = 0; i < length; ++i) {
    numbers.push(node.number);
    node = node.next;
  }
  return numbers.join(", ");
}

function connect(node1, node2) {
  node1.next = node2;
  node2.prev = node1;
}

function Node(number) {
  this.number = number;
  this.prev = null;
  this.next = null;
}
