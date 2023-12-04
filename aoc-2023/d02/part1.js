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

  const limit_red = 12;
  const limit_green = 13;
  const limit_blue = 14;

  for await (const line of line_reader) {
    const split = line.split(": ");
    const game = parseInt(split[0].split(" ")[1]);
    const turns = split[1].split("; ");

    var possible = true;

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
      if (red > limit_red || green > limit_green || blue > limit_blue) {
        possible = false;
        break;
      }
    }
    if (possible) {
      total += game;
    }
  }

  console.log(total);
}

processLineByLine();
