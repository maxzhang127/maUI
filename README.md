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

开发服务器默认运行在 http://localhost:3001/ ，入口页面位于 `src/index.html`。

## 可用脚本
- `npm run build`：生成压缩后的生产构建，输出至 `dist/`
- `npm run build:dev`：生成未压缩的开发构建，便于调试
- `npm run clean`：清理构建产物
- `npm run type-check`：仅执行 TypeScript 类型检查
- `npm run lint` / `npm run lint:fix`：运行 ESLint（带自动修复）
- `npm run test` / `npm run test:watch`：使用 Jest 在 jsdom 环境中执行单元测试
- `npm run prepublishOnly`：发布前的构建流程（清理 + 构建）

## 在项目中使用

### 在构建工具项目中（Webpack、Vite 等）

当库发布到 npm 后，可通过包管理器安装：

```bash
npm install maui
```

导入入口文件后，自定义元素会被自动注册：

```ts
import 'maui/dist/index.js';

// 也可以按需导入工具函数
import { debounce } from 'maui';

document.body.innerHTML = `
  <ma-button variant="primary">提交</ma-button>
  <ma-input label="邮箱" type="email" required></ma-input>
`;
```

### 在浏览器中直接引用构建产物

如果你使用本仓库生成的 UMD 包，可直接通过 `<script type="module">` 引入：

```html
<script type="module" src="./dist/index.js"></script>

<ma-button size="large" variant="secondary">次要按钮</ma-button>
<ma-input placeholder="搜索" clearable></ma-input>

<script type="module">
  const input = document.querySelector('ma-input');
  input?.addEventListener('ma-change', (event) => {
    const { value, context } = event.detail;
    console.log('当前值：', value, context?.validationResult);
  });
</script>
```

## 组件概览

### `<ma-button>` 按钮组件

```html
<ma-button>默认按钮</ma-button>
<ma-button variant="primary">主要按钮</ma-button>
<ma-button variant="danger" loading>危险操作</ma-button>
<ma-button size="small" disabled>禁用状态</ma-button>
```

#### 属性
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `variant` | `'primary' \| 'secondary' \| 'danger' \| 'ghost'` | `'primary'` | 控制按钮配色样式 |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | 设置按钮尺寸 |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | 按钮原生类型 |
| `disabled` | `boolean` | `false` | 是否禁用按钮交互 |
| `loading` | `boolean` | `false` | 是否显示加载状态并阻止点击 |
| `class` | `string` | `''` | 追加自定义类名到内部 `<button>` |

#### 事件
| 事件 | 描述 | `event.detail` |
| --- | --- | --- |
| `ma-click` | 点击按钮时触发，已过滤禁用和加载状态 | `{ originalEvent: MouseEvent }` |
| `ma-focus` | 内部 `<button>` 获得焦点时触发 | `{ originalEvent: FocusEvent }` |
| `ma-blur` | 内部 `<button>` 失去焦点时触发 | `{ originalEvent: FocusEvent }` |

### `<ma-input>` 输入框组件

```html
<ma-input label="用户名" required></ma-input>
<ma-input type="password" label="密码" helper-text="至少 8 位" clearable></ma-input>
<ma-input variant="filled" size="large" placeholder="搜索关键字"></ma-input>
```

组件支持标签、辅助信息、清除按钮、密码显隐、验证规则等高级特性。

#### 属性
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `type` | `'text' \| 'password' \| 'email' \| ...` | `'text'` | 输入框的原生输入类型 |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | 控制输入框高度与字号 |
| `variant` | `'outlined' \| 'filled' \| 'standard'` | `'outlined'` | 控制边框与填充样式 |
| `label` | `string` | `''` | 浮动标签文本 |
| `placeholder` | `string` | `''` | 占位符内容 |
| `value` | `string` | `''` | 当前输入值（可通过属性或属性反射设置） |
| `disabled` | `boolean` | `false` | 禁用输入 |
| `readonly` | `boolean` | `false` | 只读模式 |
| `required` | `boolean` | `false` | 标记必填字段 |
| `clearable` | `boolean` | `false` | 是否显示清除按钮 |
| `helper-text` | `string` | `''` | 辅助说明文字 |
| `error` | `string` | `''` | 手动设置错误提示内容 |

> 进阶：通过元素实例的 `validationRules` 属性可以配置更复杂的验证逻辑，例如最小长度、自定义函数或异步校验。

#### 事件
| 事件 | 描述 | `event.detail` |
| --- | --- | --- |
| `ma-input` | 用户输入时触发 | `{ value, context, originalEvent }` |
| `ma-change` | 输入值变化并确认时触发 | `{ value, context, originalEvent }` |
| `ma-focus` | 输入获得焦点 | `{ originalEvent: FocusEvent }` |
| `ma-blur` | 输入失去焦点 | `{ originalEvent: FocusEvent }` |
| `ma-enter` | 按下 Enter 键时触发 | `{ value, originalEvent: KeyboardEvent }` |
| `ma-keydown` | 键盘按下事件透出 | `{ originalEvent: KeyboardEvent }` |
| `ma-keyup` | 键盘抬起事件透出 | `{ originalEvent: KeyboardEvent }` |
| `ma-clear` | 通过清除按钮清空输入时触发 | `{ previousValue: string }` |
| `ma-valid` | 验证通过时触发 | `{ result: ValidationResult }` |
| `ma-invalid` | 验证失败时触发 | `{ errors: string[], result: ValidationResult }` |

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

- 单元测试：基于 Jest 和 jsdom，`src/setupTests.ts` 模拟了 Web Components 相关 API
- 代码规范：ESLint + @typescript-eslint，保持一致的编码风格
- 类型安全：`npm run type-check` 可在构建前快速发现类型问题

## 设计文档

- [spec/ma-button-api-design.md](spec/ma-button-api-design.md)
- [spec/ma-input-api-design.md](spec/ma-input-api-design.md)

这些文档记录了组件的设计目标、交互细节与 API 演进，适合在扩展组件集时参考。

## 许可证

本项目基于 [MIT License](LICENSE) 发布，可自由使用、修改与分发。
