import goblinImg from './assets/goblin.png';
import Board from './Board';
import ScoreCounter from './ScoreCounter';
import Timer from './Timer';
import Cursor from './Cursor';

// Константа только для MAX_MISSES (GOBLIN_VISIBLE_TIME_MS удалена, так как используется в Timer.js)
const MAX_MISSES = 5;

export default class GameController {
  constructor(boardContainer, scoreElement, missesElement, cursorElement) {
    this.board = new Board(boardContainer);
    this.scoreCounter = new ScoreCounter(scoreElement, missesElement);
    this.timer = new Timer();
    this.cursor = new Cursor(cursorElement);
    this.cursor.show();
    this.goblinElement = null;
    this.isGameActive = false;

    this.scoreCounter.setGameOverCallback(() => this.endGame());
    this.timer.setOnGoblinHide(() => this.onGoblinHide());
  }

  createGoblin() {
    const img = document.createElement('img');
    img.src = goblinImg;
    img.className = 'goblin';
    img.alt = 'Goblin';
    return img;
  }

  onGoblinHit() {
    if (!this.isGameActive) return;

    const previousCell = this.board.getCurrentGoblinCell(); // текущая ячейка

    this.scoreCounter.incrementScore();
    this.timer.stopTimer();
    this.board.removeGoblin(this.goblinElement);
    this.showGoblin(previousCell);
  }

  onGoblinHide() {
    if (!this.isGameActive) return;

    const previousCell = this.board.getCurrentGoblinCell(); // текущая ячейка
    this.scoreCounter.incrementMiss();
    this.board.removeGoblin(this.goblinElement);

    if (this.scoreCounter.getMisses() < MAX_MISSES) {
      this.showGoblin(previousCell);
    }
  }

  showGoblin(excludeCell = null) {
    if (!this.isGameActive) return;

    if (!this.goblinElement) {
      this.goblinElement = this.createGoblin();
    }

    this.board.placeGoblin(this.goblinElement, excludeCell);
    this.timer.startTimer();
  }

  startGame() {
    if (this.isGameActive) return;

    this.isGameActive = true;
    this.scoreCounter.reset();
    this.board.createBoard();
    this.board.addClickListener((isHit) => {
      if (isHit && this.isGameActive) {
        this.onGoblinHit();
      }
    });

    this.showGoblin();
    // удаляю следующую строку, так как курсор не скрываю
    // this.cursor.show();
  }

  endGame() {
    this.isGameActive = false;
    this.timer.stopTimer();

    if (this.goblinElement && this.board.getCurrentGoblinCell()) {
      this.board.removeGoblin(this.goblinElement);
    }

    // удалил строку, так как терялся курсор
    // this.cursor.hide();

    const gameOverElement = document.getElementById('gameOver');
    const finalScoreElement = document.getElementById('finalScore');
    if (gameOverElement && finalScoreElement) {
      finalScoreElement.textContent = this.scoreCounter.getScore();
      gameOverElement.style.display = 'flex';
    }
  }

  reset() {
    this.endGame();
    const gameOverElement = document.getElementById('gameOver');
    if (gameOverElement) {
      gameOverElement.style.display = 'none';
    }
    this.startGame();
  }

  destroy() {
    this.isGameActive = false;
    this.timer.stopTimer();
    this.cursor.hide();
  }
}
