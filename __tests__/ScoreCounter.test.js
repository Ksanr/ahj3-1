import ScoreCounter from '../src/ScoreCounter';

describe('ScoreCounter', () => {
  let scoreCounter;
  let scoreElement;
  let missesElement;

  beforeEach(() => {
    scoreElement = document.createElement('span');
    missesElement = document.createElement('span');
    scoreCounter = new ScoreCounter(scoreElement, missesElement);
  });

  describe('incrementScore', () => {
    test('должен увеличивать счёт на 1', () => {
      scoreCounter.incrementScore();
      expect(scoreCounter.getScore()).toBe(1);

      scoreCounter.incrementScore();
      expect(scoreCounter.getScore()).toBe(2);
    });

    test('должен обновлять отображение счёта', () => {
      scoreCounter.incrementScore();
      expect(scoreElement.textContent).toBe('1');
    });
  });

  describe('incrementMiss', () => {
    test('должен увеличивать пропуски на 1', () => {
      scoreCounter.incrementMiss();
      expect(scoreCounter.getMisses()).toBe(1);

      scoreCounter.incrementMiss();
      expect(scoreCounter.getMisses()).toBe(2);
    });

    test('должен обновлять отображение пропусков', () => {
      scoreCounter.incrementMiss();
      expect(missesElement.textContent).toBe('1');
    });

    test('должен вызывать callback при достижении 5 пропусков', () => {
      const callback = jest.fn();
      scoreCounter.setGameOverCallback(callback);

      for (let i = 0; i < 5; i += 1) {
        scoreCounter.incrementMiss();
      }

      expect(callback).toHaveBeenCalledTimes(1);
    });

    test('не должен вызывать callback до достижения 5 пропусков', () => {
      const callback = jest.fn();
      scoreCounter.setGameOverCallback(callback);

      for (let i = 0; i < 4; i += 1) {
        scoreCounter.incrementMiss();
      }

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('reset', () => {
    test('должен сбрасывать счёт и пропуски до 0', () => {
      scoreCounter.incrementScore();
      scoreCounter.incrementMiss();
      scoreCounter.incrementMiss();

      scoreCounter.reset();

      expect(scoreCounter.getScore()).toBe(0);
      expect(scoreCounter.getMisses()).toBe(0);
      expect(scoreElement.textContent).toBe('0');
      expect(missesElement.textContent).toBe('0');
    });
  });

  describe('updateDisplay', () => {
    test('должен обновлять отображение при изменении значений', () => {
      scoreCounter.incrementScore();
      expect(scoreElement.textContent).toBe('1');

      scoreCounter.incrementMiss();
      expect(missesElement.textContent).toBe('1');
    });
  });

  describe('ScoreCounter - дополнительное покрытие', () => {
    test('updateDisplay должен корректно работать если элементы отсутствуют', () => {
      const counterWithoutElements = new ScoreCounter(null, null);

      expect(() => {
        counterWithoutElements.incrementScore();
        counterWithoutElements.incrementMiss();
        counterWithoutElements.reset();
      }).not.toThrow();
    });

    test('setGameOverCallback должен корректно устанавливать callback', () => {
      const callback = jest.fn();
      scoreCounter.setGameOverCallback(callback);

      for (let i = 0; i < 5; i += 1) {
        scoreCounter.incrementMiss();
      }

      expect(callback).toHaveBeenCalled();
    });
  });
});
