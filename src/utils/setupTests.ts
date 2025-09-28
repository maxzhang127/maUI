// Jest 测试环境配置

// 模拟 Web Components API
Object.defineProperty(window, 'customElements', {
  value: {
    define: jest.fn(),
    get: jest.fn(),
    whenDefined: jest.fn().mockResolvedValue(undefined)
  },
  writable: true
});

// 模拟 ShadowRoot
Object.defineProperty(Element.prototype, 'attachShadow', {
  value: jest.fn().mockReturnValue({
    appendChild: jest.fn(),
    innerHTML: '',
    querySelector: jest.fn(),
    querySelectorAll: jest.fn()
  }),
  writable: true
});

// 模拟 getRootNode
Object.defineProperty(Element.prototype, 'getRootNode', {
  value: jest.fn().mockReturnValue(document),
  writable: true
});

// 全局测试配置
beforeEach(() => {
  // 清理已注册的自定义元素
  jest.clearAllMocks();
});