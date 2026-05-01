import Cursor from '../src/Cursor';

describe('Cursor', () => {
  let cursorElement;
  let cursor;

  beforeEach(() => {
    // Гарантируем наличие document.body
    if (!document.body) {
      const body = document.createElement('body');
      document.documentElement.append(body);
    }
    cursorElement = document.createElement('div');
    cursorElement.id = 'customCursor';
    document.body.append(cursorElement);
    cursor = new Cursor(cursorElement);
  });

  afterEach(() => {
    if (document.body && cursorElement) {
      document.body.remove(cursorElement);
    }
  });

  describe('init', () => {
    test('должен отслеживать движение мыши', () => {
      const event = new MouseEvent('mousemove', {
        clientX: 100,
        clientY: 200,
      });
      document.dispatchEvent(event);

      expect(cursorElement.style.left).toBe('100px');
      expect(cursorElement.style.top).toBe('200px');
    });

    test('должен добавлять класс hit при клике', () => {
      const event = new MouseEvent('mousedown');
      document.dispatchEvent(event);

      expect(cursorElement.classList.contains('hit')).toBe(true);
    });

    test('должен удалять класс hit через 100 мс после клика', () => {
      jest.useFakeTimers();

      const event = new MouseEvent('mousedown');
      document.dispatchEvent(event);

      expect(cursorElement.classList.contains('hit')).toBe(true);

      jest.advanceTimersByTime(100);
      expect(cursorElement.classList.contains('hit')).toBe(false);

      jest.useRealTimers();
    });
  });

  describe('show и hide', () => {
    test('show должен делать курсор видимым', () => {
      cursor.hide();
      cursor.show();
      expect(cursorElement.style.display).toBe('block');
      expect(cursor.isVisible).toBe(true);
    });

    test('hide должен скрывать курсор', () => {
      cursor.hide();
      expect(cursorElement.style.display).toBe('none');
      expect(cursor.isVisible).toBe(false);
    });
  });

  describe('Cursor - дополнительное покрытие', () => {
    test('init должен корректно работать если cursorElement отсутствует', () => {
      expect(() => {
        const cursorWithoutElement = new Cursor(null); // переименовали
        expect(cursorWithoutElement).toBeDefined();
        const event = new MouseEvent('mousemove', { clientX: 100, clientY: 100 });
        document.dispatchEvent(event);
      }).not.toThrow();
    });

    test('show и hide должны корректно работать если cursorElement отсутствует', () => {
      const cursorWithoutElement = new Cursor(null); // переименовали
      expect(() => {
        cursorWithoutElement.show();
        cursorWithoutElement.hide();
      }).not.toThrow();
    });
  });

  describe('Cursor - полное покрытие веток', () => {
    test('должен корректно обрабатывать быстрые повторные клики', () => {
      jest.useFakeTimers();

      // Первый клик
      const firstEvent = new MouseEvent('mousedown');
      document.dispatchEvent(firstEvent);
      expect(cursorElement.classList.contains('hit')).toBe(true);

      // Второй клик до окончания анимации
      const secondEvent = new MouseEvent('mousedown');
      document.dispatchEvent(secondEvent);

      // Класс hit должен быть всё ещё активен
      expect(cursorElement.classList.contains('hit')).toBe(true);

      jest.advanceTimersByTime(100);
      expect(cursorElement.classList.contains('hit')).toBe(false);

      jest.useRealTimers();
    });

    test('должен корректно обрабатывать клики когда курсор скрыт', () => {
      cursor.hide();

      const event = new MouseEvent('mousedown');
      document.dispatchEvent(event);

      // Не должно быть ошибки
      expect(cursorElement.classList.contains('hit')).toBe(true);
    });
  });
});
