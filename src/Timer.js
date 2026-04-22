// Константа для времени показа гоблина
const GOBLIN_VISIBLE_TIME_MS = 1000;

export default class Timer {
  constructor() {
    this.timeoutId = null;
    this.onGoblinHide = null;
  }

  setOnGoblinHide(callback) {
    this.onGoblinHide = callback;
  }

  startTimer() {
    this.stopTimer();

    // Использую константу вместо магического числа
    this.timeoutId = setTimeout(() => {
      if (this.onGoblinHide) {
        this.onGoblinHide();
      }
    }, GOBLIN_VISIBLE_TIME_MS);
  }

  stopTimer() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  reset() {
    this.stopTimer();
  }
}
