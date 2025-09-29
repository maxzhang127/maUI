# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于原生 Web Components 构建的 UI 组件库，使用 TypeScript、SCSS 和 Webpack。项目专注于创建可复用的原生 Web Components，无需任何框架依赖。

## 关键开发命令

### 核心开发流程
- `npm run dev` - 启动开发服务器（http://localhost:3001）
- `npm run build` - 生产环境构建
- `npm run build:dev` - 开发环境构建
- `npm run type-check` - TypeScript 类型检查
- `npm run lint` - ESLint 代码检查
- `npm run format` - Prettier 代码格式化

### 测试相关
- `npm test` - 运行所有测试（包含 mock 生成）
- `npm run test:watch` - 监听模式下运行测试
- `npm run generate:mocks` - 生成 HTML 模板的 mock 文件

### 清理和发布
- `npm run clean` - 清理 dist 目录
- `npm run prepublishOnly` - 发布前清理并构建

## 项目架构

### 组件基础架构
所有组件都基于 `ComponentsBase` 抽象类（`src/components/componentsBase.ts`），提供：
- Shadow DOM 封装
- 样式注入（支持 CSSStyleSheet API 和降级方案）
- 属性监听和状态管理
- 自定义事件分发
- 生命周期管理

### 文件结构模式
每个组件遵循标准结构：
```
src/components/[component-name]/
├── [component-name].ts      # 组件逻辑
├── [component-name].scss    # 组件样式
├── template.html            # HTML 模板
└── __tests__/              # 测试文件
```

### 样式系统
- 组件样式使用 `?inline` 导入进入 Shadow DOM
- 支持 SCSS 预处理
- CSS Modules 用于组件样式（除 demo 目录）
- Demo 样式不使用 CSS Modules

### TypeScript 配置
- 路径别名：`@/*` 映射到 `src/*`
- HTML 模板导入：`@tpl/*.html` 映射到组件模板
- 严格模式启用
- 支持装饰器语法

### 测试策略
- Jest + jsdom 环境
- 自动生成 HTML 模板 mock
- 覆盖率收集排除 demo 和类型定义文件
- 测试路径：`__tests__` 目录或 `.test/.spec` 文件

## 组件开发指南

### 创建新组件
1. 继承 `ComponentsBase` 类
2. 在构造函数中调用 `super()` 并传入组件配置
3. 实现 `_createElements()` 抽象方法
4. 可选覆盖 `_bindEvents()` 和 `_updateComponent()` 方法
5. 在 `src/components.ts` 中导出新组件

### 属性管理
- 使用 `observedAttributes` 声明监听的属性
- 通过 getter/setter 模式管理属性
- 使用 `_getAttributeWithDefault()` 处理属性验证
- 使用 `_setAttribute()` 统一设置属性

### 样式处理
- 组件样式文件使用 `?inline` 导入
- 利用 Shadow DOM 样式封装
- 支持现代 CSSStyleSheet API 和传统 style 标签降级

### 模板系统
- HTML 模板文件通过 webpack 别名导入
- 测试环境下自动生成 mock 文件
- 使用 `scripts/generate-html-mocks.js` 维护模板 mock

## Webpack 配置要点

### 入口和输出
- 开发入口：`src/demo/index.ts`
- UMD 格式输出到 `dist/`
- 支持 content hash 用于缓存

### 加载器配置
- TypeScript: `ts-loader`
- SCSS: 支持 inline 导入和 CSS Modules
- HTML: `html-loader` 处理模板文件
- 静态资源: `asset/resource` 处理图片和字体

### 开发服务器
- 端口：3001
- 热重载支持
- 静态文件服务

## 注意事项

### 代码质量
- ESLint 配置包含 TypeScript 和 Prettier 集成
- 生产环境禁用 console 和 debugger
- 未使用变量检查（下划线前缀忽略）

### 构建优化
- 生产环境启用代码分割
- CSS 提取到单独文件
- 自动生成 TypeScript 声明文件

### 浏览器兼容性
- 目标 ES2020
- Web Components 原生支持检测
- Shadow DOM 和 Custom Elements API 依赖