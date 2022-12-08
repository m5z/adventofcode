const fs = require('fs');
const { get } = require('http');
const readline = require('readline');

function File(name, size) {
  this.name = name;
  this.size = size;
}

function Dir(name, parent) {
  this.name = name;
  this.parent = parent;
  this.subdirs = new Set();
  this.files = new Set();
}

let dirSizes = new Map()

function calculateSizes(dir) {
  // console.log(dir.name);
  let filesSize = 0;
  for (const file of dir.files) {
    filesSize += file.size;
  }
  let subdirsSize = 0;
  for (const subdir of dir.subdirs) {
    subdirsSize += calculateSizes(subdir);
  }
  dirSizes.set(dir.name, filesSize + subdirsSize);
  return filesSize + subdirsSize;
}

async function processLineByLine() {
  const fileStream = fs.createReadStream('in1');

  const lines = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const dirs = new Map();
  let currentDir;
  for await (const line of lines) {
    if (line.startsWith('$')) {
      if (line.startsWith('$ cd')) {
        const dir = line.substring('$ cd '.length);
        if (dir === '/') {
          currentDir = new Dir(dir, null);
          dirs.set(dir, currentDir);
        } else if (dir === '..') {
          if (currentDir.parent) {
            currentDir = currentDir.parent;
          }
        } else {
          const path = currentDir.name + '/' + dir;
          const existingDir = dirs.get(path);
          if (existingDir) {
            currentDir = existingDir;
          } else {
            currentDir = new Dir(path, currentDir);
            dirs.set(currentDir.name, currentDir);
          }
        }
      }
    } else {
      if (line.startsWith('dir')) {
        const path = currentDir.name + '/' + line.substring('dir '.length);
        if (!dirs.get(path)) {
          dirs.set(path, new Dir(path, currentDir));
        }
        currentDir.subdirs.add(dirs.get(path));
      } else {
        const split = line.split(' ');
        fileSize = +split[0];
        fileName = split[1];
        currentDir.files.add(new File(fileName, fileSize));
      }
    }
  }

  const root = dirs.get('/');
  calculateSizes(root);

  let answer = 0;
  for (const [dirName, size] of dirSizes) {
    if (size <= 100000) {
      answer += size;
    }
  }
  console.log(answer);
}

processLineByLine();
