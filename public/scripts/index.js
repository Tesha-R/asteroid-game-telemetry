import { Player } from './Player.js';
import { Shooter } from './Shooter.js';
import { Asteroid } from './Asteroid.js';
import { context, canvas } from './CanvasUtil.js';

import '../../client-side-tracing.js';
// import './document-load-tracing';
// import './user-interactions-tracing';

// Game UI elements
let gameOverTxt = document.getElementById('gameOver');
let restartButton = document.getElementById('restartButton'); // Create this in your HTML
let playerScore = document.getElementById('player-score');
const startButton = document.getElementById('startButton');

const playerSpeed = 3;
const rotateSpeed = 0.05;
const frictionSpeed = 0.94; // slow down over time
const shooterSpeed = 3;

const shots = [];
const asteroids = [];

let intervalId;
let currentScore = 0;

// Initialize game on "Start" button click
startButton.addEventListener('click', () => {
  startButton.style.display = 'none'; // hide start button
  //currentScore = 0;
  startGame();
});

// startGame initializes and starts the animation.
function startGame() {
  initializeGame();
  animate();
  playerScore.innerHTML = currentScore;
}

// initializeGame resets the game state and entities
function initializeGame() {
  gameOverTxt.style.display = 'none';
  restartButton.style.display = 'none';
  // clear my existing shots and asteroids
  asteroids.length = 0;
  shots.length = 0;

  // re-initialize player
  player.position = { x: canvas.width / 2, y: canvas.height / 2 };
  player.velocity = { x: 0, y: 0 };
  player.rotation = 0;

  intervalId = setInterval(spawnAsteroids, 3000);
  currentScore = 0;
}

// restartGame calls startGame to restart
function restartGame() {
  startGame();
}

function gameOver(animateId) {
  // Display game over message with scores
  gameOverTxt.innerHTML = `GAME OVER`;
  gameOverTxt.style.display = 'block';
  restartButton.style.display = 'block';
  // Stop the animation and asteroid spawning
  window.cancelAnimationFrame(animateId);
  clearInterval(intervalId);
}

restartButton.addEventListener('click', restartGame);

// Game controls - keyboard
const keys = {
  arrowUp: {
    pressed: false,
  },
  arrowLeft: {
    pressed: false,
  },
  arrowRight: {
    pressed: false,
  },
  arrowDown: {
    pressed: false,
  },
};
// a players movement is always determined by velocity.x and velocity.y
// moving at a rate of 1 pixel per second
const player = new Player({
  position: { x: canvas.width / 2, y: canvas.height / 2 },
  velocity: { x: 0, y: 0 },
});

player.update();

// Asteroids moving on the screen
function spawnAsteroids() {
  const index = Math.floor(Math.random() * 4);
  let x, y;
  let velocityX, velocityY;
  let radius = 50 * Math.random() + 10;

  switch (index) {
    case 0: // left side of the screen
      x = 0 - radius;
      y = Math.random() * canvas.height;
      velocityX = 1;
      velocityY = 0;

      break;
    case 1: // bottom side of the screen
      x = Math.random() * canvas.width;
      y = canvas.height + radius;
      velocityX = 0;
      velocityY = -1;

      break;
    case 2: // right side of the screen
      x = canvas.width + radius;
      y = 0 - Math.random() * canvas.height;
      velocityX = -1;
      velocityY = 0;

      break;
    case 3: // top side of the screen
      x = Math.random() * canvas.width;
      y = 0 - radius;
      velocityX = 0;
      velocityY = 1;

      break;
  }

  asteroids.push(
    new Asteroid({
      position: {
        x: x,
        y: y,
      },
      velocity: {
        x: velocityX,
        y: velocityY,
      },
      radius,
    })
  );
}

