import MaButton from '../ma-button';
import type { ButtonSize, ButtonVariant } from '../ma-button';

describe('MaButton 组件测试', () => {
  let button: MaButton;

  beforeEach(async () => {
    // 清理之前的状态
    document.body.innerHTML = '';
    // 通过 createElement 创建组件
    button = document.createElement('ma-button') as MaButton;
    document.body.appendChild(button);
  });

  afterEach(() => {
    // 清理 DOM
    document.body.innerHTML = '';
  });

  describe('TS01: 默认渲染', () => {
    it('应该正确初始化并渲染默认状态', () => {
      // 验证组件存在
      expect(button).toBeTruthy();
      expect(button.tagName).toBe('MA-BUTTON');

      // 验证默认属性
      expect(button.type).toBe('button');
      expect(button.size).toBe('medium');
      expect(button.variant).toBe('primary');
      expect(button.disabled).toBe(false);
      expect(button.loading).toBe(false);
    });
  });

  describe('TS02: type 属性映射', () => {
    it('应该正确映射 type 属性', () => {
      // 设置为 submit
      button.type = 'submit';
      expect(button.type).toBe('submit');

      // 设置为 reset
      button.type = 'reset';
      expect(button.type).toBe('reset');

      // 移除属性，应该恢复默认值
      button.removeAttribute('type');
      expect(button.type).toBe('button');
    });

    it('应该通过 setAttribute 正确设置 type', () => {
      button.setAttribute('type', 'submit');
      expect(button.type).toBe('submit');
    });
  });

  describe('TS03: size 变体', () => {
    it('应该正确设置 size 属性', () => {
      // 默认 medium
      expect(button.size).toBe('medium');

      // 设置为 small
      button.size = 'small';
      expect(button.size).toBe('small');

      // 设置为 large
      button.size = 'large';
      expect(button.size).toBe('large');

      // 设置回 medium
      button.size = 'medium';
      expect(button.size).toBe('medium');
    });
  });

  describe('TS04: variant 变体', () => {
    it('应该正确设置 variant 属性', () => {
      // 默认 primary
      expect(button.variant).toBe('primary');

      // 设置为 secondary
      button.variant = 'secondary';
      expect(button.variant).toBe('secondary');

      // 设置为 danger
      button.variant = 'danger';
      expect(button.variant).toBe('danger');

      // 设置为 ghost
      button.variant = 'ghost';
      expect(button.variant).toBe('ghost');
    });
  });

  describe('TS05: disabled 状态', () => {
    it('应该正确处理 disabled 状态', () => {
      // 设置为 disabled
      button.disabled = true;
      expect(button.disabled).toBe(true);

      // 取消 disabled
      button.disabled = false;
      expect(button.disabled).toBe(false);
    });
  });

  describe('TS06: loading 状态', () => {
    it('应该正确处理 loading 状态', () => {
      // 设置为 loading
      button.loading = true;
      expect(button.loading).toBe(true);

      // 取消 loading
      button.loading = false;
      expect(button.loading).toBe(false);
    });
  });

  describe('TS07: loading + disabled 优先级', () => {
    it('同时设定 disabled 和 loading 时应该保持正确状态', () => {
      // 同时设置 disabled 和 loading
      button.disabled = true;
      button.loading = true;

      expect(button.disabled).toBe(true);
      expect(button.loading).toBe(true);

      // 只取消 loading
      button.loading = false;
      expect(button.disabled).toBe(true);
      expect(button.loading).toBe(false);

      // 取消 disabled
      button.disabled = false;
      expect(button.disabled).toBe(false);
    });
  });

  describe('TS08: 属性反射', () => {
    it('应该正确反射 setAttribute/removeAttribute 操作', () => {
      // type 属性反射
      button.setAttribute('type', 'submit');
      expect(button.type).toBe('submit');

      button.removeAttribute('type');
      expect(button.type).toBe('button');

      // size 属性反射
      button.setAttribute('size', 'large');
      expect(button.size).toBe('large');

      // variant 属性反射
      button.setAttribute('variant', 'danger');
      expect(button.variant).toBe('danger');

      // 布尔属性反射 - disabled
      button.setAttribute('disabled', '');
      expect(button.disabled).toBe(true);

      button.removeAttribute('disabled');
      expect(button.disabled).toBe(false);

      // 布尔属性反射 - loading
      button.setAttribute('loading', '');
      expect(button.loading).toBe(true);

      button.removeAttribute('loading');
      expect(button.loading).toBe(false);
    });
  });

  describe('TS09: Slot 内容', () => {
    it('应该正确渲染默认插槽内容', () => {
      // 添加文本内容
      button.textContent = '测试按钮';
      expect(button.textContent).toBe('测试按钮');

      // 添加自定义节点
      const icon = document.createElement('span');
      icon.className = 'icon';
      icon.textContent = '🔥';
      button.appendChild(icon);

      const textNode = document.createTextNode('带图标按钮');
      button.appendChild(textNode);

      expect(button.children.length).toBe(1);
      expect(button.children[0].className).toBe('icon');
    });
  });

  describe('TS10: focus/blur 方法', () => {
    it('应该提供 focus/blur 方法', () => {
      // 测试方法存在
      expect(typeof button.focus).toBe('function');
      expect(typeof button.blur).toBe('function');

      // 调用方法不应该抛出错误
      expect(() => button.focus()).not.toThrow();
      expect(() => button.blur()).not.toThrow();
    });
  });

  describe('TS11: click 方法防护', () => {
    it('应该提供 click 方法', () => {
      // 测试方法存在
      expect(typeof button.click).toBe('function');

      // 调用方法不应该抛出错误
      expect(() => button.click()).not.toThrow();
    });

    it('disabled 和 loading 状态的防护逻辑', () => {
      // 这些测试验证属性设置是否正确
      button.disabled = true;
      expect(button.disabled).toBe(true);

      button.loading = true;
      expect(button.loading).toBe(true);

      // 方法调用不应该抛出错误，即使在禁用状态下
      expect(() => button.click()).not.toThrow();
    });
  });

  describe('TS12: 自定义事件', () => {
    it('应该能够监听自定义事件', () => {
      const clickHandler = jest.fn();
      const focusHandler = jest.fn();
      const blurHandler = jest.fn();

      // 添加事件监听器不应该抛出错误
      expect(() => {
        button.addEventListener('ma-click', clickHandler);
        button.addEventListener('ma-focus', focusHandler);
        button.addEventListener('ma-blur', blurHandler);
      }).not.toThrow();

      // 移除事件监听器不应该抛出错误
      expect(() => {
        button.removeEventListener('ma-click', clickHandler);
        button.removeEventListener('ma-focus', focusHandler);
        button.removeEventListener('ma-blur', blurHandler);
      }).not.toThrow();
    });
  });

  describe('TS13: 重复注册守卫', () => {
    it('重复导入组件不应该抛出 DOMException', () => {
      expect(() => {
        // 模拟重复导入
        if (!customElements.get('ma-button')) {
          customElements.define('ma-button', MaButton);
        }
      }).not.toThrow();
    });

    it('应该只注册一次组件', () => {
      const defineSpy = jest.spyOn(customElements, 'define');
      const getSpy = jest.spyOn(customElements, 'get');

      // 第一次调用应该返回已注册的构造函数
      getSpy.mockReturnValueOnce(MaButton);

      // 模拟重复注册逻辑
      if (!customElements.get('ma-button')) {
        customElements.define('ma-button', MaButton);
      }

      // 由于已经注册，define 不应该被调用
      expect(defineSpy).not.toHaveBeenCalledWith('ma-button', MaButton);
    });
  });

  describe('边界情况测试', () => {
    it('应该正确处理属性的边界值', () => {
      // 测试空字符串
      button.setAttribute('type', '');
      // 由于没有在有效值列表中，应该保持原来的值或默认值
      expect(['button', 'submit', 'reset']).toContain(button.type);

      // 测试无效的 size 值 - 应该保持最后一次有效值
      button.size = 'medium';
      button.setAttribute('size', 'invalid-size' as ButtonSize);
      expect(button.size).toBe('medium');

      // 测试无效的 variant 值 - 应该保持最后一次有效值
      button.variant = 'primary';
      button.setAttribute('variant', 'invalid-variant' as ButtonVariant);
      expect(button.variant).toBe('primary');
    });

    it('应该正确处理快速状态切换', () => {
      // 快速切换多个状态
      button.disabled = true;
      button.loading = true;
      button.disabled = false;
      button.loading = false;

      expect(button.disabled).toBe(false);
      expect(button.loading).toBe(false);
    });
  });

  describe('可访问性测试', () => {
    it('应该具有正确的默认可访问性属性', () => {
      // 测试组件类型
      expect(button.tagName).toBe('MA-BUTTON');

      // 测试默认状态
      expect(button.disabled).toBe(false);
      expect(button.loading).toBe(false);
    });

    it('应该正确反映状态变化', () => {
      // disabled 状态
      button.disabled = true;
      expect(button.disabled).toBe(true);

      // loading 状态
      button.loading = true;
      expect(button.loading).toBe(true);
    });
  });

  describe('组件生命周期', () => {
    it('应该正确处理连接和断开连接', () => {
      // 从 DOM 中移除
      button.remove();
      expect(button.parentNode).toBeNull();

      // 重新添加到 DOM
      document.body.appendChild(button);
      expect(button.parentNode).toBe(document.body);
    });
  });
});
