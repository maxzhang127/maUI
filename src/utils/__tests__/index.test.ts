import {
  generateId,
  classNames,
  deepMerge,
  debounce,
  throttle,
  supportsWebComponents,
  injectStyles,
} from '../index';

describe('工具函数测试', () => {
  describe('generateId', () => {
    it('应该生成带前缀的唯一ID', () => {
      const id1 = generateId('test');
      const id2 = generateId('test');

      expect(id1).toMatch(/^test-[a-z0-9]+$/);
      expect(id2).toMatch(/^test-[a-z0-9]+$/);
      expect(id1).not.toBe(id2);
    });

    it('应该使用默认前缀', () => {
      const id = generateId();
      expect(id).toMatch(/^ma-[a-z0-9]+$/);
    });
  });

  describe('classNames', () => {
    it('应该正确合并类名', () => {
      const result = classNames('class1', 'class2', 'class3');
      expect(result).toBe('class1 class2 class3');
    });

    it('应该过滤掉falsy值', () => {
      const result = classNames('class1', null, undefined, '', 'class2');
      expect(result).toBe('class1 class2');
    });

    it('空参数应该返回空字符串', () => {
      const result = classNames();
      expect(result).toBe('');
    });
  });

  describe('deepMerge', () => {
    it('应该深度合并对象', () => {
      type Target = {
        a: number;
        b: {
          c: number;
          d: number;
          e?: number;
        };
        f?: number;
      };

      const target: Target = {
        a: 1,
        b: {
          c: 2,
          d: 3,
        },
      };

      const source: Partial<Target> = {
        b: {
          c: 2, // 保持原有的 c 属性
          d: 4,
          e: 5,
        },
        f: 6,
      };

      const result = deepMerge(target, source);

      expect(result).toEqual({
        a: 1,
        b: {
          c: 2,
          d: 4,
          e: 5,
        },
        f: 6,
      });
    });

    it('不应该修改原对象', () => {
      type Target = {
        a: number;
        b: {
          c: number;
          d?: number;
        };
      };

      const target: Target = { a: 1, b: { c: 2 } };
      const source: Partial<Target> = { b: { c: 2, d: 3 } };

      deepMerge(target, source);

      expect(target).toEqual({ a: 1, b: { c: 2 } });
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('应该延迟执行函数', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('应该在等待时间内重置计时器', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      jest.advanceTimersByTime(50);
      debouncedFn();
      jest.advanceTimersByTime(50);

      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(50);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('throttle', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('应该限制函数执行频率', () => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 100);

      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(1);

      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(100);
      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });

  describe('supportsWebComponents', () => {
    it('应该检测Web Components支持', () => {
      const result = supportsWebComponents();
      expect(typeof result).toBe('boolean');
    });
  });

  describe('injectStyles', () => {
    beforeEach(() => {
      // 清理之前的 style 元素
      document.head.innerHTML = '';
    });

    it('应该向文档头部注入样式', () => {
      const styles = '.test { color: red; }';
      injectStyles(styles);

      const styleElement = document.head.querySelector('style');
      expect(styleElement).toBeTruthy();
      expect(styleElement?.textContent).toBe(styles);
    });

    it('应该支持带 ID 的样式注入', () => {
      const styles = '.test { color: blue; }';
      const id = 'test-styles';

      injectStyles(styles, id);

      const styleElement = document.getElementById(id);
      expect(styleElement).toBeTruthy();
      expect(styleElement?.textContent).toBe(styles);
    });

    it('相同ID的样式不应该重复注入', () => {
      const styles1 = '.test1 { color: red; }';
      const styles2 = '.test2 { color: blue; }';
      const id = 'duplicate-test';

      injectStyles(styles1, id);
      injectStyles(styles2, id);

      const styleElements = document.querySelectorAll(`#${id}`);
      expect(styleElements.length).toBe(1);
      expect(styleElements[0].textContent).toBe(styles1);
    });
  });
});
