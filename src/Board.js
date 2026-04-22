const BOARD_SIZE = 4;

export default class Board {
  constructor(container) {
    this.container = container;
    this.cells = [];
    this.goblinCell = null;
  }

  createBoard() {
    this.container.innerHTML = '';
    this.cells = [];

    for (let i = 0; i < BOARD_SIZE * BOARD_SIZE; i += 1) { // i++ → i += 1
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.index = i;
      this.container.appendChild(cell);
      this.cells.push(cell);
    }
  }

  getRandomCell() {
    const randomIndex = Math.floor(Math.random() * this.cells.length);
    return this.cells[randomIndex];
  }

  placeGoblin(goblinElement) {
    if (this.goblinCell && this.goblinCell.contains(goblinElement)) {
      this.goblinCell.removeChild(goblinElement);
    }

    let newCell;
    do {
      newCell = this.getRandomCell();
    } while (newCell === this.goblinCell);

    newCell.appendChild(goblinElement);
    newCell.classList.add('has-goblin');
    this.goblinCell = newCell;
  }

  removeGoblin(goblinElement) {
    if (this.goblinCell && this.goblinCell.contains(goblinElement)) {
      this.goblinCell.removeChild(goblinElement);
      this.goblinCell.classList.remove('has-goblin');
      this.goblinCell = null;
    }
  }

  getCurrentGoblinCell() {
    return this.goblinCell;
  }

  addClickListener(callback) {
    this.cells.forEach((cell) => { // добавили скобки вокруг cell
      cell.addEventListener('click', () => {
        callback(cell === this.goblinCell, cell);
      });
    });
  }

  reset() {
    if (this.goblinCell) {
      this.goblinCell.classList.remove('has-goblin');
      this.goblinCell = null;
    }
  }
}
