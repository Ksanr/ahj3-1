import './style.css';
import GameController from './GameController';

const boardContainer = document.getElementById('gameBoard');
const scoreElement = document.getElementById('score');
const missesElement = document.getElementById('misses');
const cursorElement = document.getElementById('customCursor');
const resetButton = document.getElementById('resetButton');
const restartButton = document.getElementById('restartButton');

const game = new GameController(
  boardContainer,
  scoreElement,
  missesElement,
  cursorElement,
);

game.startGame();

resetButton.addEventListener('click', () => {
  game.reset();
});

restartButton.addEventListener('click', () => {
  const gameOverElement = document.getElementById('gameOver');
  if (gameOverElement) {
    gameOverElement.style.display = 'none';
  }
  game.reset();
});
