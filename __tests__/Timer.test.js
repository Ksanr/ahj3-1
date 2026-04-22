import Timer from '../src/Timer';

describe('Timer', () => {
  let timer;

  beforeEach(() => {
    jest.useFakeTimers();
    timer = new Timer();
  });

  afterEach(() => {
    jest.useRealTimers();
    timer.stopTimer();
  });

  describe('startTimer', () => {
    test('должен вызывать callback через 1000 мс', () => {
      const callback = jest.fn();
      timer.setOnGoblinHide(callback);

      timer.startTimer();

      expect(callback).not.toHaveBeenCalled();
      jest.advanceTimersByTime(1000);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    test('должен сбрасывать предыдущий таймер при новом запуске', () => {
      const callback = jest.fn();
      timer.setOnGoblinHide(callback);

      timer.startTimer();
      jest.advanceTimersByTime(500);
      timer.startTimer();
      jest.advanceTimersByTime(500);

      expect(callback).not.toHaveBeenCalled();
      jest.advanceTimersByTime(500);
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('stopTimer', () => {
    test('должен останавливать таймер', () => {
      const callback = jest.fn();
      timer.setOnGoblinHide(callback);

      timer.startTimer();
      timer.stopTimer();
      jest.advanceTimersByTime(1000);

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('reset', () => {
    test('должен останавливать таймер', () => {
      const callback = jest.fn();
      timer.setOnGoblinHide(callback);

      timer.startTimer();
      timer.reset();
      jest.advanceTimersByTime(1000);

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('Timer - дополнительное покрытие', () => {
    test('startTimer должен корректно работать без установленного callback', () => {
      const timerWithoutCallback = new Timer();

      expect(() => {
        timerWithoutCallback.startTimer();
        jest.advanceTimersByTime(1000);
      }).not.toThrow();

      timerWithoutCallback.stopTimer();
    });

    test('stopTimer должен корректно работать если таймер не запущен', () => {
      expect(() => {
        timer.stopTimer();
        timer.stopTimer(); // повторный вызов
      }).not.toThrow();
    });
  });
});
