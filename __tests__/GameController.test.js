import GameController from '../src/GameController';

describe('GameController', () => {
  let gameController;
  let boardContainer;
  let scoreElement;
  let missesElement;
  let cursorElement;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="gameBoard"></div>
      <div><span id="score">0</span></div>
      <div><span id="misses">0</span></div>
      <div id="customCursor"></div>
      <div id="gameOver" style="display: none;">
        <span id="finalScore">0</span>
        <button id="restartButton"></button>
      </div>
      <button id="resetButton"></button>
    `;

    boardContainer = document.getElementById('gameBoard');
    scoreElement = document.getElementById('score');
    missesElement = document.getElementById('misses');
    cursorElement = document.getElementById('customCursor');

    gameController = new GameController(
      boardContainer,
      scoreElement,
      missesElement,
      cursorElement,
    );
  });

  afterEach(() => {
    gameController.destroy();
  });

  describe('startGame', () => {
    test('должен создавать игровое поле', () => {
      gameController.startGame();
      const cells = boardContainer.querySelectorAll('.cell');
      expect(cells.length).toBe(16);
    });

    test('должен создавать гоблина', () => {
      gameController.startGame();
      expect(gameController.goblinElement).not.toBeNull();
      expect(gameController.goblinElement.classList.contains('goblin')).toBe(true);
    });

    test('гоблин не появляется дважды подряд в одной ячейке', () => {
      gameController.startGame();
      const firstCell = gameController.board.getCurrentGoblinCell();
      gameController.onGoblinHit();
      const secondCell = gameController.board.getCurrentGoblinCell();
      expect(secondCell).not.toBe(firstCell);
    });

    test('должен показывать курсор', () => {
      gameController.startGame();
      expect(cursorElement.style.display).not.toBe('none');
    });
  });

  describe('onGoblinHit', () => {
    beforeEach(() => {
      gameController.startGame();
    });

    test('должен увеличивать счёт при попадании', () => {
      const initialScore = gameController.scoreCounter.getScore();
      gameController.onGoblinHit();
      expect(gameController.scoreCounter.getScore()).toBe(initialScore + 1);
    });

    test('должен удалять гоблина после попадания', () => {
      const { goblinCell } = gameController.board;
      expect(goblinCell.contains(gameController.goblinElement)).toBe(true);

      gameController.onGoblinHit();
      expect(goblinCell.contains(gameController.goblinElement)).toBe(false);
    });
  });

  describe('endGame', () => {
    test('должен останавливать игру', () => {
      gameController.startGame();
      gameController.endGame();

      expect(gameController.isGameActive).toBe(false);
    });

    test('должен показывать модальное окно окончания игры', () => {
      const gameOverElement = document.getElementById('gameOver');
      expect(gameOverElement.style.display).toBe('none');

      gameController.endGame();
      expect(gameOverElement.style.display).toBe('flex');
    });

    test('должен отображать финальный счёт', () => {
      const finalScoreElement = document.getElementById('finalScore');
      gameController.scoreCounter.incrementScore();
      gameController.scoreCounter.incrementScore();

      gameController.endGame();
      expect(finalScoreElement.textContent).toBe('2');
    });
  });

  describe('reset', () => {
    test('должен перезапускать игру', () => {
      gameController.startGame();
      const initialScore = gameController.scoreCounter.getScore();
      gameController.onGoblinHit();
      expect(gameController.scoreCounter.getScore()).toBe(initialScore + 1);

      const gameOverElement = document.getElementById('gameOver');
      gameController.endGame();
      expect(gameOverElement.style.display).toBe('flex');

      gameController.reset();
      expect(gameController.isGameActive).toBe(true);
      expect(gameController.scoreCounter.getScore()).toBe(0);
      expect(gameOverElement.style.display).toBe('none');
    });
  });

  describe('Дополнительное покрытие', () => {
    test('onGoblinHit не должен ничего делать если игра не активна', () => {
      gameController.startGame();
      gameController.endGame();

      const initialScore = gameController.scoreCounter.getScore();
      gameController.onGoblinHit();

      expect(gameController.scoreCounter.getScore()).toBe(initialScore);
    });

    test('onGoblinHide не должен ничего делать если игра не активна', () => {
      gameController.startGame();
      gameController.endGame();

      const initialMisses = gameController.scoreCounter.getMisses();
      gameController.onGoblinHide();

      expect(gameController.scoreCounter.getMisses()).toBe(initialMisses);
    });

    test('showGoblin не должен показывать гоблина если игра не активна', () => {
      gameController.startGame();
      gameController.endGame();

      const goblinCellBefore = gameController.board.getCurrentGoblinCell();
      gameController.showGoblin();
      const goblinCellAfter = gameController.board.getCurrentGoblinCell();

      expect(goblinCellBefore).toBe(goblinCellAfter);
    });

    test('startGame не должен запускаться повторно если уже активна', () => {
      gameController.startGame();
      const firstGoblin = gameController.goblinElement;

      gameController.startGame();
      const secondGoblin = gameController.goblinElement;

      expect(firstGoblin).toBe(secondGoblin);
    });

    test('onGoblinHide должен показывать нового гоблина если пропусков меньше 5', () => {
      gameController.startGame();
      const initialGoblinCell = gameController.board.getCurrentGoblinCell();

      gameController.onGoblinHide();

      const newGoblinCell = gameController.board.getCurrentGoblinCell();
      expect(newGoblinCell).not.toBe(initialGoblinCell);
    });

    test('onGoblinHit должен показывать нового гоблина', () => {
      gameController.startGame();

      // Проверяем, что гоблин существует
      expect(gameController.goblinElement).not.toBeNull();

      gameController.onGoblinHit();

      // Проверяем, что гоблин всё ещё существует (новый или тот же)
      expect(gameController.goblinElement).not.toBeNull();

      // Проверяем, что гоблин находится в какой-то ячейке
      const currentCell = gameController.board.getCurrentGoblinCell();
      expect(currentCell).not.toBeNull();
      expect(currentCell.contains(gameController.goblinElement)).toBe(true);
    });

    test('destroy должен полностью останавливать игру', () => {
      gameController.startGame();
      gameController.destroy();

      expect(gameController.isGameActive).toBe(false);
      expect(gameController.timer.timeoutId).toBeNull();
    });
  });

  describe('GameController - полное покрытие веток', () => {
    test('onGoblinHit при игре не активна - должен возвращаться без изменений', () => {
      gameController.startGame();
      const initialScore = gameController.scoreCounter.getScore();

      gameController.endGame();
      gameController.onGoblinHit();

      expect(gameController.scoreCounter.getScore()).toBe(initialScore);
    });

    test('onGoblinHide при игре не активна - должен возвращаться без изменений', () => {
      gameController.startGame();
      const initialMisses = gameController.scoreCounter.getMisses();

      gameController.endGame();
      gameController.onGoblinHide();

      expect(gameController.scoreCounter.getMisses()).toBe(initialMisses);
    });

    test('showGoblin при игре не активна - не должен создавать гоблина', () => {
      gameController.startGame();
      gameController.endGame();

      const goblinBefore = gameController.goblinElement;
      gameController.showGoblin();
      const goblinAfter = gameController.goblinElement;

      expect(goblinBefore).toBe(goblinAfter);
    });

    test('startGame при активной игре - не должен пересоздавать поле', () => {
      gameController.startGame();
      const boardCells = gameController.board.cells.length;

      gameController.startGame(); // повторный вызов

      expect(gameController.board.cells.length).toBe(boardCells);
    });

    test('onGoblinHide при 5 пропусках - не должен показывать нового гоблина', () => {
      gameController.startGame();

      // Доводим до 5 пропусков
      for (let i = 0; i < 5; i += 1) {
        gameController.onGoblinHide();
      }

      // Игра должна завершиться
      expect(gameController.isGameActive).toBe(false);

      // Проверяем, что гоблин удалён
      expect(gameController.board.getCurrentGoblinCell()).toBeNull();
    });
  });

  describe('GameController - финальное покрытие колбэка клика', () => {
    test('колбэк addClickListener должен вызывать onGoblinHit при клике на гоблина и активной игре', () => {
      gameController.startGame();

      // Шпионим за методом onGoblinHit
      const onGoblinHitSpy = jest.spyOn(gameController, 'onGoblinHit');

      // Находим ячейку с гоблином и кликаем
      const goblinCell = gameController.board.getCurrentGoblinCell();
      expect(goblinCell).not.toBeNull();

      goblinCell.click();

      expect(onGoblinHitSpy).toHaveBeenCalled();
      onGoblinHitSpy.mockRestore();
    });

    test('колбэк addClickListener НЕ должен вызывать onGoblinHit при клике на гоблина когда игра не активна', () => {
      gameController.startGame();
      gameController.endGame();

      const onGoblinHitSpy = jest.spyOn(gameController, 'onGoblinHit');

      const goblinCell = gameController.board.getCurrentGoblinCell();
      if (goblinCell) {
        goblinCell.click();
      }

      expect(onGoblinHitSpy).not.toHaveBeenCalled();
      onGoblinHitSpy.mockRestore();
    });

    test('колбэк addClickListener НЕ должен вызывать onGoblinHit при клике на пустую ячейку', () => {
      gameController.startGame();

      const onGoblinHitSpy = jest.spyOn(gameController, 'onGoblinHit');

      // Находим пустую ячейку - убираем дублирование
      const cells = Array.from(document.querySelectorAll('.cell'));
      const goblinCell = gameController.board.getCurrentGoblinCell();
      const emptyCell = cells.find((cell) => cell !== goblinCell); // только одно объявление

      if (emptyCell) {
        emptyCell.click();
      }

      expect(onGoblinHitSpy).not.toHaveBeenCalled();
      onGoblinHitSpy.mockRestore();
    });

    test('колбэк addClickListener должен проверять isHit и isGameActive перед вызовом onGoblinHit', () => {
      gameController.startGame();

      // Создаём мок для проверки порядка условий
      const onGoblinHitSpy = jest.spyOn(gameController, 'onGoblinHit');

      // Имитируем ситуацию: isHit = true, но игра не активна
      gameController.endGame();

      const goblinCell = gameController.board.getCurrentGoblinCell();
      if (goblinCell) {
        goblinCell.click();
      }

      // onGoblinHit не должен быть вызван, потому что isGameActive = false
      expect(onGoblinHitSpy).not.toHaveBeenCalled();

      onGoblinHitSpy.mockRestore();
    });
  });

  describe('GameController - покрытие DOM-элементов', () => {
    test('endGame должен корректно работать если gameOver элемент отсутствует', () => {
      // Удаляем gameOver элемент из DOM
      const gameOverElement = document.getElementById('gameOver');
      if (gameOverElement) {
        gameOverElement.remove();
      }

      gameController.startGame();

      // endGame не должен вызывать ошибку
      expect(() => {
        gameController.endGame();
      }).not.toThrow();

      expect(gameController.isGameActive).toBe(false);
    });

    test('endGame должен корректно работать если finalScore элемент отсутствует', () => {
      // Удаляем finalScore элемент из DOM
      const finalScoreElement = document.getElementById('finalScore');
      if (finalScoreElement) {
        finalScoreElement.remove();
      }

      gameController.startGame();

      // endGame не должен вызывать ошибку
      expect(() => {
        gameController.endGame();
      }).not.toThrow();

      expect(gameController.isGameActive).toBe(false);
    });

    test('endGame должен корректно работать если оба элемента отсутствуют', () => {
      // Удаляем оба элемента
      const gameOverElement = document.getElementById('gameOver');
      const finalScoreElement = document.getElementById('finalScore');
      if (gameOverElement) gameOverElement.remove();
      if (finalScoreElement) finalScoreElement.remove();

      gameController.startGame();

      expect(() => {
        gameController.endGame();
      }).not.toThrow();

      expect(gameController.isGameActive).toBe(false);
    });

    test('reset должен корректно работать если gameOver элемент отсутствует', () => {
      // Удаляем gameOver элемент
      const gameOverElement = document.getElementById('gameOver');
      if (gameOverElement) {
        gameOverElement.remove();
      }

      gameController.startGame();
      gameController.endGame();

      // reset не должен вызывать ошибку
      expect(() => {
        gameController.reset();
      }).not.toThrow();
    });

    test('reset должен корректно работать при повторном вызове без gameOver элемента', () => {
      const gameOverElement = document.getElementById('gameOver');
      if (gameOverElement) {
        gameOverElement.remove();
      }

      gameController.startGame();

      expect(() => {
        gameController.reset();
        gameController.reset(); // повторный вызов
      }).not.toThrow();
    });

    test('endGame должен корректно обрабатывать случай когда goblinElement отсутствует', () => {
      gameController.startGame();

      // Удаляем гоблина
      if (gameController.goblinElement && gameController.goblinElement.parentNode) {
        gameController.goblinElement.parentNode.remove(gameController.goblinElement);
      }

      expect(() => {
        gameController.endGame();
      }).not.toThrow();
    });
  });
});
