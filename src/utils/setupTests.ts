// Jest 测试环境配置

// 存储已注册的组件
const registeredElements = new Map<string, CustomElementConstructor>();

// 创建更真实的ShadowRoot mock
function createMockShadowRoot() {
  const shadowRoot = document.createElement('div');
  Object.defineProperties(shadowRoot, {
    host: {
      value: null,
      writable: true,
    },
    mode: {
      value: 'open',
      writable: false,
    },
    innerHTML: {
      get() {
        return this.innerHTML;
      },
      set(value: string) {
        this.innerHTML = value;
      },
    },
  });
  return shadowRoot;
}

// 模拟 Web Components API
Object.defineProperty(window, 'customElements', {
  value: {
    define: jest.fn((name: string, constructor: CustomElementConstructor) => {
      registeredElements.set(name, constructor);
    }),
    get: jest.fn((name: string) => {
      return registeredElements.get(name);
    }),
    whenDefined: jest.fn().mockResolvedValue(undefined),
  },
  writable: true,
});

// 模拟 ShadowRoot
Object.defineProperty(Element.prototype, 'attachShadow', {
  value: jest.fn(function (this: Element, options: ShadowRootInit) {
    const shadowRoot = createMockShadowRoot();
    // @ts-ignore
    shadowRoot.host = this;
    return shadowRoot;
  }),
  writable: true,
});

// 模拟 getRootNode
Object.defineProperty(Element.prototype, 'getRootNode', {
  value: jest.fn().mockReturnValue(document),
  writable: true,
});

// 模拟 CSS 支持检测
Object.defineProperty(window, 'CSS', {
  value: {
    supports: jest.fn().mockReturnValue(true),
  },
  writable: true,
});

// 模拟 CSSStyleSheet (用于 Constructable Stylesheets)
global.CSSStyleSheet = jest.fn().mockImplementation(() => ({
  replaceSync: jest.fn(),
  replace: jest.fn().mockResolvedValue(undefined),
  insertRule: jest.fn(),
  deleteRule: jest.fn(),
  cssRules: [],
}));

// 全局测试配置
beforeEach(() => {
  // 清理已注册的自定义元素
  registeredElements.clear();
  jest.clearAllMocks();
});
