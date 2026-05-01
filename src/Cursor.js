export default class Cursor {
  constructor(cursorElement) {
    this.cursorElement = cursorElement;
    this.isVisible = true;
    this.init();
    if (this.cursorElement) {
      this.cursorElement.style.display = 'block';
    }
  }

  init() {
    document.addEventListener('mousemove', (e) => {
      if (this.cursorElement) {
        this.cursorElement.style.left = `${e.clientX}px`;
        this.cursorElement.style.top = `${e.clientY}px`;
      }
    });

    document.addEventListener('mousedown', () => {
      if (this.cursorElement) {
        this.cursorElement.classList.add('hit');
        setTimeout(() => {
          this.cursorElement.classList.remove('hit');
        }, 100);
      }
    });
  }

  show() {
    if (this.cursorElement) {
      this.cursorElement.style.display = 'block';
      this.isVisible = true;
    }
  }

  hide() {
    if (this.cursorElement) {
      this.cursorElement.style.display = 'none';
      this.isVisible = false;
    }
  }
}
