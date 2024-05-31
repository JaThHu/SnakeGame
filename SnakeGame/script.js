const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startButton");
const scoreDisplay = document.getElementById("score");
const levelDisplay = document.getElementById("level");
const backgroundMusic = document.getElementById("backgroundMusic");

let snake;
let food;
let direction;
let score;
let interval;
let level;
let gameStarted = false;
let snakeHeadImage = new Image();
let foodImage = new Image();

snakeHeadImage.src = "./images/spacesnake.png"; // Pfad zu deinem Bild
foodImage.src = "./images/spacefruit.png"; // Pfad zu deinem Bild

const unit = 50; // Größe der Snake-Teile und der Nahrung

function init() {
  snake = [{ x: 5 * unit, y: 10 * unit }];
  direction = "RIGHT";
  score = 0;
  level = 1;
  gameStarted = false;
  placeFood();
  updateScoreAndLevel();
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
  clearInterval(interval);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawInitialSnake();
}

function placeFood() {
  food = {
    x: Math.floor(Math.random() * (canvas.width / unit)) * unit,
    y: Math.floor(Math.random() * (canvas.height / unit)) * unit,
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
    updateScoreAndLevel();
    placeFood();
    if (score % 100 === 0) {
      level++;
      clearInterval(interval);
      interval = setInterval(gameLoop, 200 - level * 10);
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
  snake.forEach((part, index) => {
    if (index === 0) {
      // Draw the head
      ctx.drawImage(snakeHeadImage, part.x, part.y, unit, unit);
    } else {
      // Draw the body
      ctx.fillStyle = "lime";
      ctx.fillRect(part.x, part.y, unit, unit);
    }
  });

  // Draw the food
  ctx.drawImage(foodImage, food.x, food.y, unit, unit);
}

function collision(head, array) {
  for (let i = 4; i < array.length; i++) {
    if (head.x === array[i].x && head.y === array[i].y) {
      return true;
    }
  }
  return false;
}

function updateScoreAndLevel() {
  scoreDisplay.textContent = `Score: ${score}`;
  levelDisplay.textContent = `Level: ${level}`;
}

function drawInitialSnake() {
  snake.forEach((part, index) => {
    if (index === 0) {
      ctx.drawImage(snakeHeadImage, part.x, part.y, unit, unit);
    } else {
      ctx.fillStyle = "lime";
      ctx.fillRect(part.x, part.y, unit, unit);
    }
  });

  ctx.drawImage(foodImage, food.x, food.y, unit, unit);
}

window.addEventListener("keydown", (e) => {
  if (!gameStarted) {
    startGame();
  }
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

function startGame() {
  if (!gameStarted) {
    gameStarted = true;
    backgroundMusic.play();
    interval = setInterval(gameLoop, 200);
  }
}

startButton.addEventListener("click", init);

// Initial setup
init();
