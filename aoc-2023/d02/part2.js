const fs = require('fs');
const readline = require('readline');

const INPUT_FILE = 'in1';

async function processLineByLine() {
  const fileStream = fs.createReadStream(INPUT_FILE);

  const line_reader = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  total = 0;

  for await (const line of line_reader) {
    const split = line.split(": ");
    const game = parseInt(split[0].split(" ")[1]);
    const turns = split[1].split("; ");
    
    var min_red = 0;
    var min_green = 0;
    var min_blue = 0;

    for (const turn of turns) {
      var red = 0;
      var blue = 0;
      var green = 0;
      for (const balls of turn.split(", ")) {
        const n_color = balls.split(" ");
        const n = parseInt(n_color[0]);
        const color = n_color[1];
        if (color == "red") {
          red += n;
        } else if (color == "blue") {
          blue += n;
        } else if (color == "green") {
          green += n;
        }
      }
      min_red = Math.max(red, min_red);
      min_blue = Math.max(blue, min_blue);
      min_green = Math.max(green, min_green);
    }
    total += min_red * min_blue * min_green;
  }

  console.log(total);
}

processLineByLine();
