const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startButton");
const scoreDisplay = document.getElementById("score");
const backgroundMusic = document.getElementById("backgroundMusic");

let snake;
let food;
let direction;
let score;
let interval;
let level;
let speed;

const unit = 20; // Size of the snake parts and food

function init() {
  snake = [{ x: 9 * unit, y: 10 * unit }];
  direction = "RIGHT";
  score = 0;
  level = 1;
  speed = 200; // Initial speed
  placeFood();
  updateScore();
  backgroundMusic.play();
  clearInterval(interval);
  interval = setInterval(gameLoop, speed);
}

function placeFood() {
  food = {
    x: Math.floor(Math.random() * 20) * unit,
    y: Math.floor(Math.random() * 20) * unit,
  };
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Move the snake
  let head = { ...snake[0] };

  if (direction === "LEFT") head.x -= unit;
  if (direction === "UP") head.y -= unit;
  if (direction === "RIGHT") head.x += unit;
  if (direction === "DOWN") head.y += unit;

  snake.unshift(head);

  // Check for collisions with food
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    updateScore();
    placeFood();
    if (score % 100 === 0) {
      level++;
      speed -= 20; // Increase speed
      clearInterval(interval);
      interval = setInterval(gameLoop, speed);
    }
  } else {
    snake.pop();
  }

  // Check for collisions with walls or self
  if (
    head.x < 0 ||
    head.y < 0 ||
    head.x >= canvas.width ||
    head.y >= canvas.height ||
    collision(head, snake)
  ) {
    clearInterval(interval);
    alert("Game Over");
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
  }

  // Draw the snake
  ctx.fillStyle = "lime";
  snake.forEach((part) => {
    ctx.fillRect(part.x, part.y, unit, unit);
  });

  // Draw the food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, unit, unit);
}

function collision(head, array) {
  for (let i = 4; i < array.length; i++) {
    if (head.x === array[i].x && head.y === array[i].y) {
      return true;
    }
  }
  return false;
}

function updateScore() {
  scoreDisplay.textContent = `Score: ${score} | Level: ${level}`;
}

window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

startButton.addEventListener("click", init);
