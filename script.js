const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;

// Base objects
const player = { x: canvas.width / 2, y: canvas.height - 80, w: 50, h: 50, lives: 3, color: '#66f' };
const bullets = [];
const enemies = [];
const sparkles = [];
let score = 0;
let level = 1;

// Player input
let keys = {};
window.addEventListener('keydown', e => keys[e.key] = true);
window.addEventListener('keyup', e => keys[e.key] = false);

// Sparkle background
class Sparkle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2;
    this.speed = Math.random() * 1 + 0.5;
  }
  update() {
    this.y += this.speed;
    if (this.y > canvas.height) this.y = 0;
  }
  draw() {
    ctx.fillStyle = '#fff';
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}

for (let i = 0; i < 100; i++) sparkles.push(new Sparkle());

// Enemy class
class Enemy {
  constructor(x, y, w, h, speed, color) {
    this.x = x; this.y = y; this.w = w; this.h = h;
    this.speed = speed; this.color = color;
  }
  update() {
    this.y += this.speed;
    if (this.y > canvas.height) this.reset();
  }
  reset() {
    this.x = Math.random() * (canvas.width - this.w);
    this.y = -20;
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
}

// Game loop
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // sparkles
  sparkles.forEach(s => { s.update(); s.draw(); });

  // player move
  if (keys['ArrowLeft'] && player.x > 0) player.x -= 5;
  if (keys['ArrowRight'] && player.x < canvas.width - player.w) player.x += 5;
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.w, player.h);

  // bullets
  bullets.forEach((b, i) => {
    b.y -= 7;
    if (b.y < 0) bullets.splice(i, 1);
    ctx.fillStyle = '#0f0';
    ctx.fillRect(b.x, b.y, 5, 10);
  });

  // enemies
  enemies.forEach((e, i) => {
    e.update(); e.draw();
    // collision check
    bullets.forEach((b, j) => {
      if (b.x < e.x + e.w && b.x + 5 > e.x && b.y < e.y + e.h && b.y + 10 > e.y) {
        enemies.splice(i, 1);
        bullets.splice(j, 1);
        score += 10;
        if (score % 100 === 0) nextLevel();
      }
    });
    if (e.y + e.h > player.y && e.x < player.x + player.w && e.x + e.w > player.x) {
      player.lives--;
      enemies.splice(i, 1);
      if (player.lives <= 0) gameOver();
    }
  });

  ctx.fillStyle = '#fff';
  ctx.fillText(`Score: ${score}`, 20, 30);
  ctx.fillText(`Lives: ${player.lives}`, 20, 50);
  ctx.fillText(`Level: ${level}`, 20, 70);

  requestAnimationFrame(update);
}

function shoot() {
  bullets.push({ x: player.x + player.w / 2 - 2, y: player.y, speed: 5 });
}

function spawnEnemies() {
  for (let i = 0; i < level * 5; i++) {
    enemies.push(new Enemy(Math.random() * canvas.width, Math.random() * -canvas.height, 40, 40, Math.random() * 2 + 1, '#f44'));
  }
}

function nextLevel() {
  level++;
  spawnEnemies();
}

function gameOver() {
  alert(`Game Over! Score: ${score}`);
  document.location.reload();
}

// shoot on spacebar
window.addEventListener('keydown', e => {
  if (e.code === 'Space') shoot();
});

spawnEnemies();
update();
