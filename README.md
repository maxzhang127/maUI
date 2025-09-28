# 🎨 maUI

> 基于原生 Web Components 构建的现代化 UI 组件库

## ✨ 特性

- 🚀 **原生 Web Components** - 无框架依赖，可在任何项目中使用
- 💪 **TypeScript** - 完整的类型支持
- 🎯 **现代化工具链** - 使用 Webpack + SCSS + TypeScript 构建
- 📦 **轻量级** - 按需加载，最小化包体积
- 🎨 **可定制** - 支持主题定制和样式覆盖
- 🔧 **开发友好** - 完整的开发和构建工具链

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 `http://localhost:3001/` 查看组件展示页面，或者 `http://localhost:3001/demo.html` 查看原始演示。

### 构建

```bash
npm run build
```

### 测试

```bash
npm run test
```

## 📚 组件

### ma-button - 按钮组件

```html
<!-- 基础用法 -->
<ma-button>默认按钮</ma-button>
<ma-button variant="primary">主要按钮</ma-button>

<!-- 不同尺寸 -->
<ma-button size="small">小按钮</ma-button>
<ma-button size="medium">中按钮</ma-button>
<ma-button size="large">大按钮</ma-button>

<!-- 不同状态 -->
<ma-button disabled>禁用按钮</ma-button>
<ma-button loading>加载中</ma-button>
```

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `variant` | `'primary' \| 'secondary' \| 'danger' \| 'ghost'` | `'primary'` | 按钮样式 |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | 按钮尺寸 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `loading` | `boolean` | `false` | 是否加载中 |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | 按钮类型 |

### 事件

| 事件名 | 说明 | 参数 |
|--------|------|------|
| `ma-click` | 点击事件 | `CustomEvent` |
| `ma-focus` | 获得焦点事件 | `CustomEvent` |
| `ma-blur` | 失去焦点事件 | `CustomEvent` |

## 🛠️ 开发

### 项目结构

```
src/
├── components/         # 组件目录
│   └── ma-button/     # 按钮组件
│       ├── ma-button.ts
│       └── ma-button.scss
├── styles/            # 全局样式
├── types/             # 类型定义
├── utils/             # 工具函数
├── demo/              # 演示页面
└── index.ts           # 入口文件
```

### 添加新组件

1. 在 `src/components/` 下创建组件目录
2. 实现 TypeScript 组件类
3. 编写 SCSS 样式
4. 在 `src/index.ts` 中导出
5. 添加到演示页面

### 技术栈

- **TypeScript** - 类型安全的 JavaScript
- **SCSS** - CSS 预处理器
- **Webpack** - 模块打包工具
- **ESLint** - 代码规范检查
- **Jest** - 单元测试框架

## 📄 许可证

MIT License