// Game play
function animate() {
  const animateId = window.requestAnimationFrame(animate);
  context.fillStyle = 'black';
  context.fillRect(0, 0, canvas.width, canvas.height);

  player.update();

  for (let i = shots.length - 1; i >= 0; i--) {
    const shot = shots[i];
    shot.update();

    // removing shots
    if (
      shot.position.x + shot.radius < 0 ||
      shot.position.x - shot.radius > canvas.width ||
      shot.position.y - shot.radius > canvas.height ||
      shot.position.y + shot.radius < 0
    ) {
      shots.splice(i, 1);
    }
  }

  // Asteroid rendering managment
  for (let i = asteroids.length - 1; i >= 0; i--) {
    const asteroid = asteroids[i];
    asteroid.update();
    if (circleTriangleCollision(asteroid, player.getVertices())) {
      gameOver(animateId);
      return; // stop animation updating
    }

    // removing asteroids
    if (
      asteroid.position.x + asteroid.radius < 0 ||
      asteroid.position.x - asteroid.radius > canvas.width ||
      asteroid.position.y - asteroid.radius > canvas.height ||
      asteroid.position.y + asteroid.radius < 0
    ) {
      asteroids.splice(i, 1);
    }
    // for shots
    for (let j = shots.length - 1; j >= 0; j--) {
      const shot = shots[j];

      if (circleCollision(asteroid, shot)) {
        // console.log('BIG COLLIDE');
        asteroids.splice(i, 1);
        shots.splice(j, 1);
        // increment score
        currentScore += 10;
        playerScore.innerHTML = currentScore;
        //console.log('score', currentScore);
      }
    }
  }

  if (keys.arrowUp.pressed) {
    player.velocity.x = Math.cos(player.rotation) * playerSpeed;
    player.velocity.y = Math.sin(player.rotation) * playerSpeed;
  } else if (!keys.arrowUp.pressed) {
    player.velocity.x *= frictionSpeed;
    player.velocity.y *= frictionSpeed;
  }

  if (keys.arrowLeft.pressed) player.rotation -= rotateSpeed;
  else if (keys.arrowRight.pressed) player.rotation += rotateSpeed;
}

// Keydown event listener
window.addEventListener('keydown', (event) => {
  switch (event.code) {
    case 'ArrowUp': // thrust to go
      keys.arrowUp.pressed = true;
      break;
    case 'ArrowLeft':
      keys.arrowLeft.pressed = true;

      break;
    case 'ArrowRight':
      keys.arrowRight.pressed = true;

      break;
    case 'ArrowDown':
      keys.arrowDown.pressed = true;

      break;
    case 'Space':
      shots.push(
        new Shooter({
          position: {
            x: player.position.x + Math.cos(player.rotation) * 30,
            y: player.position.y + Math.sin(player.rotation) * 30,
          },
          velocity: {
            x: Math.cos(player.rotation) * shooterSpeed,
            y: Math.sin(player.rotation) * shooterSpeed,
          },
        })
      );
      break;
  }
  // console.log(event)
});

// Keyup event listener
window.addEventListener('keyup', (event) => {
  switch (event.code) {
    case 'ArrowUp': // thrust to go
      keys.arrowUp.pressed = false;
      break;
    case 'ArrowLeft':
      keys.arrowLeft.pressed = false;

      break;
    case 'ArrowRight':
      keys.arrowRight.pressed = false;

      break;
    case 'ArrowDown':
      keys.arrowDown.pressed = false;

      break;
  }
  // console.log(event)
});

function circleCollision(circle1, circle2) {
  const xDistance = circle2.position.x - circle1.position.x;
  const yDistance = circle2.position.y - circle1.position.y;
  const distance = Math.sqrt(xDistance * xDistance + yDistance * yDistance);

  if (distance <= circle1.radius + circle2.radius) {
    //console.log('two have collided');
    return true;
  }
  return false;
}

function circleTriangleCollision(circle, triangle) {
  // Check if the circle is colliding with any of the triangle's edges
  for (let i = 0; i < 3; i++) {
    let start = triangle[i];
    let end = triangle[(i + 1) % 3];

    let dx = end.x - start.x;
    let dy = end.y - start.y;
    let length = Math.sqrt(dx * dx + dy * dy);

    let dot =
      ((circle.position.x - start.x) * dx +
        (circle.position.y - start.y) * dy) /
      Math.pow(length, 2);

    let closestX = start.x + dot * dx;
    let closestY = start.y + dot * dy;

    if (!isPointOnLineSegment(closestX, closestY, start, end)) {
      closestX = closestX < start.x ? start.x : end.x;
      closestY = closestY < start.y ? start.y : end.y;
    }

    dx = closestX - circle.position.x;
    dy = closestY - circle.position.y;

    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= circle.radius) {
      return true;
    }
  }

  // No collision
  return false;
}

function isPointOnLineSegment(x, y, start, end) {
  return (
    x >= Math.min(start.x, end.x) &&
    x <= Math.max(start.x, end.x) &&
    y >= Math.min(start.y, end.y) &&
    y <= Math.max(start.y, end.y)
  );
}
