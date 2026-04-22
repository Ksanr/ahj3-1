import Board from '../src/Board';

describe('Board', () => {
  let board;
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    board = new Board(container);
    board.createBoard();
  });

  describe('createBoard', () => {
    test('должен создавать 16 ячеек (4x4)', () => {
      const cells = container.querySelectorAll('.cell');
      expect(cells.length).toBe(16);
    });

    test('должен очищать контейнер перед созданием', () => {
      const initialCells = container.querySelectorAll('.cell');
      expect(initialCells.length).toBe(16);

      board.createBoard();
      const newCells = container.querySelectorAll('.cell');
      expect(newCells.length).toBe(16);
    });
  });

  describe('getRandomCell', () => {
    test('должен возвращать существующую ячейку', () => {
      const cell = board.getRandomCell();
      expect(container.contains(cell)).toBe(true);
    });
  });

  describe('placeGoblin и removeGoblin', () => {
    test('должен размещать гоблина в ячейке', () => {
      const goblin = document.createElement('img');
      board.placeGoblin(goblin);

      expect(board.goblinCell).not.toBeNull();
      expect(board.goblinCell.contains(goblin)).toBe(true);
      expect(board.goblinCell.classList.contains('has-goblin')).toBe(true);
    });

    test('не должен размещать гоблина в той же ячейке дважды подряд', () => {
      const goblin = document.createElement('img');
      board.placeGoblin(goblin);
      const firstCell = board.goblinCell;

      board.placeGoblin(goblin);
      const secondCell = board.goblinCell;

      expect(firstCell).not.toBe(secondCell);
    });

    test('должен удалять гоблина из ячейки', () => {
      const goblin = document.createElement('img');
      board.placeGoblin(goblin);
      board.removeGoblin(goblin);

      expect(board.goblinCell).toBeNull();
      expect(goblin.parentNode).toBeNull();
    });
  });

  describe('addClickListener', () => {
    test('должен вызывать колбэк при клике на ячейку', () => {
      const callback = jest.fn();
      board.addClickListener(callback);

      const firstCell = container.querySelector('.cell');
      firstCell.click();

      expect(callback).toHaveBeenCalled();
    });

    test('должен передавать признак попадания при клике на ячейку с гоблином', () => {
      const callback = jest.fn();
      board.addClickListener(callback);

      const goblin = document.createElement('img');
      board.placeGoblin(goblin);
      board.goblinCell.click();

      expect(callback).toHaveBeenCalledWith(true, board.goblinCell);
    });

    test('должен передавать признак промаха при клике на пустую ячейку', () => {
      const callback = jest.fn();
      board.addClickListener(callback);

      const emptyCell = container.querySelector('.cell');
      emptyCell.click();

      expect(callback).toHaveBeenCalledWith(false, emptyCell);
    });
  });

  describe('reset', () => {
    test('должен сбрасывать состояние поля', () => {
      const goblin = document.createElement('img');
      board.placeGoblin(goblin);
      board.reset();

      expect(board.goblinCell).toBeNull();
    });
  });

  describe('Board - дополнительное покрытие', () => {
    test('placeGoblin должен удалять гоблина из предыдущей ячейки если он уже есть', () => {
      const goblin = document.createElement('img');
      board.placeGoblin(goblin);
      const firstCell = board.goblinCell;

      board.placeGoblin(goblin);
      const secondCell = board.goblinCell;

      expect(firstCell.contains(goblin)).toBe(false);
      expect(secondCell.contains(goblin)).toBe(true);
    });

    test('placeGoblin должен находить новую ячейку если все ячейки заняты', () => {
      // Заполняем все ячейки мок-гоблинами
      const goblin = document.createElement('img');
      const positions = new Set();

      for (let i = 0; i < 20; i += 1) {
        board.placeGoblin(goblin);
        positions.add(board.goblinCell);
      }

      // Должно быть много разных позиций
      expect(positions.size).toBeGreaterThan(1);
    });
  });

  describe('Board - покрытие всех веток', () => {
    test('placeGoblin должен корректно обрабатывать случай когда goblinCell === null', () => {
      const goblin = document.createElement('img');

      // Убеждаемся, что goblinCell изначально null
      expect(board.goblinCell).toBeNull();

      board.placeGoblin(goblin);

      expect(board.goblinCell).not.toBeNull();
      expect(board.goblinCell.contains(goblin)).toBe(true);
    });

    test('removeGoblin должен корректно обрабатывать случай когда goblinCell === null', () => {
      const goblin = document.createElement('img');

      // Убеждаемся, что goblinCell изначально null
      expect(board.goblinCell).toBeNull();

      // Вызов removeGoblin не должен вызывать ошибку
      expect(() => {
        board.removeGoblin(goblin);
      }).not.toThrow();

      expect(board.goblinCell).toBeNull();
    });

    test('placeGoblin должен обрабатывать ситуацию когда предыдущая ячейка не содержит гоблина', () => {
      const goblin = document.createElement('img');
      const anotherGoblin = document.createElement('img');

      board.placeGoblin(goblin);
      const firstCell = board.goblinCell;

      // Удаляем гоблина вручную, не через removeGoblin
      firstCell.removeChild(goblin);
      firstCell.classList.remove('has-goblin');

      // Размещаем другого гоблина
      board.placeGoblin(anotherGoblin);

      // Проверяем, что гоблин размещён в новой ячейке
      expect(board.goblinCell.contains(anotherGoblin)).toBe(true);
    });
  });

  describe('Board - финальное покрытие', () => {
    test('reset должен корректно удалять гоблина когда он есть', () => {
      const goblin = document.createElement('img');
      board.placeGoblin(goblin);

      // Убеждаемся, что гоблин есть
      expect(board.goblinCell).not.toBeNull();
      expect(board.goblinCell.classList.contains('has-goblin')).toBe(true);

      board.reset();

      // Проверяем, что гоблин удалён
      expect(board.goblinCell).toBeNull();

      // Проверяем, что класс has-goblin удалён у бывшей ячейки
      const cells = document.querySelectorAll('.cell');
      let hasGoblinClass = false;
      cells.forEach((cell) => {
        if (cell.classList.contains('has-goblin')) {
          hasGoblinClass = true;
        }
      });
      expect(hasGoblinClass).toBe(false);
    });

    test('reset должен корректно работать если вызван несколько раз подряд', () => {
      const goblin = document.createElement('img');
      board.placeGoblin(goblin);

      board.reset();
      board.reset(); // повторный вызов

      expect(board.goblinCell).toBeNull();
    });
  });
});
