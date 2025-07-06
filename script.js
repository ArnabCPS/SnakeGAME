const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scale = 20;
const rows = canvas.height / scale;
const columns = canvas.width / scale;

let snake;
let food;
let score = 0;

(function setup() {
  snake = new Snake();
  food = new Food();
  food.pickLocation();

  window.setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    food.draw();
    snake.update();
    snake.draw();

    if (snake.eat(food)) {
      food.pickLocation();
      score++;
      document.getElementById("score").innerText = score;
    }

    snake.checkCollision();
  }, 150);
})();

function Snake() {
  this.body = [{ x: 10, y: 10 }];
  this.xSpeed = 1;
  this.ySpeed = 0;

  this.draw = function () {
    ctx.fillStyle = "#0f0";
    this.body.forEach(part => {
      ctx.fillRect(part.x * scale, part.y * scale, scale - 2, scale - 2);
    });
  };

  this.update = function () {
    const head = { x: this.body[0].x + this.xSpeed, y: this.body[0].y + this.ySpeed };
    this.body.unshift(head);
    this.body.pop();
  };

  this.changeDirection = function (dir) {
    switch (dir) {
      case "Up":
        if (this.ySpeed === 0) {
          this.xSpeed = 0;
          this.ySpeed = -1;
        }
        break;
      case "Down":
        if (this.ySpeed === 0) {
          this.xSpeed = 0;
          this.ySpeed = 1;
        }
        break;
      case "Left":
        if (this.xSpeed === 0) {
          this.xSpeed = -1;
          this.ySpeed = 0;
        }
        break;
      case "Right":
        if (this.xSpeed === 0) {
          this.xSpeed = 1;
          this.ySpeed = 0;
        }
        break;
    }
  };

  this.eat = function (food) {
    const head = this.body[0];
    if (head.x === food.x && head.y === food.y) {
      this.body.push({}); // add new segment
      return true;
    }
    return false;
  };

  this.checkCollision = function () {
    const head = this.body[0];

    // Check wall collision
    if (
      head.x < 0 || head.x >= columns ||
      head.y < 0 || head.y >= rows
    ) {
      resetGame();
    }

    // Check self collision
    for (let i = 1; i < this.body.length; i++) {
      if (head.x === this.body[i].x && head.y === this.body[i].y) {
        resetGame();
      }
    }
  };
}

function Food() {
  this.x;
  this.y;

  this.pickLocation = function () {
    this.x = Math.floor(Math.random() * columns);
    this.y = Math.floor(Math.random() * rows);
  };

  this.draw = function () {
    ctx.fillStyle = "#f00";
    ctx.fillRect(this.x * scale, this.y * scale, scale - 2, scale - 2);
  };
}

// Keyboard controls
window.addEventListener("keydown", (e) => {
  const direction = e.key.replace("Arrow", "");
  snake.changeDirection(direction);
});

// Mobile swipe controls
let startX, startY;

canvas.addEventListener("touchstart", function (e) {
  const touch = e.touches[0];
  startX = touch.clientX;
  startY = touch.clientY;
});

canvas.addEventListener("touchend", function (e) {
  const touch = e.changedTouches[0];
  const dx = touch.clientX - startX;
  const dy = touch.clientY - startY;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0) snake.changeDirection("Right");
    else snake.changeDirection("Left");
  } else {
    if (dy > 0) snake.changeDirection("Down");
    else snake.changeDirection("Up");
  }
});

function resetGame() {
  alert("Game Over! Your score: " + score);
  score = 0;
  document.getElementById("score").innerText = score;
  snake = new Snake();
}
