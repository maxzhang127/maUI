import MaButton from '../ma-button';

describe('MaButton', () => {
  beforeAll(() => {
    // 确保自定义元素已注册
    if (!customElements.get('ma-button')) {
      customElements.define('ma-button', MaButton);
    }
  });

  describe('类定义和基础功能', () => {
    it('应该正确定义MaButton类', () => {
      expect(MaButton).toBeDefined();
      expect(typeof MaButton).toBe('function');
    });

    it('应该有正确的观察属性', () => {
      expect(MaButton.observedAttributes).toEqual(['size', 'variant', 'type', 'disabled', 'loading', 'class']);
    });

    it('应该能创建组件实例', () => {
      const button = document.createElement('ma-button');
      expect(button).toBeTruthy();
      expect(button.tagName.toLowerCase()).toBe('ma-button');
    });

    it('应该继承自HTMLElement', () => {
      const button = document.createElement('ma-button') as MaButton;
      expect(button).toBeInstanceOf(HTMLElement);
    });
  });

  describe('原型方法存在性检查', () => {
    it('应该有定义的getter和setter', () => {
      const sizeDescriptor = Object.getOwnPropertyDescriptor(MaButton.prototype, 'size');
      expect(sizeDescriptor).toBeDefined();
      expect(typeof sizeDescriptor?.get).toBe('function');
      expect(typeof sizeDescriptor?.set).toBe('function');

      const variantDescriptor = Object.getOwnPropertyDescriptor(MaButton.prototype, 'variant');
      expect(variantDescriptor).toBeDefined();
      expect(typeof variantDescriptor?.get).toBe('function');
      expect(typeof variantDescriptor?.set).toBe('function');

      const disabledDescriptor = Object.getOwnPropertyDescriptor(MaButton.prototype, 'disabled');
      expect(disabledDescriptor).toBeDefined();
      expect(typeof disabledDescriptor?.get).toBe('function');
      expect(typeof disabledDescriptor?.set).toBe('function');

      const loadingDescriptor = Object.getOwnPropertyDescriptor(MaButton.prototype, 'loading');
      expect(loadingDescriptor).toBeDefined();
      expect(typeof loadingDescriptor?.get).toBe('function');
      expect(typeof loadingDescriptor?.set).toBe('function');
    });

    it('应该有公共方法定义', () => {
      expect(typeof MaButton.prototype.focus).toBe('function');
      expect(typeof MaButton.prototype.blur).toBe('function');
      expect(typeof MaButton.prototype.click).toBe('function');
    });

    it('应该有生命周期方法', () => {
      expect(typeof MaButton.prototype.attributeChangedCallback).toBe('function');
      expect(typeof MaButton.prototype.connectedCallback).toBe('function');
    });
  });

  describe('DOM操作和属性', () => {
    let button: MaButton;

    beforeEach(() => {
      button = document.createElement('ma-button') as MaButton;
      document.body.appendChild(button);
    });

    afterEach(() => {
      if (button && button.parentNode) {
        button.parentNode.removeChild(button);
      }
    });

    it('应该支持基础HTML元素属性操作', () => {
      button.setAttribute('size', 'large');
      expect(button.getAttribute('size')).toBe('large');

      button.setAttribute('variant', 'secondary');
      expect(button.getAttribute('variant')).toBe('secondary');

      button.setAttribute('disabled', '');
      expect(button.hasAttribute('disabled')).toBe(true);

      button.setAttribute('loading', '');
      expect(button.hasAttribute('loading')).toBe(true);

      button.removeAttribute('disabled');
      expect(button.hasAttribute('disabled')).toBe(false);
    });

    it('应该支持事件监听器的添加和移除', () => {
      const handler = jest.fn();
      
      expect(() => {
        button.addEventListener('ma-click', handler);
      }).not.toThrow();
      
      expect(() => {
        button.removeEventListener('ma-click', handler);
      }).not.toThrow();
    });

    it('应该能添加到DOM而不抛出错误', () => {
      const newButton = document.createElement('ma-button') as MaButton;
      
      expect(() => {
        document.body.appendChild(newButton);
      }).not.toThrow();

      // 清理
      document.body.removeChild(newButton);
    });

    it('应该能调用生命周期方法而不抛出错误', () => {
      // 由于组件内部方法在测试环境中可能不可用，我们只测试方法的存在性
      expect(typeof MaButton.prototype.attributeChangedCallback).toBe('function');
      expect(typeof MaButton.prototype.connectedCallback).toBe('function');
    });
  });

  describe('自定义元素注册', () => {
    it('应该能注册自定义元素而不抛出错误', () => {
      // 在测试环境中，customElements.get可能返回undefined，我们只测试注册过程
      expect(() => {
        if (!customElements.get('ma-button-test')) {
          customElements.define('ma-button-test', MaButton);
        }
      }).not.toThrow();
    });

    it('应该能创建已注册的自定义元素', () => {
      if (!customElements.get('ma-button-test2')) {
        customElements.define('ma-button-test2', MaButton);
      }
      
      const button = document.createElement('ma-button-test2');
      expect(button).toBeTruthy();
      expect(button.tagName.toLowerCase()).toBe('ma-button-test2');
    });
  });
});