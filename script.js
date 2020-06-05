let Width  = 50;
let Height = 20;
const WV = '|'; 
const WH = '-'; 
const Head = '@'; 
const Body = 'o'; 
const Space = ' '; 
const Food = '$'; 
const crash = '#';
let speed = 0;
let world = []; 
for (let line = 0; line < Height; line++) {
  world[line] = [];
  for (let column = 0; column < Width; column++) {
    world[line][column] = Space;
  }
}
for (let row = 1; row < Height - 1; row++) {
  world[row][0] = world[row][Width - 1] = WV;
}
for (let col = 1; col < Width - 1; col++) {
  world[0][col] = world[Height - 1][col] = WH;
}
let x = 16;  
let y = 25;   
let snake = [[x, y]];
let Sl  = 2;  
let Br = x;
let Bc = y;
let hasExceded = false;
let Sd  = 'N'; 
for (let body = 0; body < Sl; body++) {
  switch (Sd.toUpperCase()) {
    case 'W':
      Bc--;
      break;
    case 'E':
      Bc++;
      break;
    case 'N':
      Br++;
      break;
    case 'S':
      Br--;
      break;
  }
  if ((0 < Br) && (Br < Height - 1) && (0 < Bc) && (Bc < Width - 1)) {
    snake.push([Br, Bc]);

  } else {
    hasExceded = true;
    break;
  }
}

function inSnake(r, c, snakeArray) {
  for (let snakeIndex = 0; snakeIndex < snakeArray.length; snakeIndex++) {
    let snakeCoordinates = snakeArray[snakeIndex];
    if (snakeCoordinates[0] === r && snakeCoordinates[1] === c) {
      return snakeIndex;
    }
  }
  return -1;
}
function world2string(worldMatrix, snakeArray) {
  let s = "";
  for (let row = 0; row < worldMatrix.length; row++) {
    for (let col = 0; col < worldMatrix[row].length; col++) {

      let snakeSegmentIndex = inSnake(row, col, snakeArray);
      if (snakeSegmentIndex < 0 || worldMatrix[row][col] === crash) {
        s += worldMatrix[row][col];
      } else {
        if (snakeSegmentIndex === 0) {
          s += Head;
        } else {
          s += Body;
        }
      }
    }
    s += '\n';
  }
  return s;
}

function World(worldMatrix, snakeArray) {
  speed = 80;
  console.clear();                                            
  process.stdout.write(world2string(worldMatrix, snakeArray));
}

function snakeMovement(snake, direction) {
  direction = Sd;
  let head  = snake[0];
  switch (Sd) {
    case 'W':
      x = head[0];
      y = head[1] - 1;
      break;
    case 'S':
      x = head[0] + 1;
      y = head[1];
      break;
    case 'N':
        x = head[0] - 1;
        y = head[1];
      break;
    case 'E':
      x = head[0];
      y = head[1] + 1;
      break;
  }
  if (isTheFieldEmpty(x, y)) {
    if (inSnake(x, y, snake) < 0) {
      snake.unshift([x, y]);
      snake.pop();
    } else {
      world[x][y] = crash;
      drawWorld(world, snake);
      process.exit(0);
    }
  } else if (isFood(x, y)) {
    world[x][y] = Space;
    snake.unshift([x, y]);
    spawnFood();
  } else {
    world[x][y] = crash;
    drawWorld(world, snake);
    process.exit(0);
  }
}
function isTheFieldEmpty(r, c) {
  return world[r][c] === Space;
}
function isFood(r, c) {
  return world[r][c] === Food;
}
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
function spawnFood(r, c) {
  if (!r || !c) {
    do {
      r = getRandomNumber(1, Height - 2);
      c = getRandomNumber(1, Width - 2);
    } while (isTheFieldEmpty(r, c) && !inSnake(r, c, snake));
  } 
  world[r][c] = Food;
}
spawnFood(getRandomNumber());
World(world, snake);
const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', function (s, key) {
  switch (key.name) {
    case "up":
      Sd = 'N';
      break;
    case "down":
      Sd = 'S';
      break;
    case "left":
      Sd = 'W';
      break;
    case "right":
      Sd = 'E';
      break;
    case "c": 
      if (key.ctrl) {
        process.exit();
      }
      break;
  }
});
setInterval(function () {
  snakeMovement(snake);
  World(world, snake);
}, speed);