# maUI

maUI 是一个基于原生 Web Components 的现代 UI 组件库，使用 TypeScript、SCSS 和 Webpack 构建，提供可复用的原生组件与实用工具函数。组件在导入时会自动注册为自定义元素，因此可以直接在任何框架或纯 HTML 项目中使用。

## 功能亮点

- 原生 Web Components：无需框架运行时即可工作，兼容各类技术栈
- TypeScript 全覆盖：提供类型定义，便于智能提示与安全重构
- 模块化构建：Webpack 生成 UMD 包，既能按需引入也能直接挂载到浏览器
- 可定制主题：通过 CSS 变量覆盖配色、圆角、阴影等设计令牌
- 开发工具完备：集成 ESLint、Jest、tsc、Webpack Dev Server，便于构建、调试与测试

## 快速开始

### 环境要求

- Node.js 18 及以上
- npm 9 及以上（或使用 pnpm、yarn 等兼容包管理器）

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

开发服务器默认运行在 http://localhost:3001/ ，入口页面位于 `src/demo/index.html`。

## 可用脚本

### 开发相关

- `npm run dev`：启动开发服务器（http://localhost:3001）
- `npm run build`：生成压缩后的生产构建，输出至 `dist/`
- `npm run build:dev`：生成未压缩的开发构建，便于调试
- `npm run clean`：清理构建产物

### 代码质量

- `npm run type-check`：仅执行 TypeScript 类型检查
- `npm run lint`：运行 ESLint 代码检查
- `npm run lint:fix`：运行 ESLint 并自动修复可修复的问题
- `npm run format`：使用 Prettier 格式化代码
- `npm run format:check`：检查代码格式是否符合 Prettier 规范

### 测试相关

- `npm test`：运行所有测试（包含 mock 生成）
- `npm run test:watch`：监听模式下运行测试
- `npm run generate:mocks`：生成 HTML 模板的 mock 文件

### 发布相关

- `npm run prepublishOnly`：发布前的构建流程（清理 + 构建）

## 组件概览

### `<ma-button>` 按钮组件
详细的 API 文档和使用示例请参考：[spec/ma-button-api-design.md](spec/ma-button-api-design.md)

### `<ma-input>` 输入框组件
详细的 API 文档和使用示例请参考：[spec/ma-input-api-design.md](spec/ma-input-api-design.md)

## 工具函数

- `generateId(prefix)`：生成基础的自定义元素唯一标识
- `classNames(...classes)`：合并类名的轻量工具
- `deepMerge(target, source)`：对嵌套对象执行深度合并
- `debounce(func, wait)`：生成防抖函数，延迟调用
- `throttle(func, limit)`：生成节流函数，限制调用频率
- `supportsWebComponents()`：检测当前环境是否支持 Web Components
- `injectStyles(styles, id?)`：向文档注入样式表，可选 id 防止重复注入

## 自定义主题

库的全局样式通过 CSS 变量暴露，可在应用层覆盖这些变量实现主题定制：

```css
:root {
  --ma-primary: #2563eb;
  --ma-primary-dark: #1d4ed8;
  --ma-border-radius-md: 10px;
  --ma-shadow-md: 0 8px 20px rgba(37, 99, 235, 0.2);
}
```

也可以根据需要在组件容器作用域内局部覆盖变量，实现多主题并存。

## 项目结构

```text
├── src/
│   ├── components/        # Web Components 源码
│   │   ├── ma-button/
│   │   └── ma-input/
│   ├── styles/            # 全局样式与设计令牌
│   ├── types/             # 类型定义出口
│   ├── utils/             # 工具函数集合
│   ├── index.html         # 开发预览页面
│   └── index.ts           # 包入口，导出组件与工具
├── spec/                  # 组件 API 设计文档
├── dist/                  # 构建输出（执行 npm run build 后生成）
├── jest.config.js         # Jest 配置（jsdom 环境）
├── tsconfig.json          # TypeScript 配置
└── webpack.config.ts      # Webpack 构建配置
```

## 质量保障

- 单元测试：基于 Jest 和 jsdom，`src/utils/setupTests.ts` 模拟了 Web Components 相关 API
- 代码规范：ESLint + @typescript-eslint，保持一致的编码风格
- 类型安全：`npm run type-check` 可在构建前快速发现类型问题

## 设计文档

- [spec/ma-button-api-design.md](spec/ma-button-api-design.md)
- [spec/ma-input-api-design.md](spec/ma-input-api-design.md)

这些文档记录了组件的设计目标、交互细节与 API 演进，适合在扩展组件集时参考。

## 许可证

本项目基于 [MIT License](LICENSE) 发布，可自由使用、修改与分发。
