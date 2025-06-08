let inputDir = { x: 0, y: 0 };
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };
let speed = 5;
let score = 0;
let lastPaintTime = 0;
let gameRunning = false;
let hiscoreval = 0;

const board = document.getElementById("board");
const scoreBox = document.getElementById("scoreBox");
const hiscoreBox = document.getElementById("hiscoreBox");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resumeBtn = document.getElementById("resumeBtn");
const restartBtn = document.getElementById("restartBtn");
const gameOverOverlay = document.getElementById("gameOverOverlay");
const mobileControls = document.querySelectorAll(".control-btn");

const foodSound = new Audio("items/food.mp3");
const gameOverSound = new Audio("items/gameOver.mp3");
const moveSound = new Audio("items/move.mp3");
const musicSound = new Audio("items/gameBg.mp3");

function main(ctime) {
  if (!gameRunning) return;
  window.requestAnimationFrame(main);
  if ((ctime - lastPaintTime) / 1000 < 1 / speed) return;
  lastPaintTime = ctime;
  gameEngine();
}

function isCollide(snake) {
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
  }
  return snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0;
}

function gameEngine() {
  if (isCollide(snakeArr)) {
    gameOverSound.play();
    musicSound.pause();
    inputDir = { x: 0, y: 0 };
    gameRunning = false;
    gameOverOverlay.style.display = "flex";
    return;
  }

  if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
    foodSound.play();
    score++;
    if (score > hiscoreval) {
      hiscoreval = score;
      localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
      hiscoreBox.innerHTML = "Hi-score: " + hiscoreval;
    }
    scoreBox.innerHTML = "Score: " + score;
    snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
    food = {
      x: Math.round(2 + 14 * Math.random()),
      y: Math.round(2 + 14 * Math.random())
    };
  }

  for (let i = snakeArr.length - 2; i >= 0; i--) {
    snakeArr[i + 1] = { ...snakeArr[i] };
  }
  snakeArr[0].x += inputDir.x;
  snakeArr[0].y += inputDir.y;

  board.innerHTML = "";
  snakeArr.forEach((e, i) => {
    let div = document.createElement("div");
    div.style.gridRowStart = e.y;
    div.style.gridColumnStart = e.x;
    div.classList.add(i === 0 ? "head" : "snake");
    board.appendChild(div);
  });

  const foodEl = document.createElement("div");
  foodEl.style.gridRowStart = food.y;
  foodEl.style.gridColumnStart = food.x;
  foodEl.classList.add("food");
  board.appendChild(foodEl);
}

let hiscore = localStorage.getItem("hiscore");
if (hiscore === null) {
  hiscoreval = 0;
  localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
} else {
  hiscoreval = JSON.parse(hiscore);
  hiscoreBox.innerHTML = "Hi-score: " + hiscoreval;
}

window.addEventListener("keydown", e => {
  moveSound.play();
  switch (e.key) {
    case "ArrowUp": inputDir = { x: 0, y: -1 }; break;
    case "ArrowDown": inputDir = { x: 0, y: 1 }; break;
    case "ArrowLeft": inputDir = { x: -1, y: 0 }; break;
    case "ArrowRight": inputDir = { x: 1, y: 0 }; break;
  }
});

mobileControls.forEach(btn => {
  btn.addEventListener("click", () => {
    const dir = btn.dataset.dir;
    moveSound.play();
    if (dir === "up") inputDir = { x: 0, y: -1 };
    else if (dir === "down") inputDir = { x: 0, y: 1 };
    else if (dir === "left") inputDir = { x: -1, y: 0 };
    else if (dir === "right") inputDir = { x: 1, y: 0 };
  });
});

startBtn.addEventListener("click", () => {
  gameRunning = true;
  gameOverOverlay.style.display = "none";
  inputDir = { x: 0, y: -1 };
  musicSound.play();
  window.requestAnimationFrame(main);
});

pauseBtn.addEventListener("click", () => {
  gameRunning = false;
  musicSound.pause();
});

resumeBtn.addEventListener("click", () => {
  if (!gameRunning) {
    gameRunning = true;
    musicSound.play();
    window.requestAnimationFrame(main);
  }
});

restartBtn.addEventListener("click", () => {
  snakeArr = [{ x: 13, y: 15 }];
  food = { x: 6, y: 7 };
  inputDir = { x: 0, y: 0 };
  score = 0;
  scoreBox.innerHTML = "Score: " + score;
  gameOverOverlay.style.display = "none";
  gameRunning = true;
  musicSound.play();
  window.requestAnimationFrame(main);
});

gameEngine();
