const BOARD_SIZE = 4;

export default class Board {
  constructor(container) {
    if (!container) {
      throw new Error('Контейнер для игрового поля не найден');
    }
    this.container = container;
    this.cells = [];
    this.goblinCell = null;
  }

  createBoard() {
    if (!this.container) {
      throw new Error('Контейнер не существует');
    }

    this.container.innerHTML = '';
    this.cells = [];

    for (let i = 0; i < BOARD_SIZE * BOARD_SIZE; i += 1) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.index = i;
      this.container.append(cell);
      this.cells.push(cell);
    }
  }

  getRandomCell() {
    if (this.cells.length === 0) {
      throw new Error('Нет доступных ячеек');
    }
    const randomIndex = Math.floor(Math.random() * this.cells.length);
    return this.cells[randomIndex];
  }

  placeGoblin(goblinElement, excludeCell = null) {
    if (!goblinElement) {
      throw new Error('Элемент гоблина не существует');
    }

    // 1. Если гоблин уже где-то есть, удаляем его оттуда
    if (this.goblinCell && this.goblinCell.contains(goblinElement)) {
      goblinElement.remove();
      this.goblinCell.classList.remove('has-goblin');
      this.goblinCell = null;
    }

    // 2. Выбираем новую случайную позицию, отличную от текущей
    let newCell;
    do {
      newCell = this.getRandomCell();
    } while (newCell === excludeCell); // Продолжаем, пока новая ячейка совпадает со старой

    // 3. Помещаем гоблина в новую ячейку
    newCell.append(goblinElement);
    newCell.classList.add('has-goblin');
    this.goblinCell = newCell;
  }

  removeGoblin(goblinElement) {
    if (this.goblinCell && this.goblinCell.contains(goblinElement)) {
      goblinElement.remove();
      this.goblinCell.classList.remove('has-goblin');
      this.goblinCell = null;
    }
  }

  getCurrentGoblinCell() {
    return this.goblinCell;
  }

  addClickListener(callback) {
    if (!callback) return;

    this.cells.forEach((cell) => {
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
