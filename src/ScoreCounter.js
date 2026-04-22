const MAX_MISSES = 5;

export default class ScoreCounter {
  constructor(scoreElement, missesElement) {
    this.scoreElement = scoreElement;
    this.missesElement = missesElement;
    this.score = 0;
    this.misses = 0;
    this.gameOverCallback = null;
  }

  setGameOverCallback(callback) {
    this.gameOverCallback = callback;
  }

  incrementScore() {
    this.score += 1; // this.score++ → this.score += 1
    this.updateDisplay();
  }

  incrementMiss() {
    this.misses += 1; // this.misses++ → this.misses += 1
    this.updateDisplay();

    if (this.misses >= MAX_MISSES && this.gameOverCallback) {
      this.gameOverCallback();
    }
  }

  updateDisplay() {
    if (this.scoreElement) {
      this.scoreElement.textContent = this.score;
    }
    if (this.missesElement) {
      this.missesElement.textContent = this.misses;
    }
  }

  reset() {
    this.score = 0;
    this.misses = 0;
    this.updateDisplay();
  }

  getScore() {
    return this.score;
  }

  getMisses() {
    return this.misses;
  }
}
