import goblinImg from './assets/goblin.png';
import Board from './Board';
import ScoreCounter from './ScoreCounter';
import Timer from './Timer';
import Cursor from './Cursor';

export default class GameController {
  constructor(boardContainer, scoreElement, missesElement, cursorElement) {
    this.board = new Board(boardContainer);
    this.scoreCounter = new ScoreCounter(scoreElement, missesElement);
    this.timer = new Timer();
    this.cursor = new Cursor(cursorElement);
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

    this.scoreCounter.incrementScore();
    this.timer.stopTimer();
    this.board.removeGoblin(this.goblinElement);
    this.showGoblin();
  }

  onGoblinHide() {
    if (!this.isGameActive) return;

    this.scoreCounter.incrementMiss();
    this.board.removeGoblin(this.goblinElement);

    if (this.scoreCounter.getMisses() < 5) {
      this.showGoblin();
    }
  }

  showGoblin() {
    if (!this.isGameActive) return;

    if (!this.goblinElement) {
      this.goblinElement = this.createGoblin();
    }

    this.board.placeGoblin(this.goblinElement);
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
    this.cursor.show();
  }

  endGame() {
    this.isGameActive = false;
    this.timer.stopTimer();

    if (this.goblinElement && this.board.getCurrentGoblinCell()) {
      this.board.removeGoblin(this.goblinElement);
    }

    this.cursor.hide();

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
